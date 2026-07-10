import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useAuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  const [authMode, setAuthMode] = useState("login");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const { user, isCheckingAuth, authError } = useAuthContext();

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleShowLogin = () => {
    setAuthMode("login");
  };

  const handleShowRegister = () => {
    setAuthMode("register");
  };

  const handleToggleTheme = () => {
    setTheme((currentTheme) => {
      return currentTheme === "light" ? "dark" : "light";
    });
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

  if (authError) {
    return (
      <main className="app">
        <section className="card">
          <p className="error-message">{authError}</p>
        </section>
      </main>
    );
  }

  if (user) {
    return (
      <main className="app">
        <Dashboard
          user={user}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </main>
    );
  }

  return (
    <main className="app">
      <section className="card">
        <h1>Banco React</h1>
        <p>Sistema básico de login bancario con React y Firebase.</p>

        <button
          type="button"
          className="theme-toggle login-theme-toggle"
          onClick={handleToggleTheme}
        >
          {theme === "light" ? "Modo oscuro" : "Modo claro"}
        </button>

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