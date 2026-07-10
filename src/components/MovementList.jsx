function MovementList({ user, movements, isLoading, error }) {
  const formatMoney = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) {
      return "Fecha pendiente";
    }

    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(timestamp.toDate());
  };

  if (isLoading) {
    return (
      <section className="movement-section">
        <h2>Historial de movimientos</h2>
        <p className="helper-text">Cargando movimientos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="movement-section">
        <h2>Historial de movimientos</h2>
        <p className="error-message">{error}</p>
      </section>
    );
  }

  if (movements.length === 0) {
    return (
      <section className="movement-section">
        <h2>Historial de movimientos</h2>
        <p className="helper-text">Todavía no tienes movimientos registrados.</p>
      </section>
    );
  }

  return (
    <section className="movement-section">
      <h2>Historial de movimientos</h2>

      <ul className="movement-list">
        {movements.map((movement) => {
          const isSent = movement.emisorUid === user.uid;
          const otherUserEmail = isSent
            ? movement.receptorEmail
            : movement.emisorEmail;

          return (
            <li key={movement.id} className="movement-item">
              <div>
                <strong>{isSent ? "Transferencia enviada" : "Transferencia recibida"}</strong>
                <p>
                  {isSent ? "Para" : "De"}: {otherUserEmail}
                </p>
                <small>{movement.descripcion}</small>
                <small>{formatDate(movement.fecha)}</small>
              </div>

              <span className={isSent ? "amount-negative" : "amount-positive"}>
                {isSent ? "-" : "+"}
                {formatMoney(movement.monto)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default MovementList;