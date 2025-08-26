// src/pages/Login.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user_store";

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour
const mockUser = {
  id: "user-456",
  name: "John Smith",
  email: "john.smith@example.com",
  preferredTheme: "light",
  expiresAt: new Date().getTime() + SESSION_DURATION,
};

const Login: React.FC = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    // In a real app, you would perform authentication here
    console.log("Logging in...");
    setUser(mockUser);
    // Redirect to a protected page after login
    navigate("/");
  };

  // return (
  //   <div className='login-container p-4'>
  //     <h2 className='text-2xl'>Login Page</h2>
  //     <p>You must log in to view the dashboard.</p>
  //     <button className='btn btn-primary' onClick={handleLogin}>
  //       Log In
  //     </button>
  //   </div>
  // );

  return (
    <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-2xl/9 font-bold tracking-tight text-content/50'>
          Sign in to your account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
        <div className='bg-base-300 text-content px-6 py-12 shadow sm:rounded-lg sm:px-12'>
          <form action='#' onSubmit={handleLogin} className='space-y-6'>
            <div>
              <label htmlFor='email' className='block text-sm/6  '>
                Email address
              </label>
              <div className='mt-2'>
                <input
                  defaultValue={"servizio3@innovazione.gov.it"}
                  id='email'
                  type='email'
                  name='email'
                  required
                  autoComplete='email'
                  className='input'
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm/6'>
                Password
              </label>
              <div className='mt-2'>
                <input
                  defaultValue={"123password"}
                  id='password'
                  type='password'
                  name='password'
                  required
                  autoComplete='current-password'
                  className='input'
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex gap-3'>
                <div className='flex h-6 shrink-0 items-center'>
                  <div className='group grid size-4 grid-cols-1'>
                    <input
                      id='remember-me'
                      type='checkbox'
                      name='remember-me'
                      className='checkbox'
                    />
                  </div>
                </div>
                <label htmlFor='remember-me' className='block text-sm/6'>
                  Remember me
                </label>
              </div>

              <div className='text-sm/6'>
                <a href='#' className='link-primary'>
                  Forgot password?
                </a>
              </div>
            </div>

            <center>
              <button type='submit' className='btn btn-primary btn-wide'>
                Sign in
              </button>
            </center>
          </form>
        </div>

        <p className='mt-10 text-center text-sm/6 text-gray-500'>
          {`Not a member? `}
          <a href='#' className='font-semibold link-primary'>
            {` Register`}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
