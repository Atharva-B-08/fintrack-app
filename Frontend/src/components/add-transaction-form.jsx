import React from "react";
import { useForm } from "react-hook-form";
import { transactionSchema } from "../lib/Schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import CreateAccountDrawer from "./create-account-drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Switch } from "./ui/switch";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/use-fetch";
import { createTransaction, updateTransaction } from "../actions/transaction";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ReceiptScanner from "./receipt-scanner";
import { Loader2 } from "lucide-react";
const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.transaction.type,
            amount: initialData.transaction.amount.toString(),
            description: initialData.transaction.description,
            accountId: initialData.transaction.accountId.toString(),
            category: initialData.transaction.category,
            date: new Date(initialData.transaction.date),
            isRecurringTxn: initialData.transaction.recurring ? true : false,
            ...(initialData.transaction.recurringInterval && {
              recurringInterval: initialData.transaction.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            category: "",
            date: new Date(),
            isRecurringTxn: false,
          },
  });

  const type = watch("type");
  const isRecurringTxn = watch("isRecurringTxn");
  const date = watch("date");

  const filterCategories = categories.filter(
    (category) => category.type === type
  );

  const {
    fn: transactionFn,
    data: transactionData,
    loading: transactionLoading,
    error: transactionError,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      accountId: parseFloat(data.accountId),
      amount: parseFloat(data.amount),
      date: new Date(data.date).toISOString(),
      recurringInterval: isRecurringTxn ? data.recurringInterval : null,
    };
    if (editMode) {
      transactionFn(initialData.transaction.id, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    console.log("Scanned Data:", scannedData);
    
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    
  };

  useEffect(() => {
    console.log(transactionData);
    if (transactionData?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      navigate(-1);
    }
    if (transactionError) {
      toast.error(
        editMode
          ? "Failed to update transaction"
          : "Failed to create transaction"
      );
    }
  }, [transactionData, transactionLoading, editMode]);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* AI transaction scanner */}
        {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

        <div className="space-y-2">
          <label className="text-sm font-medium">Transaction Type</label>
          <Select
            onValueChange={(value) => setValue("type", value)}
            defaultValue={type}
          >
            <SelectTrigger className="w-full border border-gray-200 hover:border-gray-400 shadow-md font-semibold">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-50 shadow-md rounded-md z-50 border border-gray-200 ">
              <SelectItem
                value="INCOME"
                className="hover:bg-gray-100 text-base"
              >
                INCOME
              </SelectItem>
              <SelectItem
                value="EXPENSE"
                className="hover:bg-gray-100 text-base"
              >
                EXPENSE
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full data-[state=focus]:outline-none border border-gray-200 hover:border-gray-400 shadow-md  "
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Account</label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              defaultValue={getValues("accountId")}
            >
              <SelectTrigger className="w-full border text-black border-gray-200 hover:border-gray-400 shadow-md data-[state=focused]:outline-none font-semibold">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent className="bg-gray-50 shadow-md rounded-md z-50 border border-gray-200">
                {accounts.map((account) => (
                  <SelectItem
                    key={account.id}
                    value={account.id.toString()}
                    className="hover:bg-gray-100 text-base"
                  >
                    {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                  </SelectItem>
                ))}
                <div className="text-center">
                  <CreateAccountDrawer>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border border-gray-50 hover:bg-gray-200 w-full "
                    >
                      <Plus className="h-4 w-4" /> Add Account
                    </Button>
                  </CreateAccountDrawer>
                </div>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountId.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            onValueChange={(value) => setValue("category", value)}
            defaultValue={getValues("category")}
            value={getValues("category")}
          >
            <SelectTrigger className="w-full border border-gray-200 hover:border-gray-400 shadow-md data-[state=focused]:outline-none font-semibold">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-50 shadow-md rounded-md z-50 border border-gray-200">
            
              {filterCategories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="hover:bg-gray-100 text-base"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger
              asChild
              className="border border-gray-200 hover:border-gray-400 shadow-md data-[state=focused]:outline-none"
            >
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-semibold  ",
                  !date &&
                    "text-gray-500  border-gray-200 hover:border-gray-400"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-gray-50 shadow-md z-50 border-0  "
              align="end"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                classNames={{
                  selected: "bg-black text-white ",
                  day: "text-gray-900 rounded-md hover:bg-black hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Input
            {...register("description")}
            className="w-full border border-gray-200 hover:border-gray-400 shadow-md data-[state=focused]:outline-none"
            placeholder="Enter description"
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}

        {/* Recurring trnasaction         */}
        <div className="flex items-center justify-between rounded-lg border p-3 border-gray-200 shadow-md">
          <div className="space-y-0.5">
            <label className="text-base font-medium cursor-pointer">
              Recurring Transaction
            </label>
            <p className="text-sm text-gray-500 font-medium">
              Set up a recurring schedule for this transaction
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Switch
              checked={isRecurringTxn}
              onCheckedChange={(checked) => setValue("isRecurringTxn", checked)}
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
          </div>
        </div>

        {/* Recurring Interval */}
        {isRecurringTxn && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Recurring Interval</label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              defaultValue={getValues("recurringInterval")}
            >
              <SelectTrigger className="w-full border border-gray-200 hover:border-gray-400 shadow-md data-[state=focused]:outline-none font-semibold">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent className="bg-gray-50 shadow-md rounded-md z-50 border border-gray-200">
                <SelectItem
                  value="DAILY"
                  className="hover:bg-gray-100 text-base"
                >
                  Daily
                </SelectItem>
                <SelectItem
                  value="WEEKLY"
                  className="hover:bg-gray-100 text-base"
                >
                  Weekly
                </SelectItem>
                <SelectItem
                  value="MONTHLY"
                  className="hover:bg-gray-100 text-base"
                >
                  Monthly
                </SelectItem>
                <SelectItem
                  value="YEARLY"
                  className="hover:bg-gray-100 text-base"
                >
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-sm text-red-500">
                {errors.recurringInterval.message}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-1/2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-1/2 bg-black text-white"
            disabled={transactionLoading}
          >
            {transactionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? "Updating..." : "Creating..."}
              </>
            ) : editMode ? (
              "Update Transaction"
            ) : (
              "Create Transaction"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;
