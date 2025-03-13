import React, { useState } from "react";
import { Outlet, useNavigate, Link as RouterLink, Link } from "react-router-dom";
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, useMediaQuery, useTheme, Tooltip, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { logoutUser } from "../../services/firebase";
import { format } from "date-fns";

const drawerWidth = 240;

const menuItems = [
	{ text: "Dashboard", icon: <DashboardIcon />, path: "/" },
	{ text: "Budgets", icon: <AccountBalanceWalletIcon />, path: "/budgets" },
	{ text: "Expenses", icon: <ShoppingCartIcon />, path: "/expenses" },
	{ text: "Income", icon: <AttachMoneyIcon />, path: "/income" },
	{ text: "Savings", icon: <SavingsIcon />, path: "/savings" },
	{ text: "Reports", icon: <BarChartIcon />, path: "/reports" },
	{ text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Layout = () => {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// Current date/time as specified
	const currentDateTime = format(new Date(), "dd MMM yyyy, EEEE");
	const username = "hpsanjel";

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setNotificationAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleNotificationMenuClose = () => {
		setNotificationAnchorEl(null);
	};

	const handleLogout = async () => {
		try {
			await logoutUser();
			navigate("/login");
		} catch (error) {
			console.error("Failed to log out", error);
		}
	};

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ mr: 2, ...(open && { display: "none" }) }}>
						<MenuIcon />
					</IconButton>

					<Typography
						variant="h6"
						noWrap
						component={Link} // Make Typography act as a link
						to="/" // Define the route
						sx={{ flexGrow: 1, textDecoration: "none", color: "inherit", cursor: "pointer" }}
					>
						BudgetTracker
					</Typography>

					{/* Current Date/Time Display */}
					<Typography variant="body2" sx={{ mr: 2, display: { xs: "none", md: "block" } }}>
						{currentDateTime}
					</Typography>

					{/* Notifications */}
					<Tooltip title="Notifications">
						<IconButton color="inherit" onClick={handleNotificationMenuOpen} size="large">
							<Badge badgeContent={3} color="error">
								<NotificationsIcon />
							</Badge>
						</IconButton>
					</Tooltip>
					<Menu
						id="notification-menu"
						anchorEl={notificationAnchorEl}
						keepMounted
						open={Boolean(notificationAnchorEl)}
						onClose={handleNotificationMenuClose}
						PaperProps={{
							style: {
								width: "300px",
								maxHeight: "400px",
							},
						}}
					>
						<MenuItem onClick={handleNotificationMenuClose}>
							<Box>
								<Typography variant="subtitle2">Budget Alert</Typography>
								<Typography variant="body2" color="text.secondary">
									You've reached 80% of your Food & Dining budget
								</Typography>
							</Box>
						</MenuItem>
						<Divider />
						<MenuItem onClick={handleNotificationMenuClose}>
							<Box>
								<Typography variant="subtitle2">Bill Reminder</Typography>
								<Typography variant="body2" color="text.secondary">
									Electricity bill due in 3 days
								</Typography>
							</Box>
						</MenuItem>
						<Divider />
						<MenuItem onClick={handleNotificationMenuClose}>
							<Box>
								<Typography variant="subtitle2">Savings Goal</Typography>
								<Typography variant="body2" color="text.secondary">
									Vacation Fund is 40% complete
								</Typography>
							</Box>
						</MenuItem>
					</Menu>

					{/* User Profile Menu */}
					<IconButton onClick={handleProfileMenuOpen} size="large" edge="end" color="inherit">
						<Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>{username.charAt(0).toUpperCase()}</Avatar>
					</IconButton>
					<Menu id="profile-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
						<MenuItem sx={{ minWidth: 150 }}>
							<Typography variant="subtitle2">{username}</Typography>
						</MenuItem>
						<Divider />
						<MenuItem
							onClick={() => {
								handleMenuClose();
								navigate("/settings");
							}}
						>
							<ListItemIcon>
								<PersonIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Profile</ListItemText>
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleMenuClose();
								navigate("/settings");
							}}
						>
							<ListItemIcon>
								<SettingsIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Settings</ListItemText>
						</MenuItem>
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								<LogoutIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Logout</ListItemText>
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
			<Drawer
				variant={isMobile ? "temporary" : "persistent"}
				open={isMobile ? open : true}
				onClose={handleDrawerClose}
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						px: [1],
					}}
				>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</Toolbar>
				<Divider />
				<List>
					{menuItems.map((item) => (
						<ListItem component={RouterLink} to={item.path} key={item.text} onClick={isMobile ? handleDrawerClose : undefined}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{/* <ListItem button onClick={handleLogout}>
						<ListItemIcon>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</ListItem> */}
				</List>
			</Drawer>
			<Box
				component="main"
				sx={{
					backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
					flexGrow: 1,
					height: "100vh",
					overflow: "auto",
					pt: "64px",
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
