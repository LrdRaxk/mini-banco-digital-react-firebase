import { useState } from "react";
import { depositMoney, withdrawMoney } from "../services/accountService";

function BalanceActions({ user, account }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const validateAmount = () => {
    const parsedAmount = Number(amount);

    if (!amount.trim()) {
      return "Debes ingresar un monto.";
    }

    if (Number.isNaN(parsedAmount)) {
      return "El monto debe ser un número válido.";
    }

    if (parsedAmount <= 0) {
      return "El monto debe ser mayor a 0.";
    }

    return "";
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
  };

  const handleDepositClick = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateAmount();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsProcessing(true);

      await depositMoney({
        userUid: user.uid,
        userEmail: user.email,
        amount: Number(amount),
        description: description.trim(),
      });

      resetForm();
      setSuccessMessage("Depósito realizado correctamente.");
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo realizar el depósito.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawClick = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateAmount();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (Number(amount) > account.saldo) {
      setErrorMessage("No tienes saldo suficiente para retirar ese monto.");
      return;
    }

    try {
      setIsProcessing(true);

      await withdrawMoney({
        userUid: user.uid,
        userEmail: user.email,
        amount: Number(amount),
        description: description.trim(),
      });

      resetForm();
      setSuccessMessage("Retiro realizado correctamente.");
    } catch (error) {
      console.error(error);

      if (error.message === "INSUFFICIENT_FUNDS") {
        setErrorMessage("No tienes saldo suficiente.");
        return;
      }

      setErrorMessage("No se pudo realizar el retiro.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="balance-actions">
      <h2>Depósito / retiro simulado</h2>

      <div className="form-group">
        <label htmlFor="operation-amount">Monto</label>
        <input
          id="operation-amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Ej: 5000"
          min="1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="operation-description">Descripción</label>
        <input
          id="operation-description"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Ej: Ajuste de saldo"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="operation-buttons">
        <button type="button" onClick={handleDepositClick} disabled={isProcessing}>
          {isProcessing ? "Procesando..." : "Depositar"}
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={handleWithdrawClick}
          disabled={isProcessing}
        >
          {isProcessing ? "Procesando..." : "Retirar"}
        </button>
      </div>
    </section>
  );
}

export default BalanceActions;