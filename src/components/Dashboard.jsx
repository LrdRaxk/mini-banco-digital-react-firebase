import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import useUserAccount from "../hooks/useUserAccount";
import useUserMovements from "../hooks/useUserMovements";
import TransferForm from "./TransferForm";
import MovementList from "./MovementList";
import BalanceActions from "./BalanceActions";

function Dashboard({ user, theme, onToggleTheme }) {
  const { account, isLoadingAccount, accountError } = useUserAccount(user);
  const { movements, isLoadingMovements, movementsError } = useUserMovements(user);

  const handleLogoutClick = async () => {
    await signOut(auth);
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  };

  return (
    <section className="dashboard-card">
      <header className="dashboard-header">
        <div className="dashboard-title-area">
          <span className="bank-label">Mini Banco Digital</span>
          <h1>Banco React</h1>
          <p>Bienvenido al panel bancario.</p>
        </div>

        <div className="dashboard-actions">
          <button type="button" className="secondary logout-button" onClick={handleLogoutClick}>
            Cerrar sesión
          </button>

          <button type="button" className="theme-toggle" onClick={onToggleTheme}>
            {theme === "light" ? "Modo oscuro" : "Modo claro"}
          </button>
        </div>
      </header>

      {isLoadingAccount && (
        <div className="balance-box">
          <span>Cargando cuenta...</span>
        </div>
      )}

      {accountError && <p className="error-message">{accountError}</p>}

      {!isLoadingAccount && !accountError && account && (
        <>
          <nav className="quick-actions">
            <button type="button" onClick={() => handleScrollToSection("saldo")}>
              Saldo
            </button>

            <button type="button" onClick={() => handleScrollToSection("deposito-retiro")}>
              Depósito / Retiro
            </button>

            <button type="button" onClick={() => handleScrollToSection("transferencia")}>
              Transferencia
            </button>

            <button type="button" onClick={() => handleScrollToSection("historial")}>
              Historial
            </button>
          </nav>

          <section id="saldo" className="dashboard-section">
            <div className="balance-box">
              <span>Saldo disponible</span>
              <strong>{formatMoney(account.saldo)}</strong>

              <div className="account-details">
                <div>
                  <small>Nombre</small>
                  <p>{account.nombre}</p>
                </div>

                <div>
                  <small>Correo</small>
                  <p>{account.email}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="deposito-retiro" className="dashboard-section">
            <BalanceActions user={user} account={account} />
          </section>

          <section id="transferencia" className="dashboard-section">
            <TransferForm user={user} account={account} />
          </section>

          <section id="historial" className="dashboard-section">
            <MovementList
              user={user}
              movements={movements}
              isLoading={isLoadingMovements}
              error={movementsError}
            />
          </section>
        </>
      )}

      {!isLoadingAccount && !accountError && !account && (
        <p className="helper-text">No hay datos de cuenta para mostrar.</p>
      )}
    </section>
  );
}

export default Dashboard;