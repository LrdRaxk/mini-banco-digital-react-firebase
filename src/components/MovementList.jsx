import { useState } from "react";

function MovementList({ user, movements, isLoading, error }) {
  const [filterType, setFilterType] = useState("todos");
  const [searchText, setSearchText] = useState("");

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

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

  const getMovementType = (movement) => {
    if (movement.tipoOperacion === "deposito") {
      return "deposito";
    }

    if (movement.tipoOperacion === "retiro") {
      return "retiro";
    }

    if (movement.emisorUid === user.uid) {
      return "enviada";
    }

    return "recibida";
  };

  const getMovementTitle = (movement) => {
    const type = getMovementType(movement);

    if (type === "deposito") {
      return "Depósito simulado";
    }

    if (type === "retiro") {
      return "Retiro simulado";
    }

    if (type === "enviada") {
      return "Transferencia enviada";
    }

    return "Transferencia recibida";
  };

  const getOtherUserText = (movement) => {
    const type = getMovementType(movement);

    if (type === "deposito") {
      return "Ingreso a tu cuenta";
    }

    if (type === "retiro") {
      return "Retiro desde tu cuenta";
    }

    if (type === "enviada") {
      return `Para: ${movement.receptorEmail}`;
    }

    return `De: ${movement.emisorEmail}`;
  };

  const getAmountPrefix = (movement) => {
    const type = getMovementType(movement);

    if (type === "enviada" || type === "retiro") {
      return "-";
    }

    return "+";
  };

  const getAmountClassName = (movement) => {
    const type = getMovementType(movement);

    if (type === "enviada" || type === "retiro") {
      return "amount-negative";
    }

    return "amount-positive";
  };

  const filteredMovements = movements.filter((movement) => {
    const type = getMovementType(movement);
    const textToSearch = [
      movement.emisorEmail,
      movement.receptorEmail,
      movement.descripcion,
      type,
    ]
      .join(" ")
      .toLowerCase();

    const matchesType = filterType === "todos" || filterType === type;
    const matchesSearch = textToSearch.includes(searchText.toLowerCase().trim());

    return matchesType && matchesSearch;
  });

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

  return (
    <section className="movement-section">
      <h2>Historial de movimientos</h2>

      <div className="movement-filters">
        <div className="form-group">
          <label htmlFor="movement-filter">Filtrar por tipo</label>
          <select
            id="movement-filter"
            value={filterType}
            onChange={handleFilterTypeChange}
          >
            <option value="todos">Todos</option>
            <option value="enviada">Enviadas</option>
            <option value="recibida">Recibidas</option>
            <option value="deposito">Depósitos</option>
            <option value="retiro">Retiros</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="movement-search">Buscar</label>
          <input
            id="movement-search"
            type="text"
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Correo, descripción o tipo"
          />
        </div>
      </div>

      {movements.length === 0 && (
        <p className="helper-text">Todavía no tienes movimientos registrados.</p>
      )}

      {movements.length > 0 && filteredMovements.length === 0 && (
        <p className="helper-text">
          No hay movimientos que coincidan con el filtro.
        </p>
      )}

      {filteredMovements.length > 0 && (
        <ul className="movement-list">
          {filteredMovements.map((movement) => (
            <li key={movement.id} className="movement-item">
              <div>
                <strong>{getMovementTitle(movement)}</strong>
                <p>{getOtherUserText(movement)}</p>
                <small>{movement.descripcion}</small>
                <small>{formatDate(movement.fecha)}</small>
              </div>

              <span className={getAmountClassName(movement)}>
                {getAmountPrefix(movement)}
                {formatMoney(movement.monto)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default MovementList;