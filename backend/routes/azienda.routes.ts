import { Router } from "express";
import { getOnlineForm, uploadForm } from "../controller/company/formController.js";
import { getFaq } from "../controller/company/faqController.js";

const router = Router();

router.get("/faq", getFaq);
router.get("/form", getOnlineForm);
router.post("/uploadForm",uploadForm)

export default router;
