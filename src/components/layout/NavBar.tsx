import { useUserStore } from "../../store/user_store";
import ThemeChooser from "./ThemeChooser";

const paths = [
  {
    path: "",
    label: "home",
  },
  {
    path: "#",
    label: "Other Pages",
    sub: [
      {
        path: "",
        label: "Aaaaaaaaaaaaa",
      },
      {
        path: "",
        label: "Bbbbbbbbbbbb",
      },
      {
        path: "",
        label: "Cccccccccccc",
      },
    ],
  },
];

export default function NavBar({ currentTheme }: { currentTheme: string }) {
  const { user, clearUser } = useUserStore();
  const handleLogout = () => {
    clearUser();
  };
  return (
    <div className='navbar bg-primary text-primary-content shadow-sm'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-primary text-primary-content z-10 mt-3 w-52 p-2 shadow'
          >
            {paths.map((route) => {
              if (route.sub) {
                return (
                  <li key={route.label}>
                    <a className='capitalize' href='#'>
                      {route.label}
                    </a>
                    <ul className='p-2'>
                      {route.sub.map((subRoute) => (
                        <li key={subRoute.label}>
                          <a className='capitalize' href={`/${subRoute.path}`}>
                            {subRoute.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={route.label}>
                  <a className='capitalize' href={`/${route.path}`}>
                    {route.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <a className='btn btn-ghost text-2xl' href='/'>
          Servizio3
        </a>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 z-5 rounded-none'>
          {paths.map((route) => {
            if (route.sub) {
              return (
                <li key={route.label}>
                  <details>
                    <summary className='capitalize'>{route.label}</summary>
                    <ul className='p-2 z-10 bg-primary text-primary-content rounded-none'>
                      {route.sub.map((subRoute) => (
                        <li key={subRoute.label} className='min-w-[200px]'>
                          <a className='capitalize' href={`/${subRoute.path}`}>
                            {subRoute.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            }

            return (
              <li key={route.label}>
                <a className='capitalize' href={`/${route.path}`}>
                  {route.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='navbar-end'>
        <div className='flex items-center gap-4'>
          <ThemeChooser currentTheme={currentTheme} />
          <div>
            {user ? (
              <div>
                <span className='px-2'>
                  <button
                    className='btn btn-outline btn-sm'
                    onClick={() => handleLogout()}
                  >
                    logout
                  </button>
                </span>
              </div>
            ) : (
              <a href='/login' className='btn btn-outline btn-sm'>
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
