import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const defaultHours = Object.fromEntries(
  DAYS.map((d) => [
    d,
    d === 'saturday' || d === 'sunday'
      ? { closed: true }
      : { open: '09:00', close: '17:00' },
  ])
);

export default function ClinicBuilder() {
  const navigate = useNavigate();
  const [clinicId, setClinicId] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', fee: '' });
  const [hours, setHours] = useState(defaultHours);
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/clinics/me/clinic')
      .then((res) => {
        const c = res.data;
        if (c) {
          setClinicId(c.id);
          setForm({
            name: c.name || '',
            address: c.address || '',
            phone: c.phone || '',
            fee: c.consultation_fee || '',
          });
          if (c.working_hours) setHours(c.working_hours);
          setLogoUrl(c.logo_url || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleClosed = (day) => {
    const isClosed = hours[day].closed;
    setHours({
      ...hours,
      [day]: isClosed ? { open: '09:00', close: '17:00' } : { closed: true },
    });
  };

  const setTime = (day, field, value) => {
    setHours({ ...hours, [day]: { ...hours[day], [field]: value } });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('address', form.address);
      data.append('phone', form.phone);
      data.append('consultation_fee', form.fee);
      data.append('working_hours', JSON.stringify(hours));
      if (logo) data.append('logo', logo);

      const res = clinicId
        ? await api.put(`/clinics/${clinicId}`, data)
        : await api.post('/clinics', data);

      setClinicId(res.data.clinic.id);
      setLogoUrl(res.data.clinic.logo_url || '');
      setMessage(clinicId ? 'Clinic updated successfully.' : 'Clinic created successfully.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-700 text-sm mb-4"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {clinicId ? 'Edit Your Clinic' : 'Set Up Your Clinic'}
        </h2>

        <label className="block mb-1">Clinic Name</label>
        <input name="name" value={form.name} onChange={handleChange}
          placeholder="e.g. City Care Clinic"
          className="w-full border rounded p-2 mb-3" />

        <label className="block mb-1">Address</label>
        <input name="address" value={form.address} onChange={handleChange}
          placeholder="Street, area, city"
          className="w-full border rounded p-2 mb-3" />

        <label className="block mb-1">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange}
          placeholder="03XXXXXXXXX"
          className="w-full border rounded p-2 mb-3" />

        <label className="block mb-1">Consultation Fee (PKR)</label>
        <input name="fee" type="number" value={form.fee} onChange={handleChange}
          placeholder="e.g. 1500"
          className="w-full border rounded p-2 mb-3" />

        <label className="block mb-1">Clinic Logo (image, max 5 MB)</label>
        {logoUrl && !logo && (
          <p className="text-xs text-gray-500 mb-1">A logo is already uploaded. Choose a file to replace it.</p>
        )}
        <input type="file" accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="w-full mb-5" />

        <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
        <div className="space-y-2 mb-5">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-24 capitalize">{day}</span>
              <label className="flex items-center gap-1 text-sm">
                <input type="checkbox"
                  checked={!!hours[day].closed}
                  onChange={() => toggleClosed(day)} />
                Closed
              </label>
              {!hours[day].closed && (
                <>
                  <input type="time" value={hours[day].open || '09:00'}
                    onChange={(e) => setTime(day, 'open', e.target.value)}
                    className="border rounded p-1" />
                  <span>to</span>
                  <input type="time" value={hours[day].close || '17:00'}
                    onChange={(e) => setTime(day, 'close', e.target.value)}
                    className="border rounded p-1" />
                </>
              )}
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
          {loading ? 'Saving...' : clinicId ? 'Update Clinic' : 'Create Clinic'}
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}