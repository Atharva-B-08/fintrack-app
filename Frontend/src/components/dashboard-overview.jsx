import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

const DashboardOverview = ({ accounts, transactions }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      const defaultAccount = accounts.find(
        (account) => account.accountDefault === true
      );
      setSelectedAccountId(defaultAccount?.id || accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  // Filter transactions by selected account
  const accountTransactions = useMemo(() => {
    return transactions.filter((txn) => txn.accountId === selectedAccountId);
  }, [transactions, selectedAccountId]);

  // Sort recent transactions (latest first)
  const recentTransactions = useMemo(() => {
    return [...accountTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [accountTransactions]);

  // Pie Chart: Calculate current month expenses grouped by category
  const pieChartData = useMemo(() => {
    const currentDate = new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === "EXPENSE" &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });

    const grouped = currentMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [accountTransactions]);


  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="hover:shadow-lg transition-shadow group relative rounded-xl border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-normal">
            Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[180px] border text-black/80 border-gray-200 hover:border-gray-400 shadow-md data-[state=focused]:outline-none font-semibold">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent className="bg-gray-50 shadow-md rounded-md z-50 border border-gray-200">
              {accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="hover:bg-gray-100 text-base"
                >
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => {
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-normal truncate max-w-[350px] ">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.date), "PP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex items-center",
                          transaction.type === "EXPENSE"
                            ? "text-red-500"
                            : "text-green-500"
                        )}
                      >
                        {transaction.type === "EXPENSE" ? (
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                        )}
                        ₹{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="hover:shadow-lg transition-shadow group relative rounded-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-normal">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          {pieChartData.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No expenses this month
            </p>
          ) : (
            <>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ₹${value.toFixed(2)}`
                      }
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
