import { MongoClient, ServerApiVersion } from "mongodb";

// stringa connessione database
const connstring = process.env.MONGO_URL || "";

if (!connstring)
  throw new Error(
    "MONGO_URL non è stato settato. Controllare variabili d'ambiente!",
  );

// Creazione client per mongoDB
export const mongoClient = new MongoClient(connstring, {
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
  console.error("Errore connessione database", e);
  throw e;
}

// Connessione al client Ok, allora mi connetto al mio database
export const db = conn.db("career-service");
