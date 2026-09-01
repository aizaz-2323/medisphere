import { useState } from 'react';
import axios from 'axios';

const ROLE_OPTIONS = [
  { id: 2, label: 'Doctor' },
  { id: 4, label: 'Patient' },
];

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', role_id: 4 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        ...form,
        role_id: Number(form.role_id),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  if (success) return <p>Account created! You can now log in.</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Create Account</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        name="password"
        type="password"
        placeholder="Password (min 8 chars)"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <select
        name="role_id"
        value={form.role_id}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        {ROLE_OPTIONS.map((r) => (
          <option key={r.id} value={r.id}>{r.label}</option>
        ))}
      </select>
      <button type="submit" className="bg-teal-600 text-white p-2 w-full rounded">
        Sign Up
      </button>
    </form>
  );
}