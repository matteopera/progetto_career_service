import { Router } from "express";
import {
  downloadCompiledFormAsync,
  downloadCompiledFormsAsync,
} from "../controller/pdfController.js";
import { requireAdmin } from "../betterAuthMiddleware.js";

const router = Router();

// router.get("/preview/:id", getPreviewPdfAsync);
router.post(
  "/download-compiled-forms",
  requireAdmin,
  downloadCompiledFormsAsync,
);
router.post("/download-compiled-form", requireAdmin, downloadCompiledFormAsync);

export default router;
