import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireBeneficiario?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireBeneficiario = false 
}) => {
  const { user, profile, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  // Only allow admin users to access protected routes
  if (profile.user_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};