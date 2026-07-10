import { createContext, useContext, useEffect, useReducer } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext(null);

const initialAuthState = {
  user: null,
  isCheckingAuth: true,
  authError: "",
};

function authReducer(state, action) {
  if (action.type === "AUTH_SUCCESS") {
    return {
      ...state,
      user: action.payload,
      isCheckingAuth: false,
      authError: "",
    };
  }

  if (action.type === "AUTH_ERROR") {
    return {
      ...state,
      user: null,
      isCheckingAuth: false,
      authError: "No se pudo verificar la sesión.",
    };
  }

  if (action.type === "AUTH_LOGOUT") {
    return {
      ...state,
      user: null,
      isCheckingAuth: false,
      authError: "",
    };
  }

  return state;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          dispatch({
            type: "AUTH_SUCCESS",
            payload: currentUser,
          });
          return;
        }

        dispatch({
          type: "AUTH_LOGOUT",
        });
      },
      (error) => {
        console.error("Error verificando sesión:", error);

        dispatch({
          type: "AUTH_ERROR",
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider.");
  }

  return context;
}