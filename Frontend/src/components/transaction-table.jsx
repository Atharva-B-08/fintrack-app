import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "../data/categories";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, RefreshCw, Search, Trash, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MoreHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { handleBulkDelete } from "../actions/account";
import useFetch from "../hooks/use-fetch";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { BarLoader } from "react-spinners";
import { useNavigate   } from "react-router-dom";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({ transactions, onUpdate}) => {

    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field: "date",
        direction: "desc",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");

    const { data : deletedData,
      loading: deletedLoading,
      error: deletedError,
      fn: handleBulkDeleteFn 
    } = useFetch(handleBulkDelete);
  
    const handleBulkDeleteTransactions = async () =>{
      if (
        !window.confirm(
          `Are you sure you want to delete ${selectedIds.length} transactions?`
        )
      )
        return;
      
      await handleBulkDeleteFn(selectedIds);
      onUpdate && await  onUpdate();
      setSelectedIds([]);
    };

    useEffect(() => {
      if (deletedData && !deletedLoading) {
        toast.success("Transactions deleted successfully");
      }

    }, [deletedData, deletedLoading]);
    
  // filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];
    // search filter
    if(searchQuery){
        result = result.filter((transaction) => 
            transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }
    // type filter
    if(typeFilter){
        result = result.filter((transaction) => 
            transaction.type === typeFilter
        )
    }

    // recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.recurring;
        return !transaction.recurring;
      });
    }
    // sort
    result = result.sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.field] > b[sortConfig.field] ? 1 : -1;
      } else {
        return a[sortConfig.field] < b[sortConfig.field] ? 1 : -1;
      }
    });
    return result;
  }, [transactions, sortConfig, searchQuery, typeFilter, recurringFilter]);


  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field
          ? current.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedIds((current) => 
        current.length === transactions.length ? [] : transactions.map((transaction) => transaction.id)
    )
  }



  const handleClearFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  };

  

  return (
    <div className="space-y-4">

    
      {deletedLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}

      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 "/>
          <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="w-[120px] z-50 bg-white/75 backdrop-blur-sm rounded-md border border-gray-200 shadow-sm">
              <SelectItem value="INCOME" className=" hover:bg-gray-100">Income</SelectItem>
              <SelectItem value="EXPENSE" className=" hover:bg-gray-100">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className="w-[170px] z-50 bg-white/75 backdrop-blur-sm rounded-md border border-gray-200 shadow-sm ">
              <SelectItem value="recurring" className=" hover:bg-gray-100">Recurring Only</SelectItem>
              <SelectItem value="non-recurring" className=" hover:bg-gray-100">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className=" bg-red-600 hover:bg-red-700 hover:text-white "
                  onClick={handleBulkDeleteTransactions}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedIds.length})
                </Button>
              </div>
            )}

            {(searchQuery || typeFilter || recurringFilter) && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                title="Clear filters"
                className=" bg-black text-white "
              >
                <X className="h-4 w-5" />
              </Button>
          )}

        </div>
      </div>



      {/* Transaction Table */}
      <div className="rounded-md border border-gray-200  md:scroll-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="font-medium">
            <TableRow className="border-b border-gray-200 text-gray-500">
              <TableHead className="w-[50px] text-black">
                <Checkbox className="data-[state=checked]:bg-black data-[state=checked]:text-white font-bold" onCheckedChange={handleSelectAll} checked={selectedIds.length === paginatedTransactions.length  && paginatedTransactions.length > 0 } />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-neutral-600 font-medium"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions .map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="border-b border-gray-200 text-gray-800 font-medium    "
                >
                  <TableCell>
                    <Checkbox 
                    className="data-[state=checked]:bg-black data-[state=checked]:text-white font-bold"
                    onCheckedChange={()=> handleSelect(transaction.id)}
                    checked={selectedIds.includes(transaction.id)}
                    />
                    
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        backgroundColor: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transaction.type === "INCOME" ? "green" : "red",
                    }}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}₹
                    {transaction.amount?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.recurring ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                          >
                            <RefreshCw className="h-3 w-3" />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs font-medium bg-black text-white">
                          <div className="text-xs">
                            <div>Next Date:</div>
                            <div>
                              {format(
                                new Date(transaction.nextRecurringDate),
                                "PPP"
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 text-xs bg-black text-white"
                      >
                        <Clock className="w-4 h-4" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[100px] bg-white/80 border-1 border-gray-200 rounded-md shadow-md"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                              navigate(
                              `/transaction/create?edit=${transaction.id}`
                              )
                          }
                          className="cursor-pointer hover:bg-gray-200 hover:text-gray-800 font-medium"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 font-medium"
                          onClick={async () =>  {
                             await handleBulkDeleteFn([transaction.id]);
                            onUpdate && await onUpdate();
                            setSelectedIds([]);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-16">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="hover:bg-black hover:text-white cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="hover:bg-black hover:text-white cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 " />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
