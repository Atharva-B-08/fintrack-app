const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

export const createAccount = async (accountData) => {
  const response = await fetch(`${backendUrl}/api/accounts/create-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(accountData),
  });

  if (!response.ok) {
    throw new Error("Failed to create account");
  }

  return await response.json();
};

export const getAccounts = async () => {
  const response = await fetch(`${backendUrl}/api/accounts/user-accounts`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return await response.json();
};

export const getUserTransactions = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/transactions/allUserTxn`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
