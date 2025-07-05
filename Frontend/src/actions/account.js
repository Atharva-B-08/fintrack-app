export const updateDefaultAccount = async (accountId) => {
    
    try {
        const response = await fetch(`http://localhost:8080/api/accounts/set-default/${accountId}`,
            {
                method: "PUT",
                credentials: "include"
            }
        )

        if(!response.ok){
            throw new Error("Failed to update default account");
        }

        return await response.json();
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export const getAccountWithTransactions = async (accountId) =>{

    try {
        const response = await fetch(`http://localhost:8080/api/accounts/${accountId}/transactions`, {
            method: "GET",
            credentials: "include"
        })

        if(!response.ok){
            throw new Error("Failed to fetch account with transactions");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }

}


export const handleBulkDelete = async (transactionIds) => {
    console.log(JSON.stringify({transactionIds}));
    try {
        const response = await fetch("http://localhost:8080/api/transactions/delete", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({transactionIds}),
        });

        if(!response.ok){
            throw new Error("Failed to delete transactions");
        }

        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}