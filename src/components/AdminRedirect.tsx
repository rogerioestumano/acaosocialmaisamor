import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRedirectProps {
  children: React.ReactNode;
}

const AdminRedirect = ({ children }: AdminRedirectProps) => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is authenticated, profile is loaded, and user is admin
    if (!loading && user && profile && isAdmin) {
      navigate('/dashboard');
    }
  }, [user, profile, isAdmin, loading, navigate]);

  // Show children (Index page) if not admin or still loading
  return <>{children}</>;
};

export default AdminRedirect;