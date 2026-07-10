import { useState } from "react";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import useAuth from "./hooks/useAuth";
import "./App.css";

function App() {
  const [authMode, setAuthMode] = useState("login");
  const { user, isCheckingAuth } = useAuth();

  const handleShowLogin = () => {
    setAuthMode("login");
  };

  const handleShowRegister = () => {
    setAuthMode("register");
  };

  if (isCheckingAuth) {
    return (
      <main className="app">
        <section className="card">
          <p className="helper-text">Verificando sesión...</p>
        </section>
      </main>
    );
  }

  if (user) {
    return (
      <main className="app">
        <Dashboard user={user} />
      </main>
    );
  }

  return (
    <main className="app">
      <section className="card">
        <h1>Banco React</h1>
        <p>Sistema básico de login bancario con React y Firebase.</p>

        <div className="tabs">
          <button
            type="button"
            className={authMode === "login" ? "active" : "secondary"}
            onClick={handleShowLogin}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            className={authMode === "register" ? "active" : "secondary"}
            onClick={handleShowRegister}
          >
            Crear cuenta
          </button>
        </div>

        {authMode === "login" ? <LoginForm /> : <RegisterForm />}
      </section>
    </main>
  );
}

export default App;