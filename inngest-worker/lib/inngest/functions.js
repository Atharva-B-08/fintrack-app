import { inngest } from "./client.js";
import fetch from "node-fetch";
import {sendEmail} from "../utils/sendEmail.js";
import {EmailTemplate} from "../utils/EmailTemplate.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Utility: Check if the transaction is due
function isTransactionDue(transaction) {
  if (!transaction.lastProcessed) return true;
  const nextDue = new Date(transaction.nextRecurringDate);
  return nextDue <= new Date();
}

// Utility: Calculate next recurring date
function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

// 👉 Main Inngest function with Spring Boot integration
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const SPRING_BOOT_API = process.env.SPRING_BOOT_API; 

      // 1. Fetch transaction from Spring Boot
      const transactionRes = await fetch(
        `${SPRING_BOOT_API}/api/transactions/inngest/${event.data.transactionId}?userId=${event.data.userId}`
      );

      if (!transactionRes.ok) {
        console.error("Failed to fetch transaction");
        return;
      }

      const transaction = await transactionRes.json();

      if (!transaction || !isTransactionDue(transaction)) {
        return;
      }

      // 2. Call Spring Boot API to process the recurring transaction
      const processRes = await fetch(
        `${SPRING_BOOT_API}/api/transactions/inngest/recurring/process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: transaction.id,
            userId: transaction.userId,
            accountId: transaction.accountId,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            recurringInterval: transaction.recurringInterval,
          }),
        }
      );

      if (!processRes.ok) {
        console.error("Failed to process recurring transaction gggggggggg");
        return;
      }

      return { success: true };
    });
  }
);


async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: ₹${stats.totalIncome}
    - Total Expenses: ₹${stats.totalExpenses}
    - Net Income: ₹${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: ₹${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

// 👉 Function to trigger recurring transactions
export const triggerRecurringTransactions = inngest.createFunction(
    {
      id: "trigger-recurring-transactions",
      name: "Trigger Recurring Transactions",
    },
    { cron: "0 0 * * *" }, // Runs daily at midnight
    async ({ step }) => {
      const SPRING_BOOT_API = process.env.SPRING_BOOT_API; 
  
      // Step 1: Fetch all due recurring transactions from Spring Boot
      const recurringTransactions = await step.run(
        "fetch-recurring-transactions",
        async () => {
          const response = await fetch(`${SPRING_BOOT_API}/api/transactions/inngest/recurring/due`);
          console.log(response.ok);
          if (!response.ok) {
            console.error("Failed to fetch recurring transactions");
            return [];
          }
          return await response.json();
        }
      );
  
      // Step 2: Send each as a separate event to process
      if (recurringTransactions.length > 0) {
        const events = recurringTransactions.map((transaction) => ({
          name: "transaction.recurring.process",
          data: {
            transactionId: transaction.id,
            userId: transaction.userId,
          },
        }));
  
        await inngest.send(events);
      }
  
      return { triggered: recurringTransactions.length };
    }
  );

  // 👉 Function to generate monthly reports
  export const generateMonthlyReports = inngest.createFunction(
    {
      id: "generate-monthly-reports",
      name: "Generate Monthly Reports",
    },
    { cron: "0 0 1 * *" }, // Every 1st of month
    async ({ step }) => {
      const SPRING_BOOT_API = process.env.SPRING_BOOT_API;
  
      // Step 1: Fetch all users with accounts
      const users = await step.run("fetch-users", async () => {
        const res = await fetch(`${SPRING_BOOT_API}/api/users/inngest/with-accounts`); 
        if (!res.ok) return [];
        return await res.json();
      });
  
      for (const user of users) {
        await step.run(`generate-report-${user.id}`, async () => {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
  
          // Step 2: Fetch monthly stats from Spring Boot
          const statsRes = await fetch(
            `${SPRING_BOOT_API}/api/transactions/inngest/stats/monthly?userId=${user.id}&year=${lastMonth.getFullYear()}&month=${
              lastMonth.getMonth() + 1
            }`
          );
          if (!statsRes.ok) return;
          
          const stats = await statsRes.json();
          // console.log(stats);
          const monthName = lastMonth.toLocaleString("default", {
            month: "long",
          });
  
          // Step 3: Generate insights using Gemini
          const insights = await generateFinancialInsights(stats, monthName);
          console.log(insights);
          // Step 4: Send email report
          await sendEmail({
            to: user.email,
            subject: `Your Monthly Financial Report - ${monthName}`,
            html: EmailTemplate({
              userName: user.name,
              type: "monthly-report",
              data: {
                stats,
                month: monthName,
                insights,
              },
            }),
          });
        });
      }
  
      return { processed: users.length };
    }
  );


  function isNewMonth(lastAlertDate, currentDate) {
    return (
      lastAlertDate.getMonth() !== currentDate.getMonth() ||
      lastAlertDate.getFullYear() !== currentDate.getFullYear()
    );
  }
  
  export const checkBudgetAlerts = inngest.createFunction(
    { name: "Check Budget Alerts" },
    { cron: "0 */6 * * *" }, // Every 6 hours
    async ({ step }) => {
      const SPRING_BOOT_API = process.env.SPRING_BOOT_API;
      console.log("Checking budget alerts...");
  
      // Step 1: Fetch all budgets with users and default accounts
      const budgets = await step.run("fetch-budgets", async () => {
        const res = await fetch(`${SPRING_BOOT_API}/api/budget/inngest/with-default-accounts`);
        if (!res.ok) {
          console.error("Failed to fetch budgets");
          return [];
        }
        return await res.json();
      });
  
      for (const budget of budgets) {
        const defaultAccount = budget.user.accounts[0];
    
        if (!defaultAccount) continue;
  
        await step.run(`check-budget-${budget.id}`, async () => {
          const startDate = new Date();
          startDate.setDate(1); // 1st of current month
  

          // Step 2: Fetch total expenses from Spring Boot
          const expensesRes = await fetch(
            `${SPRING_BOOT_API}/api/transactions/inngest/total-expense?userId=${budget.userId}&accountId=${defaultAccount.id}&startDate=${startDate.toISOString().slice(0, 19)}`
          );
          if (!expensesRes.ok) {
            console.error("Failed to fetch total expenses");
            return;
          }

          const expensesData = await expensesRes.json();
          const totalExpenses = expensesData.totalExpenses || 0;
          const budgetAmount = budget.amount;
          const percentageUsed = (totalExpenses / budgetAmount) * 100;
          
  
          // Step 3: Check if alert should be sent
          if (
            percentageUsed >= 80 &&
            (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))
          ) {
            await sendEmail({
              to: budget.user.email,
              subject: `Budget Alert for ${defaultAccount.name}`,
              html: EmailTemplate({
                userName: budget.user.name,
                type: "budget-alert",
                data: {
                  percentageUsed,
                  budgetAmount: parseInt(budgetAmount).toFixed(1),
                  totalExpenses: parseInt(totalExpenses).toFixed(1),
                  accountName: defaultAccount.name,
                },
              }),
            });
            console.log("Email sent successfully");
  
            // Step 4: Update lastAlertSent in Spring Boot
            await fetch(`${SPRING_BOOT_API}/api/budget/inngest/${budget.id}/alert-sent`, {
              method: "PUT",
            });
          }
        });
      } 
    }
  );
  

