import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import useUserAccount from "../hooks/useUserAccount";
import useUserMovements from "../hooks/useUserMovements";
import TransferForm from "./TransferForm";
import MovementList from "./MovementList";

function Dashboard({ user }) {
  const { account, isLoadingAccount, accountError } = useUserAccount(user);
  const { movements, isLoadingMovements, movementsError } = useUserMovements(user);

  const handleLogoutClick = async () => {
    await signOut(auth);
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
        <div>
          <h1>Banco React</h1>
          <p>Bienvenido al panel bancario.</p>
        </div>

        <button type="button" className="secondary" onClick={handleLogoutClick}>
          Cerrar sesión
        </button>
      </header>

      {isLoadingAccount && (
        <div className="balance-box">
          <span>Cargando cuenta...</span>
        </div>
      )}

      {accountError && <p className="error-message">{accountError}</p>}

      {!isLoadingAccount && !accountError && account && (
        <>
          <div className="balance-box">
            <span>Saldo disponible</span>
            <strong>{formatMoney(account.saldo)}</strong>
            <small>{account.nombre}</small>
            <small>{account.email}</small>
          </div>

          <TransferForm user={user} account={account} />
            <MovementList
            user={user}
            movements={movements}
            isLoading={isLoadingMovements}
            error={movementsError}
          />
        </>
      )}

      {!isLoadingAccount && !accountError && !account && (
        <p className="helper-text">No hay datos de cuenta para mostrar.</p>
      )}
    </section>
  );
}

export default Dashboard;