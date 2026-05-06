import express from "express";
import { MongoClient, ServerApiVersion } from 'mongodb';
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const uri=`mongodb+srv://career-service:${process.env.MONGO_PASSWORD}@clustercareerservice.fqehjf0.mongodb.net/?appName=ClusterCareerService`


//creazione client per mongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


//connessione di prova mongoDB
export async function runStableAPIConnect() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const result = await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    return result;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



// Elenco di origins permesse per chiamare  API
// TODO: in futuro da inserire nell'array url effettivo
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.get("/api/test", (req, res) => {
    runStableAPIConnect().catch(console.dir);
    res.send("Hello world via GET!");
    console.log("Response sent get");
});

app.post("/api/test", (req, res) => {
    res.send("Hello world via POST!");
    console.log("Response sent POST");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});