import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

function useAuth() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsCheckingAuth(false);
      },
      (error) => {
        console.error("Error verificando sesión:", error);
        setUser(null);
        setIsCheckingAuth(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    isCheckingAuth,
  };
}

export default useAuth;