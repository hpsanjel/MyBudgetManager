import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Auth Components
import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import ForgotPassword from "./pages/auth/ForgotPassword";

// Protected Components
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
// import Income from "./pages/Income";
import Savings from "./pages/Savings";
// import Reports from "./pages/Reports";
// import Settings from "./pages/Settings";

// Layout Components
// import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Register from "./pages/auth/Register";
import Income from "./pages/Income";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#2e7d32",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					{/* Auth Routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					{/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

					{/* Protected Routes */}
					<Route
						path="/"
						element={
							<Layout />
							// <ProtectedRoute>
							// </ProtectedRoute>
						}
					>
						<Route index element={<Dashboard />} />
						<Route path="budgets" element={<Budgets />} />
						<Route path="expenses" element={<Expenses />} />
						<Route path="income" element={<Income />} />
						<Route path="savings" element={<Savings />} />
						<Route path="reports" element={<Reports />} />
						<Route path="settings" element={<Settings />} />
					</Route>
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
