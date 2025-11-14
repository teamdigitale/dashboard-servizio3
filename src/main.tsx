import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./components/layout/Layout.tsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import Login from "./routes/Login.tsx";

import App from "./routes/App.tsx";
import PA26 from "./routes/PA26.tsx";
import Data from "./routes/Data.tsx";

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
