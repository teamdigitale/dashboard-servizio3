import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process?.cwd());
  const SERVER_URL = `${env.VITE_SERVER_URL ?? "http://localhost:3003"}`;

  return {
    server: {
      proxy: {
        "/charts": SERVER_URL,
        "/auth": SERVER_URL,
      },
    },
    plugins: [react(), tailwindcss()],
  };
});
