import React, { useEffect, useState } from "react";
import GlobalStyle from "./index.js";
import Header from "./components/Header";
import Resume from "./components/Resume";
import Form from "./components/Form";
import Grid from "./components/Grid";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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
        // Se o usuário já existe, busca as transações
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
        // Se o usuário não existe, cria um mock user
        const mockUser = {
          firstName: "Usuário",
          lastName: "Exemplo",
          email: uuidv4() + "@exemplo.com",
          password: "senha123",
        };

        try {
          // Criação do usuário
          const response = await axios.post(`${apiUrl}/user`, mockUser);
          const newUserId = response.data.id; // Obtém o ID da resposta
          localStorage.setItem("userId", newUserId);

          // Agora busca as transações do novo usuário
          const transactionsResponse = await axios.get(
            `${apiUrl}/transactions?user_id=${newUserId}`
          );
          setTransactionsList(transactionsResponse.data);
        } catch (err) {
          setError("Erro ao criar ou buscar transações do usuário");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    const calculateTotals = () => {
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
    };

    calculateTotals();
  }, [transactionsList]);

  const handleAdd = async (transaction) => {
    try {
      const response = await axios.post(`${apiUrl}/transactions`, {
        ...transaction,
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
      <Grid itens={transactionsList} setItens={setTransactionsList} />
      <GlobalStyle />
    </>
  );
};

export default App;
