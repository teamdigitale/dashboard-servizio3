import { useEffect } from "react";
import { useUserStore } from "../../store/user_store";
import { useSettingsStore } from "../../store/settings_store";
import Navbar from "./NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { checkSession } = useUserStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    // Check the session every time the application loads or this component mounts
    checkSession();
  }, [checkSession]);

  const currentTheme = settings?.preferredTheme === "dark" ? "dim" : "italia";
  return (
    <div
      className='bg-base-100 flex flex-col h-screen w-screen overflow-hidden max-h-screen max-w-screen'
      data-theme={currentTheme}
    >
      <div className='shadow-md h-16 w-full shrink-0'>
        <Navbar currentTheme={settings?.preferredTheme || "light"} />
      </div>
      <div className='grow-1 overflow-y-auto'>{children}</div>
      <footer className='h-16 w-full shrink-0 footer footer-center p-4 bg-base-200 text-content border-t border-content'>
        <div>
          <p>{new Date().getFullYear()} - Servizio3.</p>
        </div>
      </footer>
    </div>
  );
}
