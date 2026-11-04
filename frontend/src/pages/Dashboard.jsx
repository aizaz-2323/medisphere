import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <h1 className="text-3xl font-bold text-slate-800">
          Welcome to MediSphere
        </h1>

        <p className="mt-2 text-slate-500">
          Logged in as {user.email}
        </p>

        <p className="mt-1 text-sm font-semibold text-blue-600">
          Role: {user.role}
        </p>

        <div className="mt-8 space-y-4">

          {user.role === 'Doctor' && (
            <>
              <Link
                to="/doctor-profile"
                className="block rounded-lg bg-white p-5 shadow border border-slate-200"
              >
                Complete Your Profile
              </Link>

              <Link
                to="/clinic-builder"
                className="block rounded-lg bg-white p-5 shadow border border-slate-200"
              >
                Set Up Clinic
              </Link>

              <Link
                to="/clinic-availability"
                className="block rounded-lg bg-white p-5 shadow border border-slate-200"
              >
                View Available Slots
              </Link>
            </>
          )}

          {user.role === 'Admin' && (
            <Link
              to="/admin/users"
              className="block rounded-lg bg-white p-5 shadow border border-slate-200"
            >
              Manage Users
            </Link>
          )}

          {user.role === 'Receptionist' && (
            <Link
              to="/appointments"
              className="block rounded-lg bg-white p-5 shadow border border-slate-200"
            >
              Manage Appointments
            </Link>
          )}

          {user.role === 'Patient' && (
            <div className="rounded-lg bg-white p-5 shadow border border-slate-200">
              Patient Dashboard
            </div>
          )}

        </div>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;