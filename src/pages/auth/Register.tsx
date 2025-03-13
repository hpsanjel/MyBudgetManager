import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Container, Box, Avatar, Typography, TextField, Button, Grid, Link, Alert, Paper, Stepper, Step, StepLabel, CircularProgress } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { registerUser } from "../../services/firebase";

const Register = () => {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Form data
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// Form validation errors
	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// Current date and time
	const currentDateTime = "2025-03-13 16:34:31";
	const username = "hpsanjel";

	// Steps for registration
	const steps = ["Personal Information", "Account Details", "Confirmation"];

	const handleNext = () => {
		if (activeStep === 0) {
			// Validate personal information
			let valid = true;
			const newErrors = { ...errors };

			if (!formData.firstName.trim()) {
				newErrors.firstName = "First name is required";
				valid = false;
			} else {
				newErrors.firstName = "";
			}

			if (!formData.lastName.trim()) {
				newErrors.lastName = "Last name is required";
				valid = false;
			} else {
				newErrors.lastName = "";
			}

			setErrors(newErrors);

			if (!valid) return;
		} else if (activeStep === 1) {
			// Validate account details
			let valid = true;
			const newErrors = { ...errors };

			// Email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!formData.email.trim() || !emailRegex.test(formData.email)) {
				newErrors.email = "Please enter a valid email address";
				valid = false;
			} else {
				newErrors.email = "";
			}

			// Password validation
			if (formData.password.length < 6) {
				newErrors.password = "Password must be at least 6 characters";
				valid = false;
			} else {
				newErrors.password = "";
			}

			// Confirm password validation
			if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match";
				valid = false;
			} else {
				newErrors.confirmPassword = "";
			}

			setErrors(newErrors);

			if (!valid) return;
		}

		setActiveStep((prevStep) => prevStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		// Clear error when typing
		if (errors[name as keyof typeof errors]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError("");
			await registerUser(formData.email, formData.password);
			// Registration successful, redirect to login
			navigate("/login", {
				state: { message: "Registration successful! Please login with your new account." },
			});
		} catch (err: any) {
			setError(err.message || "Failed to register. Please try again.");
			setActiveStep(1); // Go back to account details step
		} finally {
			setLoading(false);
		}
	};

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField autoComplete="given-name" name="firstName" required fullWidth id="firstName" label="First Name" autoFocus value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="family-name" value={formData.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
						</Grid>
					</Grid>
				);
			case 1:
				return (
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
						</Grid>
						<Grid item xs={12}>
							<TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} />
						</Grid>
						<Grid item xs={12}>
							<TextField required fullWidth name="confirmPassword" label="Confirm Password" type="password" id="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} />
						</Grid>
					</Grid>
				);
			case 2:
				return (
					<Box sx={{ mt: 2 }}>
						<Typography variant="h6" gutterBottom>
							Account Summary
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={4}>
								<Typography variant="subtitle2" color="text.secondary">
									Name:
								</Typography>
							</Grid>
							<Grid item xs={8}>
								<Typography variant="body1">{`${formData.firstName} ${formData.lastName}`}</Typography>
							</Grid>

							<Grid item xs={4}>
								<Typography variant="subtitle2" color="text.secondary">
									Email:
								</Typography>
							</Grid>
							<Grid item xs={8}>
								<Typography variant="body1">{formData.email}</Typography>
							</Grid>

							<Grid item xs={12}>
								<Alert severity="info">By clicking "Register," you agree to our terms of service and privacy policy.</Alert>
							</Grid>
						</Grid>
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<Container component="main" maxWidth="sm">
			<Paper elevation={6} sx={{ mt: 8, p: 4 }}>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign Up
					</Typography>

					<Box sx={{ width: "100%", mt: 3 }}>
						<Stepper activeStep={activeStep} alternativeLabel>
							{steps.map((label) => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
								</Step>
							))}
						</Stepper>

						<Box component="form" noValidate sx={{ mt: 3 }}>
							{error && (
								<Alert severity="error" sx={{ mb: 2 }}>
									{error}
								</Alert>
							)}

							{renderStepContent(activeStep)}

							<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
								{activeStep !== 0 && (
									<Button onClick={handleBack} sx={{ mr: 1 }} disabled={loading}>
										Back
									</Button>
								)}

								{activeStep === steps.length - 1 ? (
									<Button variant="contained" onClick={handleSubmit} disabled={loading}>
										{loading ? <CircularProgress size={24} /> : "Register"}
									</Button>
								) : (
									<Button variant="contained" onClick={handleNext}>
										Next
									</Button>
								)}
							</Box>

							<Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
								<Grid item>
									<Link component={RouterLink} to="/login" variant="body2">
										Already have an account? Sign in
									</Link>
								</Grid>
							</Grid>

							<Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, display: "block" }}>
								{currentDateTime}
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default Register;
