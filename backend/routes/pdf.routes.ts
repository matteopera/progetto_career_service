import { Router } from "express";
import {
  downloadCompiledFormsAsync,
  getPreviewPdfAsync,
} from "../controller/pdfController.js";

const router = Router();

router.get("/preview/:id", getPreviewPdfAsync);
router.post("/download-compiled-forms", downloadCompiledFormsAsync);

export default router;
