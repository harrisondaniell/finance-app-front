import React, { useEffect, useState } from "react";
import GlobalStyle from "./index.js";
import Header from "./components/Header";
import Resume from "./components/Resume";
import Form from "./components/Form";
import axios from "axios";

const App = () => {
  const apiUrl = "https://finance-app-i5ug.onrender.com";
  const [transactionsList, setTransactionsList] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      if (userId) {
        try {
          const response = await axios.get(
            `${apiUrl}/transactions?user_id=${userId}`
          );
          setTransactionsList(response.data);
        } catch (err) {
          setError("Erro ao buscar transações");
        } finally {
          setLoading(false);
        }
      } else {
        const mockUser = {
          firstName: "Usuário",
          lastName: "Exemplo",
          email: "usuario999@exemplo.com",
          password: "senha123",
        };

        try {
          const response = await axios.post(`${apiUrl}/user`, mockUser);
          localStorage.setItem("userId", response.data.id);
        } catch (err) {
          setError("Erro ao criar usuário");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    const amountExpense = transactionsList
      .filter((item) => item.type === "EXPENSE")
      .map((transaction) => Number(transaction.amount));

    const amountIncome = transactionsList
      .filter((item) => item.type === "EARNING")
      .map((transaction) => Number(transaction.amount));

    const totalExpense = amountExpense
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2);
    const totalIncome = amountIncome
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2);

    const total = Math.abs(totalIncome - totalExpense).toFixed(2);

    setIncome(`R$ ${totalIncome}`);
    setExpense(`R$ ${totalExpense}`);
    setTotal(
      `${Number(totalIncome) < Number(totalExpense) ? "-" : ""}R$ ${total}`
    );
  }, [transactionsList]);

  const handleAdd = async (transaction) => {
    try {
      console.log(transaction);
      const response = await axios.post(`${apiUrl}/transactions`, {
        ...transaction,
        id: transactionsList.length + "",
        user_id: userId,
      });
      setTransactionsList([...transactionsList, response.data]);
    } catch (err) {
      setError("Erro ao adicionar transação");
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      await axios.delete(`${apiUrl}/transactions/${transactionId}`);
      setTransactionsList(
        transactionsList.filter(
          (transaction) => transaction.id !== transactionId
        )
      );
    } catch (err) {
      setError("Erro ao deletar transação");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <Resume income={income} expense={expense} total={total} />
      <Form handleAdd={handleAdd} />
      <ul>
        {transactionsList.map((transaction) => (
          <li key={transaction.id}>
            {transaction.name} - R$ {transaction.amount} - {transaction.date}
            <button onClick={() => handleDelete(transaction.id)}>
              Deletar
            </button>
          </li>
        ))}
      </ul>
      <GlobalStyle />
    </>
  );
};

export default App;
