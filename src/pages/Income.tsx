import React, { useState } from "react";
import { Container, Typography, Box, Grid, Paper, TextField, Button, Card, CardContent, CardHeader, Divider, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormHelperText, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, parseISO } from "date-fns";
import { SelectChangeEvent } from "@mui/material";

// Sample income data
const incomeTransactions = [
	{ id: 1, category: "Salary", amount: 5000, date: "2025-03-01", description: "Monthly salary from ABC Corp" },
	{ id: 2, category: "Freelance", amount: 1200, date: "2025-03-05", description: "Web design project" },
	{ id: 3, category: "Investments", amount: 350, date: "2025-03-07", description: "Dividend payment" },
	{ id: 4, category: "Rental", amount: 1800, date: "2025-03-10", description: "Apartment rental income" },
	{ id: 5, category: "Business", amount: 2700, date: "2025-03-12", description: "Business profit" },
];

// Income interface
interface Income {
	id: number;
	category: string;
	amount: number;
	date: string;
	description: string;
	isRecurring?: boolean;
	frequency?: string;
}

// Create a separate interface for the form data
interface IncomeFormData {
	category: string;
	amount: string;
	date: string;
	description: string;
	isRecurring: boolean;
	frequency: string;
}

const categories = ["Salary", "Freelance", "Investments", "Rental", "Business", "Gifts", "Other"];
const frequencies = [
	{ value: "weekly", label: "Weekly" },
	{ value: "biweekly", label: "Bi-weekly" },
	{ value: "monthly", label: "Monthly" },
	{ value: "quarterly", label: "Quarterly" },
	{ value: "annually", label: "Annually" },
];

// COLORS for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

// Prepare data for charts
const prepareChartData = (incomes: Income[]) => {
	const categoryMap = new Map<string, number>();
	incomes.forEach((income) => {
		const currentAmount = categoryMap.get(income.category) || 0;
		categoryMap.set(income.category, currentAmount + income.amount);
	});
	return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
};

