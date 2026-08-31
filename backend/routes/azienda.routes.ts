import { Router } from "express";
import { getOnlineForm, uploadForm } from "../controller/company/formController.js";
import { getFaq } from "../controller/company/faqController.js";
import getPdf from "../controller/company/pdfController.js";

const router = Router();

router.get("/faq", getFaq);
router.get("/form", getOnlineForm);
router.post("/uploadForm",uploadForm);
router.get("/pdf",getPdf);
export default router;
