import { useState } from "react";
import { transferMoney } from "../services/accountService";

function TransferForm({ user, account }) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [isTransferring, setIsTransferring] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleReceiverEmailChange = (event) => {
    setReceiverEmail(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const validateTransfer = () => {
    const parsedAmount = Number(amount);

    if (!receiverEmail.trim()) {
      return "Debes ingresar el correo del receptor.";
    }

    if (receiverEmail.trim().toLowerCase() === user.email.toLowerCase()) {
      return "No puedes transferirte dinero a ti mismo.";
    }

    if (!amount.trim()) {
      return "Debes ingresar un monto.";
    }

    if (Number.isNaN(parsedAmount)) {
      return "El monto debe ser un número válido.";
    }

    if (parsedAmount <= 0) {
      return "El monto debe ser mayor a 0.";
    }

    if (parsedAmount > account.saldo) {
      return "No tienes saldo suficiente para esta transferencia.";
    }

    return "";
  };

  const handleTransferSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateTransfer();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsTransferring(true);

      await transferMoney({
        senderUid: user.uid,
        senderEmail: user.email,
        receiverEmail: receiverEmail.trim().toLowerCase(),
        amount: Number(amount),
        description: description.trim(),
      });

      setReceiverEmail("");
      setAmount("");
      setDescription("");
      setSuccessMessage("Transferencia realizada correctamente.");
    } catch (error) {
      console.error(error);

      if (error.message === "RECEIVER_NOT_FOUND") {
        setErrorMessage("No existe un usuario registrado con ese correo.");
        return;
      }

      if (error.message === "SAME_USER") {
        setErrorMessage("No puedes transferirte dinero a ti mismo.");
        return;
      }

      if (error.message === "INSUFFICIENT_FUNDS") {
        setErrorMessage("No tienes saldo suficiente.");
        return;
      }

      setErrorMessage("No se pudo realizar la transferencia.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <form className="form transfer-form" onSubmit={handleTransferSubmit}>
      <h2>Realizar transferencia</h2>

      <div className="form-group">
        <label htmlFor="receiver-email">Correo del receptor</label>
        <input
          id="receiver-email"
          type="email"
          value={receiverEmail}
          onChange={handleReceiverEmailChange}
          placeholder="receptor@correo.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="transfer-amount">Monto</label>
        <input
          id="transfer-amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Ej: 10000"
          min="1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="transfer-description">Descripción</label>
        <input
          id="transfer-description"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Ej: Pago de almuerzo"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <button type="submit" disabled={isTransferring}>
        {isTransferring ? "Transfiriendo..." : "Transferir"}
      </button>
    </form>
  );
}

export default TransferForm;