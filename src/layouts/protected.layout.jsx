import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedLayout = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    // Redirect to sign-in, preserving the current URL
    const redirectUrl = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedLayout;