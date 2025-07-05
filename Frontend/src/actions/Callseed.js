import { generateTransactions } from "./seed";

const sendToBackend = async () => {
  const userId = 12;
  const accountId = 6;

  const { transactions, balance } = generateTransactions(userId, accountId);

  const response = await fetch("http://localhost:8080/api/seed", {
    method: "POST",
    // credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, accountId, transactions, balance }),
  });

  let result;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    result = await response.json();
  } else {
    result = { success: response.ok };
  }

  console.log("Result:", result);
};

export default sendToBackend;

