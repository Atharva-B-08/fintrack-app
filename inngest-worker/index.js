import express from "express";
import { serve } from "inngest/express";
import dotenv from "dotenv";
import { inngest } from "./lib/inngest/client.js";
import {
  processRecurringTransaction,
  triggerRecurringTransactions,
  generateMonthlyReports,
  checkBudgetAlerts,
} from "./lib/inngest/functions.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
// Setup the Inngest handler
const handler = serve({
  client: inngest,
  functions: [
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts,
  ],
});

// Attach the handler to a route
app.use("/api/inngest", handler);

// Optional: health check
app.get("/", (req, res) => res.send("✅ Inngest Worker is running"));

app.listen(port, () => {
  console.log(`🚀 Inngest worker listening on http://localhost:${port}`);
});

