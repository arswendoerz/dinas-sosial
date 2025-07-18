import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
export default db;
