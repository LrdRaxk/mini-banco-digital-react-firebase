import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

function useUserAccount(user) {
  const [account, setAccount] = useState(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [accountError, setAccountError] = useState("");

  useEffect(() => {
    if (!user) {
      setAccount(null);
      setIsLoadingAccount(false);
      return;
    }

    setIsLoadingAccount(true);
    setAccountError("");

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setAccount(null);
          setAccountError("No se encontró la cuenta del usuario.");
          setIsLoadingAccount(false);
          return;
        }

        setAccount({
          id: snapshot.id,
          ...snapshot.data(),
        });

        setIsLoadingAccount(false);
      },
      (error) => {
        console.error(error);
        setAccountError("No se pudo cargar la cuenta.");
        setIsLoadingAccount(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return {
    account,
    isLoadingAccount,
    accountError,
  };
}

export default useUserAccount;