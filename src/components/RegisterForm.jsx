import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateForm = () => {
    if (!name.trim()) {
      return "Debes ingresar tu nombre.";
    }

    if (!email.trim()) {
      return "Debes ingresar tu correo.";
    }

    if (!password.trim()) {
      return "Debes ingresar tu contraseña.";
    }

    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    return "";
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nombre: name.trim(),
        email: user.email,
        saldo: 100000,
        creadoEn: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Este correo ya está registrado.");
        return;
      }

      if (error.code === "auth/invalid-email") {
        setErrorMessage("El correo ingresado no es válido.");
        return;
      }

      if (error.code === "auth/weak-password") {
        setErrorMessage("La contraseña es demasiado débil.");
        return;
      }

      setErrorMessage("No se pudo crear la cuenta. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleRegisterSubmit}>
      <div className="form-group">
        <label htmlFor="register-name">Nombre</label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Tu nombre"
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Correo electrónico</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Contraseña</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}

export default RegisterForm;