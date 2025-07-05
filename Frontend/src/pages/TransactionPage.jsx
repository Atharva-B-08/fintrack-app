import React, { useEffect, useState } from "react";
import { getAccounts } from "../actions/dashboard";
import { defaultCategories } from "../data/categories";
import AddTransactionForm from "../components/add-transaction-form";
import { useSearchParams } from "react-router-dom";
import { getTransaction } from "../actions/transaction";
import { Loader2 } from "lucide-react";

const AddTransaction = () => {
  const [searchParams] = useSearchParams();
  const txnId = searchParams.get("edit");

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  // this will fetch the transaction data if edit is present in the url
  useEffect(() => {
    if (!txnId) return;
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const data = await getTransaction(txnId);
        setInitialData(data);
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, []);

  useEffect(() => {
    const accounts = async () => {
      try {
        setLoading(true);
        const data = await getAccounts();
        setAccounts(data);
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    accounts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5">
      {loading ? (
        <Loader2 className="mt-4" width={"100%"} color="#9333ea" />
      ) : (
        <>
          <h3 className="text-5xl font-bold tracking-tight from-blue-600 to-purple-600 bg-gradient-to-b text-transparent bg-clip-text mb-8">
            {txnId ? "Edit" : "Add"} Transaction
          </h3>
          <AddTransactionForm
            accounts={accounts}
            categories={defaultCategories || []}
            initialData={initialData}
            editMode={!!txnId}
          />
        </>
      )}
    </div>
  );
};

export default AddTransaction;
