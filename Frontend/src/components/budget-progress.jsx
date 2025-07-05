import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Pencil, X } from "lucide-react";
import useFetch from "../hooks/use-fetch";
import { updateBudget } from "../actions/budget";
import { toast } from "react-toastify";

const BudgetProgress = ({ initialBudget, currentExpenses, setBudgetData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateBudgetFn,
    data: updatedBudget,
  } = useFetch(updateBudget);
  console.log("updatedBudget", updatedBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn({ amount });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget) {
      setIsEditing(false);
      // ✅ Update parent Dashboard state
      setBudgetData((prev) => ({
        ...prev,
        budget: updatedBudget, // this updates the amount in Dashboard
      }));
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message || "Failed to update budget");
    }
  }, [updateError]);

  return (
    <Card className="hover:shadow-lg transition-shadow group relative rounded-xl border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle>Monthly Budget (Default Account)</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={updateLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  className="hover:bg-green-200 hover:text-green-500"
                  disabled={updateLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="hover:bg-red-200 hover:text-red-500"
                  disabled={updateLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-sm  text-gray-600 font-medium">
                  {initialBudget
                    ? `₹${currentExpenses.toFixed(
                        2
                      )} of ₹${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                {currentExpenses > initialBudget.amount && (
                  <div className="text-red-500 text-sm font-medium">
                    Budget Exceeded
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <div className="w-full mt-2 bg-gray-200 rounded-full h-3">
              <div
                className={`h-full rounded-full transition-all 
                    ${percentUsed > 100 ? "animate-pulse" : ""}`}
                style={{
                  width: `${Math.min(percentUsed, 100)}%`,
                  backgroundColor:
                    percentUsed >= 90
                      ? "#ef4444"
                      : percentUsed >= 75
                      ? "#facc15"
                      : "#22c55e",
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
