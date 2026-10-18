// Collez ici la configuration WEB de votre projet Firebase (console Firebase > Paramètres > Vos applications).
// Les clés de configuration Firebase web ne sont pas des mots de passe.
export const firebaseConfig = {
  apiKey: "REMPLACER_API_KEY",
  authDomain: "REMPLACER.firebaseapp.com",
  projectId: "REMPLACER_PROJECT_ID",
  storageBucket: "REMPLACER.firebasestorage.app",
  messagingSenderId: "REMPLACER_SENDER_ID",
  appId: "REMPLACER_APP_ID"
};
// Numéro WhatsApp de la boutique, format international sans +, par exemple 22507XXXXXXXX.
export const NUMERO_WHATSAPP = "";
export const isConfigured = () => !firebaseConfig.apiKey.startsWith("REMPLACER") && !firebaseConfig.projectId.startsWith("REMPLACER");
