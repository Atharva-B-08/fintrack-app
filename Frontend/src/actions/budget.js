export const getCurrentBudget = async(accountId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/budget/current?accountId=${accountId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch current budget");
          }
    
        // Parse and return JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const updateBudget = async ({amount}) => {
    try {
        const response = await fetch(`http://localhost:8080/api/budget/update`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount,
            })
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update budget");
          }
    
        // Parse and return JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


