import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); // guards against StrictMode's double effect call

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: decodedUser.id,
          email: decodedUser.email,
          role: decodedUser.role,
        })
      );
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [navigate, searchParams]);

  return <p>Signing you in...</p>;
}

export default OAuthSuccess;