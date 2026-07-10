# Mini Banco Digital - React + Firebase <3

Aplicación SPA desarrollada con React y Firebase que simula un sistema bancario básico. 

Esta mini app permite registro, inicio de sesión, visualización de saldo en tiempo real, transferencias entre usuarios, historial de movimientos y cierre de sesión.

## Stack utilizado:

- React 18+
- Vite
- Firebase Authentication
- Cloud Firestore
- CSS puro 100%

## Funcionalidades principales

- Registro de usuarios con correo y contraseña
- Inicio y cierre de sesión
- Dashboard protegido, accesible solo para usuarios logueados de manera correcta
- Saldo del usuario sincronizado en tiempo real con Firestore
- Transferencias entre usuarios registrados mediante correo electrónico
- Historial de movimientos enviados y recibidos
- Estados de carga, error y datos vacíos
- Formularios controlados con validaciones antes de ejecutar acciones

## Modelo de datos

### Coleccion `users`

```js
users/{uid} = {
  nombre: string,
  email: string,
  saldo: number,
  creadoEn: timestamp
}

## Coleccion movimientos

movimientos/{id} = {
  emisorUid: string,
  emisorEmail: string,
  receptorUid: string,
  receptorEmail: string,
  monto: number,
  descripcion: string,
  fecha: timestamp
} 

```

### Reactividad: 

La aplicación usa onSnapshot para mantener sincronizados los datos de Firestore con la interfaz

El saldo se actualiza automáticamente cuando cambia el documento del usuario en users/{uid}

El historial de movimientos también se actualiza en tiempo real escuchando los movimientos donde el usuario sea emisor o receptor

Todas las suscripciones creadas en useEffect retornan su función de limpieza mediante "unsubscribe"

### Configuraciones del Proyecto:

- Instalar dependencias como: npm install

- Crear un archivo .env en la raíz del proyecto con las siguientes variables:
    VITE_FIREBASE_API_KEY=
    VITE_FIREBASE_AUTH_DOMAIN=
    VITE_FIREBASE_PROJECT_ID=
    VITE_FIREBASE_STORAGE_BUCKET=
    VITE_FIREBASE_MESSAGING_SENDER_ID=
    VITE_FIREBASE_APP_ID=

También se incluye un archivo .env.example con la estructura esperada

Ejecuta en el local: npm run dev
luego abrir: http://localhost:5173

## Usuarios de prueba:

Usuario 1:

Correo: prueba1@gmail.com
Contraseña: 123456

Usuario 2:

Correo: prueba2@gmail.com
Contraseña: 123456


## Reglas aplicadas en el Firestore:

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow create: if isOwner(userId);

      allow read: if isAuthenticated();

      allow update: if isAuthenticated();

      allow delete: if false;
    }

    match /movimientos/{movementId} {
      allow create: if isAuthenticated()
        && request.resource.data.emisorUid == request.auth.uid
        && request.resource.data.receptorUid is string
        && request.resource.data.monto is number
        && request.resource.data.monto > 0
        && request.resource.data.descripcion is string;

      allow read: if isAuthenticated()
        && (
          resource.data.emisorUid == request.auth.uid ||
          resource.data.receptorUid == request.auth.uid
        );

      allow update, delete: if false;
    }
  }
}


### Nota de seguridad (por si acaso)

Este proyecto fue desarrollado con fines academicos (una prueba de evaluacion)
La lógica de transferencia se ejecuta desde el cliente usando transacciones de Firestore

En una aplicación bancaria real, esta lógica debería ejecutarse desde un backend seguro o mediante Cloud Functions o similares, para evitar que el cliente tenga control directo sobre la actualización de saldos 

## Estructura del Proyecto:

src/
  assests/

  components/
    Dashboard.jsx
    LoginForm.jsx
    MovementList.jsx
    RegisterForm.jsx
    TransferForm.jsx
    
  hooks/
    useAuth.js
    useUserAccount.js
    useUserMovements.js

  services/
    accountService.js
    firebase.js

  App.jsx
  App.css
  main.jsx

## Uso de IA

Durante el desarrollo de este proyecto utilicé asistencia de IA como apoyo para orientar la estructura general de la aplicación, resolver dudas puntuales de React y Firebase, y revisar buenas prácticas relacionadas con manejo de eventos, programación reactiva y organización de componentes

La IA fue usada como herramienta de aprendizaje y guía, pero el código fue revisado, probado y adaptado manualmente durante el desarrollo. Se realizaron pruebas locales para validar el registro, inicio de sesión, saldo en tiempo real, transferencias, historial de movimientos y cierre de sesión

También se utilizó IA para apoyar la redacción del README y para identificar errores durante la implementación, como imports faltantes, estados no definidos y suscripciones en tiempo real