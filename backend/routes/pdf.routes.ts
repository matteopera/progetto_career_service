import { Router } from "express";
import {
  downloadCompiledFormAsync,
  downloadCompiledFormsAsync,
  getPreviewPdfAsync,
} from "../controller/pdfController.js";

const router = Router();

router.get("/preview/:id", getPreviewPdfAsync);
router.post("/download-compiled-forms", downloadCompiledFormsAsync);
router.post("/download-compiled-form", downloadCompiledFormAsync);

export default router;
