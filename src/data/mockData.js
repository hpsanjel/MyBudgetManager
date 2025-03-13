export const transactions = [
	{
		id: 1,
		type: "expense",
		category: "Food & Dining",
		amount: 45.99,
		date: "2025-03-10",
		description: "Grocery shopping",
	},
	{
		id: 2,
		type: "expense",
		category: "Transportation",
		amount: 30.0,
		date: "2025-03-09",
		description: "Fuel",
	},
	{
		id: 3,
		type: "income",
		category: "Salary",
		amount: 3200.0,
		date: "2025-03-01",
		description: "Monthly salary",
	},
	{
		id: 4,
		type: "expense",
		category: "Entertainment",
		amount: 25.99,
		date: "2025-03-07",
		description: "Movie tickets",
	},
	{
		id: 5,
		type: "expense",
		category: "Utilities",
		amount: 150.0,
		date: "2025-03-05",
		description: "Electricity bill",
	},
	{
		id: 6,
		type: "income",
		category: "Freelance",
		amount: 350.0,
		date: "2025-03-08",
		description: "Website project",
	},
];

export const budgets = [
	{
		id: 1,
		category: "Food & Dining",
		limit: 500.0,
		spent: 350.5,
		period: "monthly",
	},
	{
		id: 2,
		category: "Transportation",
		limit: 200.0,
		spent: 160.0,
		period: "monthly",
	},
	{
		id: 3,
		category: "Entertainment",
		limit: 150.0,
		spent: 75.99,
		period: "monthly",
	},
	{
		id: 4,
		category: "Utilities",
		limit: 300.0,
		spent: 265.0,
		period: "monthly",
	},
	{
		id: 5,
		category: "Shopping",
		limit: 200.0,
		spent: 135.45,
		period: "monthly",
	},
];

export const savingsGoals = [
	{
		id: 1,
		name: "Emergency Fund",
		targetAmount: 10000.0,
		currentAmount: 6500.0,
		deadline: "2025-12-31",
	},
	{
		id: 2,
		name: "Vacation Fund",
		targetAmount: 3000.0,
		currentAmount: 1200.0,
		deadline: "2025-06-30",
	},
	{
		id: 3,
		name: "New Laptop",
		targetAmount: 1500.0,
		currentAmount: 800.0,
		deadline: "2025-05-15",
	},
];

export const monthlyData = [
	{
		month: "Jan",
		income: 3550,
		expenses: 2800,
		savings: 750,
	},
	{
		month: "Feb",
		income: 3600,
		expenses: 2750,
		savings: 850,
	},
	{
		month: "Mar",
		income: 3550,
		expenses: 3000,
		savings: 550,
	},
	{
		month: "Apr",
		income: 3700,
		expenses: 2900,
		savings: 800,
	},
	{
		month: "May",
		income: 3550,
		expenses: 2850,
		savings: 700,
	},
	{
		month: "Jun",
		income: 4000,
		expenses: 3100,
		savings: 900,
	},
];

export const categoryData = [
	{ name: "Food & Dining", value: 350.5 },
	{ name: "Transportation", value: 160.0 },
	{ name: "Entertainment", value: 75.99 },
	{ name: "Utilities", value: 265.0 },
	{ name: "Shopping", value: 135.45 },
	{ name: "Health", value: 120.0 },
	{ name: "Others", value: 95.0 },
];
