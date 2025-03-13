import React, { useState } from "react";
import { Container, Typography, Box, Grid, Paper, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Button, Divider, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EmailIcon from "@mui/icons-material/Email";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { transactions, monthlyData, categoryData } from "../data/mockData";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	);
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const Reports = () => {
	// Current date and time as specified
	const currentDateTime = "2025-03-13 17:19:27";
	const username = "hpsanjel";

	const [tabValue, setTabValue] = useState(0);
	const [reportPeriod, setReportPeriod] = useState("monthly");
	const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 6)));
	const [endDate, setEndDate] = useState<Date | null>(new Date());

	// Income vs Expense data
	const incomeExpenseData = monthlyData;

	// Category breakdown data
	const expenseCategoryData = categoryData;

	// Savings trend data
	const savingsTrendData = monthlyData.map((item) => ({
		name: item.month,
		savings: item.savings,
	}));

	// Calculate totals
	const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

	const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

	const netCashflow = totalIncome - totalExpenses;

	// Transaction history for the table
	const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setReportPeriod(event.target.value as string);
	};

	const handleExportPDF = () => {
		alert("Exporting report as PDF...");
		// Implement PDF export logic
	};

	const handleExportCSV = () => {
		alert("Exporting report as CSV...");
		// Implement CSV export logic
	};

	const handleEmailReport = () => {
		alert("Emailing report...");
		// Implement email sending logic
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography variant="h4" component="h1" gutterBottom>
					Financial Reports
				</Typography>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF} size="small">
						PDF
					</Button>
					<Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExportCSV} size="small">
						CSV
					</Button>
					<Button variant="outlined" startIcon={<EmailIcon />} onClick={handleEmailReport} size="small">
						Email
					</Button>
				</Box>
			</Box>

			{/* Report Controls */}
			<Paper sx={{ p: 2, mb: 3 }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={4}>
						<FormControl fullWidth size="small">
							<InputLabel>Report Period</InputLabel>
							<Select value={reportPeriod} label="Report Period">
								{/* <Select value={reportPeriod} label="Report Period" onChange={handlePeriodChange}> */}
								<MenuItem value="weekly">Weekly</MenuItem>
								<MenuItem value="monthly">Monthly</MenuItem>
								<MenuItem value="quarterly">Quarterly</MenuItem>
								<MenuItem value="yearly">Yearly</MenuItem>
								<MenuItem value="custom">Custom Range</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* <Grid item xs={12} sm={8}>
						<Box sx={{ display: "flex", gap: 2 }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker label="From" value={startDate} onChange={(date) => setStartDate(date)} renderInput={(params) => <TextField {...params} size="small" fullWidth disabled={reportPeriod !== "custom"} />} />
							</LocalizationProvider>

							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker label="To" value={endDate} onChange={(date) => setEndDate(date)} renderInput={(params) => <TextField {...params} size="small" fullWidth disabled={reportPeriod !== "custom"} />} />
							</LocalizationProvider>
						</Box>
					</Grid> */}

					<Grid item xs={12} sx={{ textAlign: "right" }}>
						<Typography variant="caption" color="text.secondary">
							Last updated: {currentDateTime} by {username}
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			{/* Summary Cards */}
			<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="subtitle1" color="text.secondary">
								Total Income
							</Typography>
							<Typography variant="h5" color="primary" fontWeight="medium">
								${totalIncome.toFixed(2)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="subtitle1" color="text.secondary">
								Total Expenses
							</Typography>
							<Typography variant="h5" color="error" fontWeight="medium">
								${totalExpenses.toFixed(2)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="subtitle1" color="text.secondary">
								Net Cashflow
							</Typography>
							<Typography variant="h5" color={netCashflow >= 0 ? "success.main" : "error.main"} fontWeight="medium">
								${netCashflow.toFixed(2)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Report Tabs */}
			<Paper sx={{ width: "100%" }}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
						<Tab label="Income vs Expenses" />
						<Tab label="Expense Breakdown" />
						<Tab label="Savings Trend" />
						<Tab label="Transaction History" />
					</Tabs>
				</Box>

				{/* Income vs Expenses Tab */}
				<TabPanel value={tabValue} index={0}>
					<Box sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Income vs Expenses Overview
						</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							This chart shows your monthly income compared to your expenses over time.
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart
								data={incomeExpenseData}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip formatter={(value) => [`$${value}`, ""]} labelStyle={{ color: "#333" }} />
								<Legend />
								<Bar dataKey="income" name="Income" fill="#3f51b5" />
								<Bar dataKey="expenses" name="Expenses" fill="#f44336" />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				</TabPanel>

				{/* Expense Breakdown Tab */}
				<TabPanel value={tabValue} index={1}>
					<Box sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Expense Category Breakdown
						</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							This chart shows how your expenses are distributed across different categories.
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<PieChart>
								<Pie data={expenseCategoryData} cx="50%" cy="50%" labelLine={false} outerRadius={150} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
									{expenseCategoryData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								{/* <Tooltip formatter={(value) => `$${value.toFixed(2)}`} /> */}
							</PieChart>
						</ResponsiveContainer>
					</Box>
				</TabPanel>

				{/* Savings Trend Tab */}
				<TabPanel value={tabValue} index={2}>
					<Box sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Savings Trend Analysis
						</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							Track your savings progress over time to see your financial growth.
						</Typography>
						<ResponsiveContainer width="100%" height={400}>
							<LineChart
								data={savingsTrendData}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip formatter={(value) => [`$${value}`, "Savings"]} />
								<Legend />
								<Line type="monotone" dataKey="savings" stroke="#4caf50" activeDot={{ r: 8 }} strokeWidth={2} />
							</LineChart>
						</ResponsiveContainer>
					</Box>
				</TabPanel>

				{/* Transaction History Tab */}
				<TabPanel value={tabValue} index={3}>
					<Box sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Recent Transaction History
						</Typography>
						<Typography variant="body2" color="text.secondary" paragraph>
							Review your recent financial transactions to track your spending and income.
						</Typography>
						<TableContainer>
							<Table sx={{ minWidth: 650 }} size="medium">
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Type</TableCell>
										<TableCell>Category</TableCell>
										<TableCell>Description</TableCell>
										<TableCell align="right">Amount</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{recentTransactions.map((transaction) => (
										<TableRow key={transaction.id}>
											<TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
											<TableCell>
												<Chip label={transaction.type === "income" ? "Income" : "Expense"} color={transaction.type === "income" ? "primary" : "error"} size="small" variant="outlined" />
											</TableCell>
											<TableCell>{transaction.category}</TableCell>
											<TableCell>{transaction.description}</TableCell>
											<TableCell align="right">
												<Typography fontWeight="medium" color={transaction.type === "income" ? "primary.main" : "error.main"}>
													{transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
												</Typography>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				</TabPanel>
			</Paper>
		</Container>
	);
};

export default Reports;
