import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Container, Box, Avatar, Typography, TextField, Button, Grid, Link, Alert, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { loginUser } from "../../services/firebase";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setError("");
			setLoading(true);
			await loginUser(email, password);
			navigate("/");
		} catch (err) {
			setError("Failed to sign in. Please check your credentials.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper elevation={6} sx={{ mt: 8, p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign In
				</Typography>
				{error && (
					<Alert severity="error" sx={{ width: "100%", mt: 2 }}>
						{error}
					</Alert>
				)}
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
					<TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
					<TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
					<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link component={RouterLink} to="/forgot-password" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link component={RouterLink} to="/register" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
};

export default Login;
