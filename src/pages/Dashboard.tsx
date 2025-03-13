import React from "react";
import { Container, Grid, Paper, Typography, Box, List, ListItem, ListItemText, Divider, Card, CardContent, Chip, Avatar } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { categoryData, monthlyData, transactions } from "../data/mockData";

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const Dashboard = () => {
	// Calculate summary data
	const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0);

	const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);

	const balance = totalIncome - totalExpenses;

	// Get recent transactions
	const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: "bold", mb: 3 }}>
				Dashboard
			</Typography>

			{/* Summary Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{/* Total Income */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper
						elevation={3}
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							borderRadius: 2,
							borderLeft: "4px solid #4caf50",
						}}
					>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography component="h2" variant="subtitle1" color="text.secondary">
								Total Income
							</Typography>
							<Avatar sx={{ bgcolor: "#e8f5e9" }}>
								<AttachMoneyIcon sx={{ color: "#4caf50" }} />
							</Avatar>
						</Box>
						<Typography component="p" variant="h5" sx={{ mt: 1 }}>
							${totalIncome.toFixed(2)}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
							<TrendingUpIcon sx={{ color: "success.main", fontSize: "1rem", mr: 0.5 }} />
							<Typography variant="body2" sx={{ color: "success.main" }}>
								+5.3% from last month
							</Typography>
						</Box>
					</Paper>
				</Grid>

				{/* Total Expenses */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper
						elevation={3}
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							borderRadius: 2,
							borderLeft: "4px solid #f44336",
						}}
					>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography component="h2" variant="subtitle1" color="text.secondary">
								Total Expenses
							</Typography>
							<Avatar sx={{ bgcolor: "#ffebee" }}>
								<ShoppingCartIcon sx={{ color: "#f44336" }} />
							</Avatar>
						</Box>
						<Typography component="p" variant="h5" sx={{ mt: 1 }}>
							${totalExpenses.toFixed(2)}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
							<TrendingDownIcon sx={{ color: "error.main", fontSize: "1rem", mr: 0.5 }} />
							<Typography variant="body2" sx={{ color: "error.main" }}>
								+2.4% from last month
							</Typography>
						</Box>
					</Paper>
				</Grid>

				{/* Savings */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper
						elevation={3}
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							borderRadius: 2,
							borderLeft: "4px solid #2196f3",
						}}
					>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography component="h2" variant="subtitle1" color="text.secondary">
								Savings
							</Typography>
							<Avatar sx={{ bgcolor: "#e3f2fd" }}>
								<SavingsIcon sx={{ color: "#2196f3" }} />
							</Avatar>
						</Box>
						<Typography component="p" variant="h5" sx={{ mt: 1 }}>
							${(totalIncome * 0.2).toFixed(2)}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
							<TrendingUpIcon sx={{ color: "success.main", fontSize: "1rem", mr: 0.5 }} />
							<Typography variant="body2" sx={{ color: "success.main" }}>
								+12.1% from last month
							</Typography>
						</Box>
					</Paper>
				</Grid>

				{/* Current Balance */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper
						elevation={3}
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							borderRadius: 2,
							borderLeft: "4px solid #9c27b0",
						}}
					>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography component="h2" variant="subtitle1" color="text.secondary">
								Current Balance
							</Typography>
							<Avatar sx={{ bgcolor: "#f3e5f5" }}>
								<AccountBalanceIcon sx={{ color: "#9c27b0" }} />
							</Avatar>
						</Box>
						<Typography component="p" variant="h5" sx={{ mt: 1 }}>
							${balance.toFixed(2)}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
							<TrendingUpIcon sx={{ color: "success.main", fontSize: "1rem", mr: 0.5 }} />
							<Typography variant="body2" sx={{ color: "success.main" }}>
								+8.2% from last month
							</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>

			{/* Charts Row */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{/* Expense Distribution Pie Chart */}
				<Grid item xs={12} md={6}>
					<Paper
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							height: 450,
							borderRadius: 2,
						}}
						elevation={3}
					>
						<Typography component="h2" variant="h6" color="primary" gutterBottom>
							Expense Distribution
						</Typography>
						<ResponsiveContainer width="100%" height="90%">
							<PieChart>
								<Pie data={categoryData} cx="50%" cy="50%" labelLine={true} outerRadius={120} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
									{categoryData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>

				{/* Monthly Income vs Expenses Bar Chart */}
				<Grid item xs={12} md={6}>
					<Paper
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							height: 450,
							borderRadius: 2,
						}}
						elevation={3}
					>
						<Typography component="h2" variant="h6" color="primary" gutterBottom>
							Monthly Income vs Expenses
						</Typography>
						<ResponsiveContainer width="100%" height="90%">
							<BarChart data={monthlyData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip formatter={(value) => [`$${value}`, ""]} />
								<Legend />
								<Bar dataKey="income" name="Income" fill="#4caf50" />
								<Bar dataKey="expenses" name="Expenses" fill="#f44336" />
							</BarChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			</Grid>

			{/* Third Row */}
			<Grid container spacing={3}>
				{/* Savings Trend Line Chart */}
				<Grid item xs={12} md={8}>
					<Paper
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							height: 300,
							borderRadius: 2,
						}}
						elevation={3}
					>
						<Typography component="h2" variant="h6" color="primary" gutterBottom>
							Savings Trend
						</Typography>
						<ResponsiveContainer width="100%" height="90%">
							<LineChart data={monthlyData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
								<Legend />
								<Line type="monotone" dataKey="savings" name="Savings" stroke="#2196f3" strokeWidth={2} activeDot={{ r: 8 }} />
							</LineChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>

				{/* Recent Transactions */}
				<Grid item xs={12} md={4}>
					<Paper
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							height: 300,
							borderRadius: 2,
							overflow: "auto",
						}}
						elevation={3}
					>
						<Typography component="h2" variant="h6" color="primary" gutterBottom>
							Recent Transactions
						</Typography>
						<List dense>
							{recentTransactions.map((transaction) => (
								<React.Fragment key={transaction.id}>
									<ListItem>
										<ListItemText primary={transaction.description} secondary={`${transaction.date} · ${transaction.category}`} />
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Chip label={`$${transaction.amount.toFixed(2)}`} color={transaction.type === "income" ? "success" : "error"} size="small" variant="outlined" />
										</Box>
									</ListItem>
									<Divider component="li" />
								</React.Fragment>
							))}
						</List>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Dashboard;