const Income = () => {
	const [incomes, setIncomes] = useState<Income[]>(
		incomeTransactions.map((t) => ({
			...t,
			isRecurring: false,
			frequency: "monthly",
		}))
	);
	const [openDialog, setOpenDialog] = useState(false);
	const [editingIncome, setEditingIncome] = useState<Income | null>(null);
	const [formData, setFormData] = useState<IncomeFormData>({
		category: "",
		amount: "",
		date: new Date().toISOString().split("T")[0],
		description: "",
		isRecurring: false,
		frequency: "monthly",
	});
	const [formError, setFormError] = useState("");

	// For pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	// Current date and time as specified
	const currentDateTime = "2025-03-13 17:12:33";
	const username = "hpsanjel";

	const handleOpenDialog = (income?: Income) => {
		if (income) {
			setEditingIncome(income);
			setFormData({
				category: income.category,
				amount: income.amount.toString(),
				date: income.date,
				description: income.description,
				isRecurring: income.isRecurring || false,
				frequency: income.frequency || "monthly",
			});
		} else {
			setEditingIncome(null);
			setFormData({
				category: "",
				amount: "",
				date: new Date().toISOString().split("T")[0],
				description: "",
				isRecurring: false,
				frequency: "monthly",
			});
		}
		setFormError("");
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name as string]: value,
		});
	};

	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			isRecurring: e.target.checked,
		});
	};

	const handleDateChange = (date: Date | null) => {
		if (date) {
			setFormData({
				...formData,
				date: date.toISOString().split("T")[0],
			});
		}
	};

	const handleSaveIncome = () => {
		// Form validation
		if (!formData.category || !formData.amount || parseFloat(formData.amount) <= 0 || !formData.date) {
			setFormError("Please fill all required fields with valid values");
			return;
		}

		const incomeData: Income = {
			id: editingIncome ? editingIncome.id : Math.floor(Math.random() * 10000),
			category: formData.category,
			amount: parseFloat(formData.amount),
			date: formData.date,
			description: formData.description,
			isRecurring: formData.isRecurring,
			frequency: formData.isRecurring ? formData.frequency : undefined,
		};

		if (editingIncome) {
			// Edit existing income
			const updatedIncomes = incomes.map((inc) => (inc.id === editingIncome.id ? incomeData : inc));
			setIncomes(updatedIncomes);
		} else {
			// Add new income
			setIncomes([...incomes, incomeData]);
		}

		handleCloseDialog();
	};

	const handleDeleteIncome = (id: number) => {
		setIncomes(incomes.filter((income) => income.id !== id));
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Prepare data for the pie chart
	const chartData = prepareChartData(incomes);

	// Calculate total income
	const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
				<Typography variant="h4" component="h1">
					Income Management
				</Typography>
				<Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
					Add Income
				</Button>
			</Box>

			<Grid container spacing={3}>
				{/* Summary Cards */}
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Total Income
							</Typography>
							<Typography variant="h4">${totalIncome.toLocaleString()}</Typography>
							<Typography variant="caption" display="block" color="textSecondary">
								As of {currentDateTime}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Total Income Sources
							</Typography>
							<Typography variant="h4">{incomes.length}</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Average Income
							</Typography>
							<Typography variant="h4">${incomes.length ? (totalIncome / incomes.length).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}</Typography>
						</CardContent>
					</Card>
				</Grid>

				{/* Income Chart */}
				<Grid item xs={12} md={6}>
					<Card>
						<CardHeader title="Income by Category" />
						<Divider />
						<CardContent>
							<Box sx={{ height: 300 }}>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
											{chartData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip formatter={(value) => `$${value}`} />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				{/* Recent Income */}
				<Grid item xs={12}>
					<Card>
						<CardHeader title="Income Transactions" subheader="View, edit, and manage your income records" />
						<Divider />
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Category</TableCell>
										<TableCell>Description</TableCell>
										<TableCell>Amount</TableCell>
										<TableCell>Date</TableCell>
										<TableCell>Recurring</TableCell>
										<TableCell>Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{(rowsPerPage > 0 ? incomes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : incomes).map((income) => (
										<TableRow key={income.id}>
											<TableCell>{income.category}</TableCell>
											<TableCell>{income.description}</TableCell>
											<TableCell>${income.amount.toLocaleString()}</TableCell>
											<TableCell>{format(parseISO(income.date), "MMM d, yyyy")}</TableCell>
											<TableCell>{income.isRecurring ? `Yes (${income.frequency})` : "No"}</TableCell>
											<TableCell>
												<IconButton size="small" color="primary" onClick={() => handleOpenDialog(income)}>
													<EditIcon />
												</IconButton>
												<IconButton size="small" color="error" onClick={() => handleDeleteIncome(income.id)}>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={incomes.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
					</Card>
				</Grid>
			</Grid>

			{/* Add/Edit Income Dialog */}
			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
				<DialogTitle>{editingIncome ? "Edit Income" : "Add New Income"}</DialogTitle>
				<DialogContent>
					{formError && (
						<Box sx={{ mb: 2 }}>
							<FormHelperText error>{formError}</FormHelperText>
						</Box>
					)}

					<Grid container spacing={2} sx={{ mt: 1 }}>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel>Category</InputLabel>
								<Select name="category" value={formData.category} onChange={handleSelectChange} label="Category">
									{categories.map((category) => (
										<MenuItem key={category} value={category}>
											{category}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<TextField
								name="amount"
								label="Amount ($)"
								type="number"
								fullWidth
								value={formData.amount}
								onChange={handleInputChange}
								InputProps={{
									inputProps: { min: 0, step: "0.01" },
								}}
							/>
						</Grid>

						<Grid item xs={12}>
							<DatePicker label="Date" value={parseISO(formData.date)} onChange={handleDateChange} />
							{/* <DatePicker label="Date" value={parseISO(formData.date)} onChange={handleDateChange} renderInput={(params) => <TextField {...params} fullWidth />} /> */}
						</Grid>

						<Grid item xs={12}>
							<TextField name="description" label="Description" fullWidth multiline rows={2} value={formData.description} onChange={handleInputChange} />
						</Grid>

						<Grid item xs={12}>
							<FormControlLabel control={<Switch checked={formData.isRecurring} onChange={handleSwitchChange} name="isRecurring" color="primary" />} label="Recurring Income" />
						</Grid>

						{formData.isRecurring && (
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel>Frequency</InputLabel>
									<Select name="frequency" value={formData.frequency} onChange={handleSelectChange} label="Frequency">
										{frequencies.map((freq) => (
											<MenuItem key={freq.value} value={freq.value}>
												{freq.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={handleSaveIncome} variant="contained" color="primary">
						{editingIncome ? "Update" : "Add"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Income;
