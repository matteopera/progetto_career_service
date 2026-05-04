import express from "express";
const cors = require("cors");

const app = express();
const port = process.env.PORT;

// Elenco di origins permesse per chiamare  API
// TODO: in futuro da inserire nell'array url effettivo
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.get("/api/test", (req, res) => {
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