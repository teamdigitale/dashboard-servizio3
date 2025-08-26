// src/components/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../store/user_store.ts";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUserStore();

  if (!user) {
    // If no user is logged in, redirect to the /login page
    // 'replace' prevents the user from navigating back to the protected route
    return <Navigate to='/login' replace />;
  }

  // If a user is logged in, render the child component
  // return <>{children}</>;

  return (
    <div className='flex h-full w-full'>
      <div className='hidden md:flex bg-base-300 text-content md:w-56 border-r mr-4 p-4 flex-col '>
        <div>SIDEBAR</div>
      </div>
      <div className='w-full h-full overflow-y-auto'>{children}</div>
    </div>
  );
};

export default ProtectedRoute;
