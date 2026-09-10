import express from "express"
import { Router } from "express";
import { getOnlineForm, uploadForm } from "../controller/company/formController.js";
import { getFaq } from "../controller/company/faqController.js";
import getPdf from "../controller/company/pdfController.js";
import { saveCompiledPDF } from "../controller/company/pdfController.js";
import multer from "multer";

const router = Router();

router.get("/faq", getFaq);
router.get("/form", getOnlineForm);
router.get("/pdf/:formId",getPdf);

const upload = multer({ storage: multer.memoryStorage() });
router.post("/uploadForm",uploadForm);
router.post("/upload/pdf",upload.single("file"),saveCompiledPDF);
export default router;
