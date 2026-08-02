import { MongoClient, ServerApiVersion } from "mongodb";

// Stringa connessione database
const connString = process.env.MONGO_URL || "";

if (!connString)
  throw new Error(
    "MONGO_URL non è stato settato. Controllare variabili d'ambiente!",
  );

// Creazione client per mongoDB
export const mongoClient = new MongoClient(connString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Verifico connessione al client di mongoDB
let conn;
try {
  conn = await mongoClient.connect();
} catch (e) {
  console.error("Errore connessione database", conn);
  throw e;
}

// Connessione al client Ok, allora mi connetto al mio database
export const db = conn.db("career-service");
