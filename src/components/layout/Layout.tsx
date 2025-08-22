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
      className='layout min-h-screen bg-base-100 flex flex-col'
      data-theme={currentTheme}
    >
      <div className='sticky top-0 z-50 shadow-md'>
        <Navbar currentTheme={settings?.preferredTheme || "light"} />
      </div>
      <div className='bg-base-100 p-4 md:py-8 h-full grow-1 '>{children}</div>
      <footer className='footer footer-center p-4 bg-primary text-primary-content border-t border-primary mt-4'>
        <div>
          <p>{new Date().getFullYear()} - Servizio3.</p>
        </div>
      </footer>
    </div>
  );
}
