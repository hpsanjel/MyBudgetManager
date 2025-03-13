import React, { useState } from "react";
import { Container, Typography, Box, Grid, Paper, Button, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, IconButton, Tooltip, Card, CardContent, CardActions, CardHeader, Divider, Avatar, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SavingsIcon from "@mui/icons-material/Savings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import { savingsGoals } from "../data/mockData";

// Interface for a savings goal
interface SavingsGoal {
	id: number;
	name: string;
	targetAmount: number;
	currentAmount: number;
	deadline: string;
}

const Savings = () => {
	const [goals, setGoals] = useState<SavingsGoal[]>(savingsGoals);
	const [openDialog, setOpenDialog] = useState(false);
	const [openContributionDialog, setOpenContributionDialog] = useState(false);
	const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
	const [contributionAmount, setContributionAmount] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({ open: false, goalId: -1 });

	const [formData, setFormData] = useState({
		name: "",
		targetAmount: "",
		currentAmount: "",
		deadline: new Date().toISOString().split("T")[0],
	});

	// Current date and time
	const currentDateTime = "2025-03-13 16:41:00";
	const username = "hpsanjel";

	const handleOpenDialog = (goal?: SavingsGoal) => {
		if (goal) {
			setEditingGoal(goal);
			setFormData({
				name: goal.name,
				targetAmount: goal.targetAmount.toString(),
				currentAmount: goal.currentAmount.toString(),
				deadline: goal.deadline,
			});
		} else {
			setEditingGoal(null);
			setFormData({
				name: "",
				targetAmount: "",
				currentAmount: "0",
				deadline: new Date().toISOString().split("T")[0],
			});
		}
		setOpenDialog(true);
	};

	const handleOpenContributionDialog = (goal: SavingsGoal) => {
		setEditingGoal(goal);
		setContributionAmount("");
		setOpenContributionDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleCloseContributionDialog = () => {
		setOpenContributionDialog(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleDateChange = (date: Date | null) => {
		if (date) {
			setFormData({
				...formData,
				deadline: date.toISOString().split("T")[0],
			});
		}
	};

	const handleSaveGoal = () => {
		// Form validation
		if (!formData.name.trim() || !formData.targetAmount || parseFloat(formData.targetAmount) <= 0 || !formData.deadline) {
			setSnackbar({
				open: true,
				message: "Please fill in all required fields correctly",
				severity: "error",
			});
			return;
		}

		if (editingGoal) {
			// Update existing goal
			setGoals(
				goals.map((goal) =>
					goal.id === editingGoal.id
						? {
								...goal,
								name: formData.name,
								targetAmount: parseFloat(formData.targetAmount),
								currentAmount: parseFloat(formData.currentAmount),
								deadline: formData.deadline,
						  }
						: goal
				)
			);
			setSnackbar({
				open: true,
				message: "Goal updated successfully",
				severity: "success",
			});
		} else {
			// Add new goal
			const newGoal: SavingsGoal = {
				id: Math.max(0, ...goals.map((g) => g.id)) + 1,
				name: formData.name,
				targetAmount: parseFloat(formData.targetAmount),
				currentAmount: parseFloat(formData.currentAmount) || 0,
				deadline: formData.deadline,
			};
			setGoals([...goals, newGoal]);
			setSnackbar({
				open: true,
				message: "New goal added successfully",
				severity: "success",
			});
		}

		handleCloseDialog();
	};

	const handleAddContribution = () => {
		if (!editingGoal || !contributionAmount || parseFloat(contributionAmount) <= 0) {
			setSnackbar({
				open: true,
				message: "Please enter a valid contribution amount",
				severity: "error",
			});
			return;
		}

		const amount = parseFloat(contributionAmount);

		// Update the goal with new contribution
		setGoals(
			goals.map((goal) =>
				goal.id === editingGoal.id
					? {
							...goal,
							currentAmount: goal.currentAmount + amount,
					  }
					: goal
			)
		);

		// Check if goal has been completed with this contribution
		const updatedGoal = goals.find((g) => g.id === editingGoal.id);
		if (updatedGoal && updatedGoal.currentAmount + amount >= updatedGoal.targetAmount) {
			setSnackbar({
				open: true,
				message: `Congratulations! You've reached your ${updatedGoal.name} goal!`,
				severity: "success",
			});
		} else {
			setSnackbar({
				open: true,
				message: `Added $${amount.toFixed(2)} to ${editingGoal.name}`,
				severity: "success",
			});
		}

		handleCloseContributionDialog();
	};

	const handleDeleteGoal = (goalId: number) => {
		setGoals(goals.filter((goal) => goal.id !== goalId));
		setSnackbar({
			open: true,
			message: "Goal deleted successfully",
			severity: "info",
		});
		setConfirmDeleteDialog({ open: false, goalId: -1 });
	};

	const openDeleteConfirmation = (goalId: number) => {
		setConfirmDeleteDialog({ open: true, goalId });
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Calculate total savings
	const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
	const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
	const overallProgress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;

	// Calculate days remaining until deadline
	const getDaysRemaining = (deadline: string) => {
		const today = new Date();
		const deadlineDate = new Date(deadline);
		const diffTime = deadlineDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	// Get color based on progress percentage
	const getColorByProgress = (progress: number) => {
		if (progress >= 100) return "success";
		if (progress >= 70) return "info";
		if (progress >= 40) return "primary";
		return "warning";
	};

	// Sort goals by priority (close deadlines or high progress first)
	const sortedGoals = [...goals].sort((a, b) => {
		const aDaysRemaining = getDaysRemaining(a.deadline);
		const bDaysRemaining = getDaysRemaining(b.deadline);
		const aProgress = (a.currentAmount / a.targetAmount) * 100;
		const bProgress = (b.currentAmount / b.targetAmount) * 100;

		// Completed goals at the end
		if (aProgress >= 100 && bProgress < 100) return 1;
		if (aProgress < 100 && bProgress >= 100) return -1;

		// Urgent goals (less than 30 days) first
		if (aDaysRemaining < 30 && bDaysRemaining >= 30) return -1;
		if (aDaysRemaining >= 30 && bDaysRemaining < 30) return 1;

		// Then sort by days remaining
		return aDaysRemaining - bDaysRemaining;
	});

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
					Savings Goals
				</Typography>
				<Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
					Add Goal
				</Button>
			</Box>

			{/* Overall Progress Section */}
			<Paper
				sx={{
					p: 3,
					mb: 4,
					background: "linear-gradient(45deg, #4a148c 30%, #7b1fa2 90%)",
					color: "white",
				}}
			>
				<Grid container spacing={3} alignItems="center">
					<Grid item xs={12} md={8}>
						<Typography variant="h6" gutterBottom>
							Overall Savings Progress
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
							<Box sx={{ width: "100%", mr: 1 }}>
								<LinearProgress variant="determinate" value={Math.min(overallProgress, 100)} sx={{ height: 10, borderRadius: 5 }} />
							</Box>
							<Box sx={{ minWidth: 35 }}>
								<Typography variant="body2" color="inherit">
									{overallProgress.toFixed(0)}%
								</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
						<Typography variant="body2" sx={{ mb: 1 }}>
							Total Saved: <b>${totalSavings.toFixed(2)}</b>
						</Typography>
						<Typography variant="body2">
							Total Goals: <b>${totalTarget.toFixed(2)}</b>
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			{/* Savings Goals Cards */}
			{goals.length === 0 ? (
				<Paper sx={{ p: 3, textAlign: "center" }}>
					<SavingsIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.3, my: 2 }} />
					<Typography variant="h6" color="text.secondary">
						No savings goals yet
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
						Create your first savings goal to start tracking your progress
					</Typography>
					<Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ mt: 2 }}>
						Add Goal
					</Button>
				</Paper>
			) : (
				<Grid container spacing={3}>
					{sortedGoals.map((goal) => {
						const progress = (goal.currentAmount / goal.targetAmount) * 100;
						const daysRemaining = getDaysRemaining(goal.deadline);
						const progressColor = getColorByProgress(progress);
						const isCompleted = progress >= 100;

						return (
							<Grid item xs={12} sm={6} md={4} key={goal.id}>
								<Card sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
									{isCompleted && (
										<Box
											sx={{
												position: "absolute",
												top: -8,
												right: -8,
												bgcolor: "success.main",
												color: "white",
												borderRadius: "50%",
												width: 40,
												height: 40,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												zIndex: 1,
											}}
										>
											<EmojiEventsIcon />
										</Box>
									)}

									<CardHeader
										avatar={
											<Avatar sx={{ bgcolor: `${progressColor}.main` }}>
												<SavingsIcon />
											</Avatar>
										}
										title={goal.name}
										subheader={`Target: ${goal.targetAmount.toFixed(2)}`}
										action={
											<Box>
												<Tooltip title="Edit Goal">
													<IconButton size="small" onClick={() => handleOpenDialog(goal)}>
														<EditIcon fontSize="small" />
													</IconButton>
												</Tooltip>
												<Tooltip title="Delete Goal">
													<IconButton size="small" onClick={() => openDeleteConfirmation(goal.id)}>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											</Box>
										}
									/>

									<CardContent sx={{ flexGrow: 1, pt: 0 }}>
										<LinearProgress variant="determinate" value={Math.min(progress, 100)} color={progressColor as "primary" | "secondary" | "error" | "warning" | "info" | "success"} sx={{ height: 10, borderRadius: 5, mb: 2 }} />

										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography variant="body2" color="text.secondary">
													Saved:
												</Typography>
												<Typography variant="body1" fontWeight="medium">
													${goal.currentAmount.toFixed(2)}
												</Typography>
											</Grid>
											<Grid item xs={6} sx={{ textAlign: "right" }}>
												<Typography variant="body2" color="text.secondary">
													Remaining:
												</Typography>
												<Typography variant="body1" fontWeight="medium">
													${Math.max(0, goal.targetAmount - goal.currentAmount).toFixed(2)}
												</Typography>
											</Grid>
										</Grid>

										<Divider sx={{ my: 2 }} />

										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography variant="body2" color="text.secondary">
													Progress:
												</Typography>
												<Typography variant="body1" fontWeight="medium">
													{progress.toFixed(0)}%
												</Typography>
											</Grid>
											<Grid item xs={6} sx={{ textAlign: "right" }}>
												<Typography variant="body2" color="text.secondary">
													Deadline:
												</Typography>
												<Typography variant="body1" fontWeight="medium">
													{new Date(goal.deadline).toLocaleDateString()}
												</Typography>
											</Grid>
										</Grid>

										<Box sx={{ mt: 1 }}>
											<Typography variant="body2" color={daysRemaining > 30 ? "text.secondary" : "error"} textAlign="right" fontWeight={daysRemaining < 30 && !isCompleted ? "bold" : "normal"}>
												{isCompleted ? "Goal Completed!" : `${daysRemaining} days remaining`}
											</Typography>
										</Box>
									</CardContent>

									<CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
										<Button variant="outlined" size="small" onClick={() => handleOpenContributionDialog(goal)} disabled={isCompleted}>
											Add Contribution
										</Button>
									</CardActions>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			)}

			{/* Add/Edit Goal Dialog */}
			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
				<DialogTitle>{editingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}</DialogTitle>
				<DialogContent>
					<Grid container spacing={2} sx={{ mt: 0.5 }}>
						<Grid item xs={12}>
							<TextField name="name" label="Goal Name" fullWidth value={formData.name} onChange={handleInputChange} required placeholder="e.g., Emergency Fund, Vacation, New Car" />
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								name="targetAmount"
								label="Target Amount"
								type="number"
								fullWidth
								value={formData.targetAmount}
								onChange={handleInputChange}
								required
								InputProps={{
									startAdornment: <InputAdornment position="start">$</InputAdornment>,
								}}
								inputProps={{ min: 0, step: 0.01 }}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								name="currentAmount"
								label="Current Amount"
								type="number"
								fullWidth
								value={formData.currentAmount}
								onChange={handleInputChange}
								InputProps={{
									startAdornment: <InputAdornment position="start">$</InputAdornment>,
								}}
								inputProps={{ min: 0, step: 0.01 }}
							/>
						</Grid>
						{/* <Grid item xs={12}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									label="Deadline"
									value={new Date(formData.deadline)}
									onChange={handleDateChange}
									slotProps={{
										textField: {
											fullWidth: true,
											required: true,
										},
									}}
									minDate={new Date()}
								/>
							</LocalizationProvider>
						</Grid> */}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button variant="contained" color="primary" onClick={handleSaveGoal}>
						{editingGoal ? "Update Goal" : "Create Goal"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add Contribution Dialog */}
			<Dialog open={openContributionDialog} onClose={handleCloseContributionDialog} maxWidth="xs" fullWidth>
				<DialogTitle>Add Contribution</DialogTitle>
				<DialogContent>
					{editingGoal && (
						<>
							<Typography variant="subtitle1" gutterBottom>
								{editingGoal.name}
							</Typography>
							<Box sx={{ mb: 2 }}>
								<Typography variant="body2" color="text.secondary">
									Current progress: ${editingGoal.currentAmount.toFixed(2)} of ${editingGoal.targetAmount.toFixed(2)} ({((editingGoal.currentAmount / editingGoal.targetAmount) * 100).toFixed(0)}%)
								</Typography>
								<LinearProgress variant="determinate" value={Math.min((editingGoal.currentAmount / editingGoal.targetAmount) * 100, 100)} sx={{ height: 8, borderRadius: 5, mt: 1 }} />
							</Box>
							<TextField
								label="Contribution Amount"
								type="number"
								fullWidth
								value={contributionAmount}
								onChange={(e) => setContributionAmount(e.target.value)}
								required
								autoFocus
								InputProps={{
									startAdornment: <InputAdornment position="start">$</InputAdornment>,
								}}
								inputProps={{ min: 0.01, step: 0.01 }}
								sx={{ mt: 1 }}
							/>
							{contributionAmount && (
								<Box sx={{ mt: 2 }}>
									<Typography variant="body2" color="text.secondary">
										New progress after contribution:
									</Typography>
									<Typography variant="body1" fontWeight="medium">
										${(editingGoal.currentAmount + parseFloat(contributionAmount || "0")).toFixed(2)} of ${editingGoal.targetAmount.toFixed(2)}({Math.min(((editingGoal.currentAmount + parseFloat(contributionAmount || "0")) / editingGoal.targetAmount) * 100, 100).toFixed(0)}%)
									</Typography>
								</Box>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseContributionDialog}>Cancel</Button>
					<Button variant="contained" color="primary" onClick={handleAddContribution}>
						Add Contribution
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirm Delete Dialog */}
			<Dialog open={confirmDeleteDialog.open} onClose={() => setConfirmDeleteDialog({ ...confirmDeleteDialog, open: false })}>
				<DialogTitle>Delete Goal</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to delete this savings goal? This action cannot be undone.</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmDeleteDialog({ ...confirmDeleteDialog, open: false })}>Cancel</Button>
					<Button variant="contained" color="error" onClick={() => handleDeleteGoal(confirmDeleteDialog.goalId)}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar for notifications */}
			<Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity as "success" | "info" | "warning" | "error"} sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default Savings;
