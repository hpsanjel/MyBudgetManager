import React, { useState } from "react";
import { Container, Typography, Box, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, InputAdornment, Chip, FormHelperText, TablePagination, OutlinedInput } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import { transactions } from "../data/mockData";

// Filter only expenses from the transactions
const expenseTransactions = transactions.filter((t) => t.type === "expense");

interface Expense {
	id: number;
	category: string;
	amount: number;
	date: string;
	description: string;
}

const categories = ["Food & Dining", "Transportation", "Entertainment", "Utilities", "Shopping", "Health", "Housing", "Education", "Travel", "Others"];

const Expenses = () => {
	const [expenses, setExpenses] = useState<Expense[]>(expenseTransactions);
	const [openDialog, setOpenDialog] = useState(false);
	const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
	const [formData, setFormData] = useState({
		category: "",
		amount: "",
		date: new Date().toISOString().split("T")[0],
		description: "",
	});
	const [formError, setFormError] = useState("");

	// For filtering and pagination
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Current date and time as specified
	const currentDateTime = "2025-03-13 16:32:27";
	const username = "hpsanjel";

	const handleOpenDialog = (expense?: Expense) => {
		if (expense) {
			setEditingExpense(expense);
			setFormData({
				category: expense.category,
				amount: expense.amount.toString(),
				date: expense.date,
				description: expense.description,
			});
		} else {
			setEditingExpense(null);
			setFormData({
				category: "",
				amount: "",
				date: new Date().toISOString().split("T")[0],
				description: "",
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

	const handleDateChange = (date: Date | null) => {
		if (date) {
			setFormData({
				...formData,
				date: date.toISOString().split("T")[0],
			});
		}
	};

	const handleSaveExpense = () => {
		// Form validation
		if (!formData.category || !formData.amount || parseFloat(formData.amount) <= 0 || !formData.date) {
			setFormError("Please fill all required fields with valid values");
			return;
		}

		if (editingExpense) {
			// Update existing expense
			setExpenses(
				expenses.map((expense) =>
					expense.id === editingExpense.id
						? {
								...expense,
								category: formData.category,
								amount: parseFloat(formData.amount),
								date: formData.date,
								description: formData.description,
						  }
						: expense
				)
			);
		} else {
			// Add new expense
			const newExpense: Expense = {
				id: Math.max(0, ...expenses.map((e) => e.id)) + 1,
				category: formData.category,
				amount: parseFloat(formData.amount),
				date: formData.date,
				description: formData.description,
			};
			setExpenses([...expenses, newExpense]);
		}

		handleCloseDialog();
	};

	const handleDeleteExpense = (expenseId: number) => {
		setExpenses(expenses.filter((expense) => expense.id !== expenseId));
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Apply filters and search to expenses
	const filteredExpenses = expenses.filter((expense) => (categoryFilter === "" || expense.category === categoryFilter) && (searchQuery === "" || expense.description.toLowerCase().includes(searchQuery.toLowerCase()) || expense.category.toLowerCase().includes(searchQuery.toLowerCase()))).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	// Calculate total expenses after filtering
	const totalFilteredExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

	// Pagination
	const paginatedExpenses = filteredExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
					Expense Tracker
				</Typography>
				<Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
					Add Expense
				</Button>
			</Box>

			{/* Filter and Search Controls */}
			<Paper sx={{ p: 2, mb: 3 }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} md={4}>
						<FormControl fullWidth variant="outlined" size="small">
							<OutlinedInput
								placeholder="Search expenses..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(0);
								}}
								startAdornment={
									<InputAdornment position="start">
										<SearchIcon color="action" />
									</InputAdornment>
								}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<FormControl fullWidth size="small">
							<InputLabel id="category-filter-label">Filter by Category</InputLabel>
							<Select
								labelId="category-filter-label"
								value={categoryFilter}
								label="Filter by Category"
								onChange={(e) => {
									setCategoryFilter(e.target.value as string);
									setPage(0);
								}}
								startAdornment={
									<InputAdornment position="start">
										<FilterListIcon color="action" />
									</InputAdornment>
								}
							>
								<MenuItem value="">All Categories</MenuItem>
								{categories.map((category) => (
									<MenuItem key={category} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
						<Typography variant="subtitle1" color="primary">
							Total Expenses: <b>${totalFilteredExpenses.toFixed(2)}</b>
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{filteredExpenses.length} expense entries
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			{/* Expenses Table */}
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} size="medium">
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>Description</TableCell>
							<TableCell align="right">Amount</TableCell>
							<TableCell align="center">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedExpenses.length > 0 ? (
							paginatedExpenses.map((expense) => (
								<TableRow key={expense.id}>
									<TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
									<TableCell>
										<Chip label={expense.category} size="small" color="primary" variant="outlined" />
									</TableCell>
									<TableCell>{expense.description}</TableCell>
									<TableCell align="right">
										<Typography fontWeight="medium" color="error.main">
											${expense.amount.toFixed(2)}
										</Typography>
									</TableCell>
									<TableCell align="center">
										<Tooltip title="Edit Expense">
											<IconButton size="small" onClick={() => handleOpenDialog(expense)}>
												<EditIcon fontSize="small" />
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete Expense">
											<IconButton size="small" onClick={() => handleDeleteExpense(expense.id)}>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<Typography variant="subtitle1" sx={{ py: 5 }}>
										No expenses found.
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Pagination Controls */}
				<TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={filteredExpenses.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
			</TableContainer>

			{/* Add/Edit Expense Dialog */}
			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
				<DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
				<DialogContent>
					<Grid container spacing={2} sx={{ mt: 0.5 }}>
						{formError && (
							<Grid item xs={12}>
								<Box sx={{ color: "error.main", mb: 2 }}>{formError}</Box>
							</Grid>
						)}

						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel id="category-label">Category</InputLabel>
								<Select labelId="category-label" name="category" value={formData.category} label="Category" required>
									{/* <Select labelId="category-label" name="category" value={formData.category} label="Category" onChange={handleInputChange} required> */}
									{categories.map((category) => (
										<MenuItem key={category} value={category}>
											{category}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								name="amount"
								label="Amount ($)"
								type="number"
								fullWidth
								value={formData.amount}
								onChange={handleInputChange}
								required
								inputProps={{ min: 0, step: 0.01 }}
								InputProps={{
									startAdornment: <InputAdornment position="start">$</InputAdornment>,
								}}
							/>
							<FormHelperText>Enter the expense amount</FormHelperText>
						</Grid>

						{/* <Grid item xs={12}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker label="Date" value={new Date(formData.date)} onChange={handleDateChange} renderInput={(params) => <TextField {...params} fullWidth required />} />
							</LocalizationProvider>
						</Grid> */}

						<Grid item xs={12}>
							<TextField name="description" label="Description" fullWidth value={formData.description} onChange={handleInputChange} multiline rows={2} placeholder="Enter a brief description of the expense" />
						</Grid>

						<Grid item xs={12}>
							<Typography variant="caption" color="text.secondary">
								Last edited by {username} at {currentDateTime}
							</Typography>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={handleSaveExpense} variant="contained" color="primary">
						{editingExpense ? "Save Changes" : "Add Expense"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Expenses;
