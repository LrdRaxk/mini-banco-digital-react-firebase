import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Debes ingresar tu correo.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Debes ingresar tu contraseña.");
      return;
    }

    try {
      setIsLoading(true);

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErrorMessage("Correo o contraseña incorrectos.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleLoginSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Tu contraseña"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}

export default LoginForm;