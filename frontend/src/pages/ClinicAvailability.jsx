import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

export default function ClinicAvailability() {
  const navigate = useNavigate();
  const [clinicId, setClinicId] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/clinics/me/clinic')
      .then((res) => {
        if (res.data) setClinicId(res.data.id);
        else setMessage('Please set up your clinic first.');
      })
      .catch(() => setMessage('Could not load your clinic.'));
  }, []);

  useEffect(() => {
    if (!clinicId || !date) return;
    setLoading(true);
    setMessage('');
    api
      .get(`/clinics/${clinicId}/availability`, { params: { date } })
      .then((res) => {
        setSlots(res.data.slots);
        setDay(res.data.day);
      })
      .catch(() => setMessage('Could not load available slots.'))
      .finally(() => setLoading(false));
  }, [clinicId, date]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-700 text-sm mb-4"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-semibold mb-4">Available Time Slots</h2>

        <label className="block mb-1">Choose a date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 mb-4"
        />

        {message && <p className="text-sm text-red-600 mb-3">{message}</p>}
        {loading && <p className="text-sm text-gray-600">Loading slots...</p>}

        {date && !loading && !message && (
          <>
            <p className="text-sm text-gray-600 mb-3 capitalize">{day}</p>
            {slots.length === 0 ? (
              <p>No slots available this day</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((time) => (
                  <button
                    key={time}
                    className="px-3 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50"
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}