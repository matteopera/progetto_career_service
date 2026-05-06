import express from "express";
import { db } from "./db/db";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth";
const app = express();
const port = process.env.PORT;

// Per gestione routes autenticazione. -> splat altrimenti non va (express 5)
app.all("/api/auth/*splat", toNodeHandler(auth));

// Middleware express. Va sotto altrimenti intercetta anche quelle di better-auth prima
app.use(express.json());

// Elenco di origins permesse per chiamare  API
// TODO: in futuro da inserire nell'array url effettivo
const allowedOrigins = ["http://localhost:5173"];

// Gestione CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Test chiamata per ottenere sessione
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});



app.get("/api/test", async (req, res) => {
  res.send("Hello world via GET!");
  console.log("Response sent get");
  // Creo utente. Nota per Manuel: se tu ora provi a farlo col get, ti dirà utente già esistente. 
  await auth.api.signUpEmail({
    body: {
      email: "mario.rossi04@gmail.com",
      password: "12345678",
      name: "Mario",
    },
    headers: await fromNodeHeaders(req.headers)
  })

});

app.post("/api/test", (req, res) => {
  res.send("Hello world via POST!");
  console.log("Response sent POST");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});