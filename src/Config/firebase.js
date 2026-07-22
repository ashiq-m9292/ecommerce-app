import { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://bantishop-4075a-default-rtdb.asia-southeast1.firebasedatabase.app",
});

export default app;