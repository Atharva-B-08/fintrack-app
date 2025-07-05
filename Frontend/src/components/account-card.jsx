import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "react-toastify";
import useFetch from "../hooks/use-fetch";
import { updateDefaultAccount } from "../actions/account";

const AccountCard = ({ account, handleDefaultUpdate }) => {
  const { name, type, balance, accountDefault, id } = account;

  const {
    loading: updateDefaultLoading,
    error: updateDefaultError,
    fn: updateDefaultFn,
    data: updatedAccount,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async () => {
    // nnot update default account
    if (accountDefault) {
      toast.warning("You need at least one default account");
      return;
    }

    await updateDefaultFn(id);
    handleDefaultUpdate(id);
  };

  useEffect(() => {
    if (updatedAccount) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (updateDefaultError) {
      toast.error("Failed to update default account");
    }
  }, [updateDefaultError]);

  return (
    <Card className="hover:shadow-lg transition-shadow group relative rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-4">
        <CardHeader className="p-0 flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-xl font-medium capitalize truncate max-w-[150px]">
            {name}
          </CardTitle>
          <Switch
            checked={accountDefault}
            onCheckedChange={handleDefaultChange}
            disabled={updateDefaultLoading}
            className="data-[state=checked]:bg-black
          data-[state=unchecked]:bg-gray-300
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            before:content-['']
            before:absolute
            before:h-5
            before:w-5
            before:rounded-full
            before:bg-white
            before:transition-transform
            before:translate-x-1
            data-[state=checked]:before:translate-x-5
            "
          />
        </CardHeader>

        {/* Balance & Type */}
        <Link to={`/account/${id}`} className="block ">
          <CardContent className="p-0">
            <div className="text-2xl font-bold mt-2">
              ₹{parseFloat(balance).toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
          </CardContent>
        </Link>
        {/* Footer */}
        <CardFooter className="p-0 mt-4 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center text-green-600 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Income
          </div>
          <div className="flex items-center text-red-500 font-medium">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            Expense
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default AccountCard;
