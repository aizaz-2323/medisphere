import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    specialisation: '',
    qualification: '',
    licenseNumber: '',
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/doctors/me')
      .then((res) => {
        const d = res.data;
        if (d) {
          setForm({
            specialisation: d.specialisation || '',
            qualification: d.qualification || '',
            licenseNumber: d.license_number || '',
          });
          setStatus(d.verification_status);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = new FormData();
      data.append('specialisation', form.specialisation);
      data.append('qualification', form.qualification);
      data.append('license_number', form.licenseNumber);
      if (file) data.append('credentialDoc', file);

      const res = await api.post('/doctors/profile', data);
      setStatus(res.data.doctor.verification_status);
      setMessage('Profile submitted for verification.');
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const badgeStyle = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const badgeText = {
    pending: 'Verification Pending',
    verified: 'Verified Doctor',
    rejected: 'Verification Rejected',
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-700 text-sm mb-4"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Doctor Profile</h2>
          {status && (
            <span className={`px-3 py-1 rounded-full text-sm ${badgeStyle[status]}`}>
              {badgeText[status]}
            </span>
          )}
        </div>

        <label className="block mb-1">Specialization</label>
        <input
          name="specialisation"
          value={form.specialisation}
          onChange={handleChange}
          placeholder="e.g. Cardiologist"
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block mb-1">Qualification</label>
        <input
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          placeholder="e.g. MBBS, FCPS"
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block mb-1">License Number</label>
        <input
          name="licenseNumber"
          value={form.licenseNumber}
          onChange={handleChange}
          placeholder="PMDC license number"
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block mb-1">
          Credential Document (PDF or image, max 5 MB)
        </label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}