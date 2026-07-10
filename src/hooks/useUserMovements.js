import { useEffect, useState } from "react";
import { subscribeToUserMovements } from "../services/accountService";

function useUserMovements(user) {
  const [movements, setMovements] = useState([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(true);
  const [movementsError, setMovementsError] = useState("");

  useEffect(() => {
    if (!user) {
      setMovements([]);
      setIsLoadingMovements(false);
      return;
    }

    setIsLoadingMovements(true);
    setMovementsError("");

    const unsubscribe = subscribeToUserMovements(
      user.uid,
      (newMovements) => {
        setMovements(newMovements);
        setIsLoadingMovements(false);
      },
      (error) => {
        console.error(error);
        setMovementsError("No se pudo cargar el historial.");
        setIsLoadingMovements(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return {
    movements,
    isLoadingMovements,
    movementsError,
  };
}

export default useUserMovements;