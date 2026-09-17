import express from "express";
import { db } from "./db/db.js";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";
import aziendeRouter from "./routes/azienda.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
import formRouter from "./routes/form.routes.js";
import excelRouter from "./routes/excel.routes.js";
const app = express();
const port = process.env.PORT;

// Elenco di origins permesse per chiamare  API
// TODO: in futuro da inserire nell'array url effettivo
const allowedOrigins = ["http://localhost:5173"];

// Gestione CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Per gestione routes autenticazione. -> splat altrimenti non va (express 5)
app.all("/api/auth/*splat", toNodeHandler(auth));

// Middleware express. Va sotto altrimenti intercetta anche quelle di better-auth prima
app.use(express.json());

app.use("/api/form", formRouter);

app.use("/api/aziende", aziendeRouter);

app.use("/api/pdf", pdfRouter);

app.use("/api/excel", excelRouter);

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
