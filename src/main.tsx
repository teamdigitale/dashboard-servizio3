import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/layout/Layout.tsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import App from "./routes/App.tsx";
import Data from "./routes/Data.tsx";
import Fse from "./routes/Fse.tsx";
import Login from "./routes/Login.tsx";
import PA26 from "./routes/PA26.tsx";
import Teseo from "./routes/teseo.tsx";

const paths = [
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<App />
			</ProtectedRoute>
		),
	},
	{
		path: "/pa26",
		element: (
			<ProtectedRoute>
				<PA26 />
			</ProtectedRoute>
		),
	},
	{
		path: "/fse",
		element: (
			<ProtectedRoute>
				<Fse />
			</ProtectedRoute>
		),
	},
	{
		path: "/teseo",
		element: (
			<ProtectedRoute>
				<Teseo />
			</ProtectedRoute>
		),
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/data",
		element: <Data />,
	},
];

const router = createBrowserRouter(paths);

createRoot(document.getElementById("root")!).render(
	<Layout>
		<RouterProvider router={router} />
	</Layout>,
);
