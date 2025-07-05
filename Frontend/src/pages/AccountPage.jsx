import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/use-fetch'
import { getAccountWithTransactions } from '../actions/account'
import { Switch } from '../components/ui/switch'
import { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import TransactionTable from '../components/transaction-table'
import AccountChart from '../components/account-chart'

const AccountPage = () => {
    const {id} = useParams();
    const [account, setAccount] = useState();
    const [transactions, setTransactions] = useState([]);
    

    const fetchAccountWithTransactions = async () => {
      try {
        const data = await getAccountWithTransactions(id);
        setAccount(data);
        setTransactions(data.transactions);
      
        } catch (error) {
        console.error(error);
        throw error;
      }
  }

    useEffect( () => {
        fetchAccountWithTransactions();
    }, []);

    
   

  return (
    <div className="space-y-8 px-5">
        <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight gradient-title capitalize truncate max-w-[350px]">
            {account?.name}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {account?.type.charAt(0) + account?.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-medium">
            ₹{parseFloat(account?.balance).toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 font-medium">
            {transactions.length} Transactions
          </p>
        </div>  
      </div>

      {/* Card Section */}

      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions}/>
      </Suspense>

      {/* Transaction table */}

      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable 
          transactions={transactions} 
          onUpdate={ fetchAccountWithTransactions} 
          
        />
      </Suspense>
  
    </div>
  )
}

export default AccountPage