import React, { useState } from "react";
import { Container, Typography, Box, Grid, Paper, LinearProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { budgets } from "../data/mockData";

// Add new budget interface
interface Budget {
	id: number;
	category: string;
	limit: number;
	spent: number;
	period: string;
}

const Budgets = () => {
	const [budgetsList, setBudgetsList] = useState<Budget[]>(budgets);
	const [openDialog, setOpenDialog] = useState(false);
	const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
	const [formData, setFormData] = useState({
		category: "",
		limit: "",
		period: "monthly",
	});
	const [formError, setFormError] = useState("");

	// Current date and time as specified
	const currentDateTime = "2025-03-13 16:30:20";

	const handleOpenDialog = (budget?: Budget) => {
		if (budget) {
			setEditingBudget(budget);
			setFormData({
				category: budget.category,
				limit: budget.limit.toString(),
				period: budget.period,
			});
		} else {
			setEditingBudget(null);
			setFormData({
				category: "",
				limit: "",
				period: "monthly",
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

	const handleSaveBudget = () => {
		// Form validation
		if (!formData.category.trim() || !formData.limit || parseFloat(formData.limit) <= 0) {
			setFormError("Please provide a valid category name and limit amount");
			return;
		}

		if (editingBudget) {
			// Update existing budget
			setBudgetsList(
				budgetsList.map((budget) =>
					budget.id === editingBudget.id
						? {
								...budget,
								category: formData.category,
								limit: parseFloat(formData.limit),
								period: formData.period,
						  }
						: budget
				)
			);
		} else {
			// Add new budget
			const newBudget: Budget = {
				id: Math.max(0, ...budgetsList.map((b) => b.id)) + 1,
				category: formData.category,
				limit: parseFloat(formData.limit),
				spent: 0,
				period: formData.period,
			};
			setBudgetsList([...budgetsList, newBudget]);
		}

		handleCloseDialog();
	};

	const handleDeleteBudget = (budgetId: number) => {
		setBudgetsList(budgetsList.filter((budget) => budget.id !== budgetId));
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
					Budget Management
				</Typography>
				<Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
					Add Budget
				</Button>
			</Box>

			{budgetsList.length === 0 ? (
				<Paper sx={{ p: 3, textAlign: "center" }}>
					<Typography variant="h6" color="text.secondary">
						No budgets created yet
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
						Create your first budget category to start tracking your spending
					</Typography>
					<Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ mt: 2 }}>
						Add Budget
					</Button>
				</Paper>
			) : (
				<Grid container spacing={3}>
					{budgetsList.map((budget) => {
						const spentPercentage = (budget.spent / budget.limit) * 100;
						let progressColor = "primary";
						if (spentPercentage >= 90) progressColor = "error";
						else if (spentPercentage >= 70) progressColor = "warning";

						return (
							<Grid item xs={12} sm={6} md={4} key={budget.id}>
								<Paper sx={{ p: 2, position: "relative" }}>
									<Box sx={{ position: "absolute", right: 8, top: 8 }}>
										<Tooltip title="Edit Budget">
											<IconButton size="small" onClick={() => handleOpenDialog(budget)}>
												<EditIcon fontSize="small" />
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete Budget">
											<IconButton size="small" onClick={() => handleDeleteBudget(budget.id)}>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</Box>
									<Typography variant="h6" component="h2" sx={{ mb: 1, pr: 6 }} noWrap>
										{budget.category}
									</Typography>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mb: 0.5,
										}}
									>
										<Typography variant="body2" color="text.secondary">
											{budget.period === "monthly" ? "Monthly" : "Weekly"} Budget:
										</Typography>
										<Typography variant="body1" fontWeight="medium">
											${budget.limit.toFixed(2)}
										</Typography>
									</Box>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mb: 1,
										}}
									>
										<Typography variant="body2" color="text.secondary">
											Spent:
										</Typography>
										<Typography variant="body1" fontWeight="medium" color={spentPercentage >= 100 ? "error.main" : "text.primary"}>
											${budget.spent.toFixed(2)}
										</Typography>
									</Box>
									<LinearProgress
										variant="determinate"
										value={Math.min(spentPercentage, 100)}
										color={progressColor as "primary" | "secondary" | "error" | "warning" | "info" | "success"}
										sx={{
											height: 8,
											borderRadius: 1,
											mb: 1,
										}}
									/>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										<Typography variant="body2" color="text.secondary">
											Remaining:
										</Typography>
										<Typography variant="body1" fontWeight="medium" color={spentPercentage >= 100 ? "error.main" : "success.main"}>
											${Math.max(0, budget.limit - budget.spent).toFixed(2)}
										</Typography>
									</Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "right", mt: 1 }}>
										{spentPercentage.toFixed(0)}% used
									</Typography>

									{/* Alert for over budget */}
									{spentPercentage >= 100 && (
										<Alert severity="error" sx={{ mt: 1 }} variant="outlined">
											Over budget!
										</Alert>
									)}

									{/* Alert for approaching budget limit */}
									{spentPercentage >= 80 && spentPercentage < 100 && (
										<Alert severity="warning" sx={{ mt: 1 }} variant="outlined">
											Approaching limit
										</Alert>
									)}
								</Paper>
							</Grid>
						);
					})}
				</Grid>
			)}

			{/* Add/Edit Budget Dialog */}
			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
				<DialogTitle>{editingBudget ? "Edit Budget" : "Create New Budget"}</DialogTitle>
				<DialogContent>
					{formError && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{formError}
						</Alert>
					)}

					<TextField margin="dense" name="category" label="Budget Category" fullWidth variant="outlined" value={formData.category} onChange={handleInputChange} required sx={{ mb: 2, mt: 1 }} />

					<TextField margin="dense" name="limit" label="Budget Limit ($)" type="number" fullWidth variant="outlined" value={formData.limit} onChange={handleInputChange} required inputProps={{ min: 0, step: 0.01 }} sx={{ mb: 2 }} />

					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Period</InputLabel>
						<Select name="period" value={formData.period} label="Period">
							{/* <Select name="period" value={formData.period} label="Period" onChange={handleInputChange}> */}
							<MenuItem value="weekly">Weekly</MenuItem>
							<MenuItem value="monthly">Monthly</MenuItem>
						</Select>
					</FormControl>

					<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
						Last updated: {currentDateTime}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={handleSaveBudget} variant="contained">
						{editingBudget ? "Save Changes" : "Create Budget"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Budgets;
