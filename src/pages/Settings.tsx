import React, { useState } from "react";
import { Container, Typography, Box, Grid, Paper, TextField, Button, Card, CardContent, CardHeader, Divider, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Avatar, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Tabs, Tab, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import PaletteIcon from "@mui/icons-material/Palette";
import LanguageIcon from "@mui/icons-material/Language";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} id={`settings-tabpanel-${index}`} aria-labelledby={`settings-tab-${index}`} {...other}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

// Input element for the custom file upload
const Input = styled("input")({
	display: "none",
});

const Settings = () => {
	// Current date and time as specified
	const currentDateTime = "2025-03-13 17:23:27";
	const username = "hpsanjel";

	const [value, setValue] = useState(0);
	const [profileData, setProfileData] = useState({
		firstName: "Harry",
		lastName: "Sanjel",
		email: "hpsanjel@example.com",
		phone: "+1 123-456-7890",
		currency: "USD",
		language: "en",
		theme: "light",
	});

	const [notifications, setNotifications] = useState({
		email: true,
		push: true,
		budgetAlerts: true,
		newFeatures: false,
		reportReminders: true,
		billReminders: true,
	});

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
	const [exportDialogOpen, setExportDialogOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setProfileData({
			...profileData,
			[name]: value,
		});
	};

	const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
		const name = event.target.name as string;
		setProfileData({
			...profileData,
			[name]: event.target.value as string,
		});
	};

	const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNotifications({
			...notifications,
			[event.target.name]: event.target.checked,
		});
	};

	const handleSaveProfile = () => {
		// Here you would typically call an API to update the user's profile
		setSuccessMessage("Profile updated successfully!");
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const handleSaveNotifications = () => {
		// Here you would typically call an API to update notification settings
		setSuccessMessage("Notification preferences saved!");
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const handleChangePassword = () => {
		setPasswordDialogOpen(true);
	};

	const handleExportData = () => {
		setExportDialogOpen(true);
	};

	const handleDeleteAccount = () => {
		setDeleteDialogOpen(true);
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Account Settings
			</Typography>

			{successMessage && (
				<Alert severity="success" sx={{ mb: 2 }}>
					{successMessage}
				</Alert>
			)}

			{errorMessage && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{errorMessage}
				</Alert>
			)}

			<Paper sx={{ width: "100%" }}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs value={value} onChange={handleTabChange} aria-label="settings tabs" variant="scrollable" scrollButtons="auto">
						<Tab label="Profile" icon={<Avatar sx={{ width: 24, height: 24 }} />} iconPosition="start" />
						<Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
						<Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
						<Tab label="Appearance" icon={<PaletteIcon />} iconPosition="start" />
						<Tab label="Data Management" icon={<CloudDownloadIcon />} iconPosition="start" />
					</Tabs>
				</Box>

				{/* Profile Settings */}
				<TabPanel value={value} index={0}>
					<Box sx={{ p: 2 }}>
						<Grid container spacing={3}>
							<Grid item xs={12} md={4}>
								<Card>
									<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
										<Avatar
											sx={{
												width: 100,
												height: 100,
												mb: 2,
												bgcolor: "primary.main",
												fontSize: "2rem",
											}}
										>
											{profileData.firstName.charAt(0)}
											{profileData.lastName.charAt(0)}
										</Avatar>

										<Typography variant="h6">
											{profileData.firstName} {profileData.lastName}
										</Typography>

										<Typography variant="body2" color="text.secondary" gutterBottom>
											{profileData.email}
										</Typography>

										<Typography variant="caption" color="text.secondary">
											Member since January 2023
										</Typography>

										<label htmlFor="contained-button-file">
											<Input accept="image/*" id="contained-button-file" multiple type="file" />
											<Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />} sx={{ mt: 2 }}>
												Change Photo
											</Button>
										</label>
									</CardContent>
								</Card>
							</Grid>

							<Grid item xs={12} md={8}>
								<Card>
									<CardHeader title="Personal Information" subheader="Update your profile details" />
									<Divider />
									<CardContent>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6}>
												<TextField fullWidth label="First Name" name="firstName" value={profileData.firstName} onChange={handleProfileChange} variant="outlined" />
											</Grid>
											<Grid item xs={12} sm={6}>
												<TextField fullWidth label="Last Name" name="lastName" value={profileData.lastName} onChange={handleProfileChange} variant="outlined" />
											</Grid>
											<Grid item xs={12}>
												<TextField fullWidth label="Email Address" name="email" value={profileData.email} onChange={handleProfileChange} variant="outlined" type="email" />
											</Grid>
											<Grid item xs={12}>
												<TextField fullWidth label="Phone Number" name="phone" value={profileData.phone} onChange={handleProfileChange} variant="outlined" />
											</Grid>
											<Grid item xs={12} sm={6}>
												<FormControl fullWidth variant="outlined">
													<InputLabel>Currency</InputLabel>
													<Select name="currency" value={profileData.currency} label="Currency">
														{/* <Select name="currency" value={profileData.currency} onChange={handleSelectChange} label="Currency"> */}
														<MenuItem value="USD">US Dollar (USD)</MenuItem>
														<MenuItem value="EUR">Euro (EUR)</MenuItem>
														<MenuItem value="GBP">British Pound (GBP)</MenuItem>
														<MenuItem value="JPY">Japanese Yen (JPY)</MenuItem>
														<MenuItem value="CAD">Canadian Dollar (CAD)</MenuItem>
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={12} sm={6}>
												<FormControl fullWidth variant="outlined">
													<InputLabel>Language</InputLabel>
													<Select name="language" value={profileData.language} label="Language">
														{/* <Select name="language" value={profileData.language} onChange={handleSelectChange} label="Language"> */}
														<MenuItem value="en">English</MenuItem>
														<MenuItem value="es">Spanish</MenuItem>
														<MenuItem value="fr">French</MenuItem>
														<MenuItem value="de">German</MenuItem>
														<MenuItem value="zh">Chinese</MenuItem>
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={12}>
												<Button variant="contained" color="primary" onClick={handleSaveProfile}>
													Save Changes
												</Button>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Box>
				</TabPanel>

				{/* Notification Settings */}
				<TabPanel value={value} index={1}>
					<Box sx={{ p: 2 }}>
						<Card>
							<CardHeader title="Notification Preferences" subheader="Manage how you receive notifications" />
							<Divider />
							<CardContent>
								<Typography variant="subtitle1" gutterBottom>
									Notification Channels
								</Typography>
								<List>
									<ListItem>
										<ListItemText primary="Email Notifications" secondary="Receive updates to your email" />
										<ListItemSecondaryAction>
											<Switch edge="end" name="email" checked={notifications.email} onChange={handleNotificationChange} />
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem>
										<ListItemText primary="Push Notifications" secondary="Receive alerts on your device" />
										<ListItemSecondaryAction>
											<Switch edge="end" name="push" checked={notifications.push} onChange={handleNotificationChange} />
										</ListItemSecondaryAction>
									</ListItem>
								</List>

								<Divider sx={{ my: 2 }} />

								<Typography variant="subtitle1" gutterBottom>
									Notification Types
								</Typography>
								<List>
									<ListItem>
										<ListItemText primary="Budget Alerts" secondary="Notify when approaching budget limits" />
										<ListItemSecondaryAction>
											<Switch edge="end" name="budgetAlerts" checked={notifications.budgetAlerts} onChange={handleNotificationChange} />
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem>
										<ListItemText primary="Bill Reminders" secondary="Notify before bills are due" />
										<ListItemSecondaryAction>
											<Switch edge="end" name="billReminders" checked={notifications.billReminders} onChange={handleNotificationChange} />
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem>
										<ListItemText primary="Report Reminders" secondary="Weekly and monthly financial report reminders" />
										<ListItemSecondaryAction>
											<Switch edge="end" name="reportReminders" checked={notifications.reportReminders} onChange={handleNotificationChange} />
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem>
										<ListItemText primary="New Features & Updates" secondary="Stay informed about app improvements" />
										<ListItemSecondaryAction>
											<Switch edge="end" name="newFeatures" checked={notifications.newFeatures} onChange={handleNotificationChange} />
										</ListItemSecondaryAction>
									</ListItem>
								</List>

								<Box sx={{ mt: 3 }}>
									<Button variant="contained" color="primary" onClick={handleSaveNotifications}>
										Save Preferences
									</Button>
								</Box>
							</CardContent>
						</Card>
					</Box>
				</TabPanel>

				{/* Security Settings */}
				<TabPanel value={value} index={2}>
					<Box sx={{ p: 2 }}>
						<Card>
							<CardHeader title="Security Settings" subheader="Manage your account security" />
							<Divider />
							<CardContent>
								<List>
									<ListItem>
										<ListItemIcon>
											<LockIcon />
										</ListItemIcon>
										<ListItemText primary="Password" secondary="Last changed 30 days ago" />
										<ListItemSecondaryAction>
											<Button variant="outlined" onClick={handleChangePassword}>
												Change Password
											</Button>
										</ListItemSecondaryAction>
									</ListItem>

									<Divider variant="inset" component="li" />

									<ListItem>
										<ListItemIcon>
											<SecurityIcon />
										</ListItemIcon>
										<ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security to your account" />
										<ListItemSecondaryAction>
											<FormControlLabel control={<Switch color="primary" />} label="" />
										</ListItemSecondaryAction>
									</ListItem>

									<Divider variant="inset" component="li" />

									<ListItem>
										<ListItemIcon>
											<DeleteIcon />
										</ListItemIcon>
										<ListItemText primary="Delete Account" secondary="Permanently remove your account and all data" />
										<ListItemSecondaryAction>
											<Button variant="outlined" color="error" onClick={handleDeleteAccount}>
												Delete Account
											</Button>
										</ListItemSecondaryAction>
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Box>
				</TabPanel>

				{/* Appearance Settings */}
				<TabPanel value={value} index={3}>
					<Box sx={{ p: 2 }}>
						<Card>
							<CardHeader title="Appearance Settings" subheader="Customize how the application looks" />
							<Divider />
							<CardContent>
								<List>
									<ListItem>
										<ListItemIcon>
											<PaletteIcon />
										</ListItemIcon>
										<ListItemText primary="Theme" secondary="Choose between light and dark mode" />
										<ListItemSecondaryAction>
											<FormControl variant="outlined" sx={{ minWidth: 120 }}>
												<Select value={profileData.theme} name="theme">
													{/* <Select value={profileData.theme} onChange={handleSelectChange} name="theme"> */}
													<MenuItem value="light">Light</MenuItem>
													<MenuItem value="dark">Dark</MenuItem>
													<MenuItem value="system">System Default</MenuItem>
												</Select>
											</FormControl>
										</ListItemSecondaryAction>
									</ListItem>

									<Divider variant="inset" component="li" />

									<ListItem>
										<ListItemIcon>
											<LanguageIcon />
										</ListItemIcon>
										<ListItemText primary="Language" secondary="Select your preferred language" />
										<ListItemSecondaryAction>
											<FormControl variant="outlined" sx={{ minWidth: 120 }}>
												<Select value={profileData.language} name="language">
													<MenuItem value="en">English</MenuItem>
													<MenuItem value="es">Spanish</MenuItem>
													<MenuItem value="fr">French</MenuItem>
													<MenuItem value="de">German</MenuItem>
													<MenuItem value="zh">Chinese</MenuItem>
												</Select>
											</FormControl>
										</ListItemSecondaryAction>
									</ListItem>
								</List>

								<Box sx={{ mt: 3 }}>
									<Button variant="contained" color="primary" onClick={handleSaveProfile}>
										Save Preferences
									</Button>
								</Box>
							</CardContent>
						</Card>
					</Box>
				</TabPanel>

				{/* Data Management */}
				<TabPanel value={value} index={4}>
					<Box sx={{ p: 2 }}>
						<Card>
							<CardHeader title="Data Management" subheader="Manage your account data" />
							<Divider />
							<CardContent>
								<List>
									<ListItem>
										<ListItemIcon>
											<CloudDownloadIcon />
										</ListItemIcon>
										<ListItemText primary="Export Account Data" secondary="Download all your personal data" />
										<ListItemSecondaryAction>
											<Button variant="outlined" onClick={handleExportData}>
												Export Data
											</Button>
										</ListItemSecondaryAction>
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Box>
				</TabPanel>
			</Paper>

			{/* Password Change Dialog */}
			<Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
				<DialogTitle>Change Password</DialogTitle>
				<DialogContent>
					<DialogContentText>Enter your current password and a new password below.</DialogContentText>
					<TextField autoFocus margin="dense" label="Current Password" type="password" fullWidth variant="outlined" sx={{ mb: 2, mt: 2 }} />
					<TextField margin="dense" label="New Password" type="password" fullWidth variant="outlined" sx={{ mb: 2 }} />
					<TextField margin="dense" label="Confirm New Password" type="password" fullWidth variant="outlined" />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={() => {
							setPasswordDialogOpen(false);
							setSuccessMessage("Password changed successfully!");
							setTimeout(() => setSuccessMessage(""), 3000);
						}}
						variant="contained"
						color="primary"
					>
						Update Password
					</Button>
				</DialogActions>
			</Dialog>

			{/* Export Data Dialog */}
			<Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
				<DialogTitle>Export Your Data</DialogTitle>
				<DialogContent>
					<DialogContentText>Your data export is being prepared. This may take a few minutes. You'll receive an email when your data is ready to download.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={() => {
							setExportDialogOpen(false);
							setSuccessMessage("Data export request submitted. You will receive an email soon.");
							setTimeout(() => setSuccessMessage(""), 3000);
						}}
						variant="contained"
						color="primary"
					>
						Confirm Export
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Account Dialog */}
			<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
				<DialogTitle>Delete Your Account</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.</DialogContentText>
					<TextField margin="dense" label="Type 'DELETE' to confirm" fullWidth variant="outlined" sx={{ mt: 2 }} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={() => {
							setDeleteDialogOpen(false);
							// In a real application, you would delete the account here
						}}
						variant="contained"
						color="error"
					>
						Delete Account
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Settings;
