import { Router } from "express";
import { getPreviewPdfAsync } from "../controller/pdfController.js";

const router = Router();

router.get("/preview/:id", getPreviewPdfAsync);
//router.get("/form", getForm);

export default router;
