// src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/user_store.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUserStore();
  const [path, setPath] = React.useState<string>('');

  useEffect(() => {
    const url = window.location.href;
    console.log('Current URL:', url);
    const path = new URL(url).pathname;
    console.log('Current Path:', path);
    setPath(path);
  }, []);
  // If a user is logged in, render the child component
  // return <>{children}</>;

  if (!user) {
    // If no user is logged in, redirect to the /login page
    // 'replace' prevents the user from navigating back to the protected route
    return <Navigate to='/login' replace />;
  }

  return (
    <div className='flex h-full w-full'>
      <div className='hidden md:flex bg-base-300 text-content md:w-56 border-r mr-4 p-4 flex-col'>
        <div className='mb-3'>
          <a
            href='/'
            className={` ${
              !path || path == '/' ? 'link-disabled' : 'link link-primary'
            } `}
          >
            SERVIZIO 3
          </a>
        </div>
        <div>
          <a
            href='/pa26'
            className={` ${
              path.indexOf('/pa26') >= 0 ? 'link-disabled' : 'link link-primary'
            } `}
          >
            PA DIGITALE 2026
          </a>
        </div>
      </div>
      <div className='w-full h-full overflow-y-auto'>{children}</div>
    </div>
  );
};

export default ProtectedRoute;
