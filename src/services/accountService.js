import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export async function transferMoney({
  senderUid,
  senderEmail,
  receiverEmail,
  amount,
  description,
}) {
  const usersRef = collection(db, "users");

  const receiverQuery = query(usersRef, where("email", "==", receiverEmail));
  const receiverSnapshot = await getDocs(receiverQuery);

  if (receiverSnapshot.empty) {
    throw new Error("RECEIVER_NOT_FOUND");
  }

  const receiverDoc = receiverSnapshot.docs[0];
  const receiverUid = receiverDoc.id;

  if (receiverUid === senderUid) {
    throw new Error("SAME_USER");
  }

  const senderRef = doc(db, "users", senderUid);
  const receiverRef = doc(db, "users", receiverUid);
  const movementRef = doc(collection(db, "movimientos"));

  await runTransaction(db, async (transaction) => {
    const senderSnapshot = await transaction.get(senderRef);

    if (!senderSnapshot.exists()) {
      throw new Error("SENDER_NOT_FOUND");
    }

    const senderData = senderSnapshot.data();
    const currentBalance = Number(senderData.saldo || 0);

    if (currentBalance < amount) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    transaction.update(senderRef, {
      saldo: increment(-amount),
    });

    transaction.update(receiverRef, {
      saldo: increment(amount),
    });

    transaction.set(movementRef, {
      emisorUid: senderUid,
      emisorEmail: senderEmail,
      receptorUid: receiverUid,
      receptorEmail: receiverEmail,
      monto: amount,
      descripcion: description || "Transferencia bancaria",
      fecha: serverTimestamp(),
    });
  });
}

export async function depositMoney({ userUid, userEmail, amount, description }) {
  const userRef = doc(db, "users", userUid);
  const movementRef = doc(collection(db, "movimientos"));

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);

    if (!userSnapshot.exists()) {
      throw new Error("USER_NOT_FOUND");
    }

    transaction.update(userRef, {
      saldo: increment(amount),
    });

    transaction.set(movementRef, {
      emisorUid: userUid,
      emisorEmail: userEmail,
      receptorUid: userUid,
      receptorEmail: userEmail,
      tipoOperacion: "deposito",
      monto: amount,
      descripcion: description || "Depósito simulado",
      fecha: serverTimestamp(),
    });
  });
}

export async function withdrawMoney({ userUid, userEmail, amount, description }) {
  const userRef = doc(db, "users", userUid);
  const movementRef = doc(collection(db, "movimientos"));

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);

    if (!userSnapshot.exists()) {
      throw new Error("USER_NOT_FOUND");
    }

    const userData = userSnapshot.data();
    const currentBalance = Number(userData.saldo || 0);

    if (currentBalance < amount) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    transaction.update(userRef, {
      saldo: increment(-amount),
    });

    transaction.set(movementRef, {
      emisorUid: userUid,
      emisorEmail: userEmail,
      receptorUid: userUid,
      receptorEmail: userEmail,
      tipoOperacion: "retiro",
      monto: amount,
      descripcion: description || "Retiro simulado",
      fecha: serverTimestamp(),
    });
  });
}

export function subscribeToUserMovements(userUid, handleData, handleError) {
  const movementsRef = collection(db, "movimientos");

  const sentQuery = query(movementsRef, where("emisorUid", "==", userUid));
  const receivedQuery = query(movementsRef, where("receptorUid", "==", userUid));

  let sentMovements = [];
  let receivedMovements = [];

  const notifyChanges = () => {
    const allMovements = [...sentMovements, ...receivedMovements];

    allMovements.sort((a, b) => {
      const dateA = a.fecha?.toMillis ? a.fecha.toMillis() : 0;
      const dateB = b.fecha?.toMillis ? b.fecha.toMillis() : 0;

      return dateB - dateA;
    });

    handleData(allMovements);
  };

  const unsubscribeSent = onSnapshot(
    sentQuery,
    (snapshot) => {
      sentMovements = snapshot.docs.map((document) => ({
        id: document.id,
        tipo: "enviada",
        ...document.data(),
      }));

      notifyChanges();
    },
    (error) => {
      handleError(error);
    }
  );

  const unsubscribeReceived = onSnapshot(
    receivedQuery,
    (snapshot) => {
      receivedMovements = snapshot.docs.map((document) => ({
        id: document.id,
        tipo: "recibida",
        ...document.data(),
      }));

      notifyChanges();
    },
    (error) => {
      handleError(error);
    }
  );

  return () => {
    unsubscribeSent();
    unsubscribeReceived();
  };
}