import { useAuth } from "../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateAccountDrawer from "../components/create-account-drawer";
import { Plus } from "lucide-react";
import { getAccounts, getUserTransactions } from "../actions/dashboard";
import AccountCard from "../components/account-card";
import { useState, useEffect } from "react";
import { getCurrentBudget } from "../actions/budget";
import BudgetProgress from "../components/budget-progress";
import DashboardOverview from "../components/dashboard-overview";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgetData, setBudgetData] = useState(null);

  const [budgetLoading, setBudgetLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const handleDefaultUpdate = (updatedAccountId) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === updatedAccountId
          ? { ...acc, accountDefault: true }
          : { ...acc, accountDefault: false }
      )
    );
  };

  const defaultAccount = accounts.find((account) => account.accountDefault);

  // 🧠 Fetch accounts and transactions in parallel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setAccountsLoading(true);
        setTransactionsLoading(true);

        const [accountsRes, transactionsRes] = await Promise.all([
          getAccounts(),
          getUserTransactions(),
        ]);

        setAccounts(accountsRes);
        setTransactions(transactionsRes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setAccountsLoading(false);
        setTransactionsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      if (defaultAccount) {
        try {
          const data = await getCurrentBudget(defaultAccount.id);
          setBudgetData(data);
        } catch (error) {
          console.error("Error fetching budget:", error);
        } finally {
          setBudgetLoading(false);
        }
      }
    };

    fetchBudget();
  }, [defaultAccount]);

  return (
    <div className="space-y-8">
      <h1 className="text-6xl font-bold tracking-tight gradient-title ">
        Dashboard
      </h1>
      {/* Budget Progress */}
      {defaultAccount &&
        (budgetLoading ? (
          <div className=" text-center text-2xl font-bold text-gray-500">
            Loading budget...
          </div>
        ) : (
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetData?.currentExpenses || 0}
            setBudgetData={setBudgetData}
          />
        ))}

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Add New Account Card */}
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center h-full pt-5">
              <Plus className="h-10 w-10 text-gray-500 mb-12" />
              <p className="text-sm font-semibold text-gray-600">
                Add New Account
              </p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* Map Account Cards */}
        {accounts?.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            handleDefaultUpdate={handleDefaultUpdate}
          />
        ))}
      </div>
    </div>
  );
}
