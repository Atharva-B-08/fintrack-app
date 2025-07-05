import { subDays } from "date-fns";

const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export function generateTransactions(userId, accountId, days = 90) {
  const transactions = [];
  let totalBalance = 0;

  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < transactionsPerDay; j++) {
      const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
      const { category, amount } = getRandomCategory(type);

      const transaction = {
        type,
        amount,
        description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
        category,
        status: "COMPLETED",
        userId,
        accountId,
        date,
        createdAt: date,
        updatedAt: date,
      };

      totalBalance += type === "INCOME" ? amount : -amount;
      transactions.push(transaction);
    }
  }

  return { transactions, balance: totalBalance };
}
