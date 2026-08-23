import { Router } from "express";
import { getOnlineForm } from "../controller/company/formController.js";

const router = Router();

//router.get("/FAQ", getFaq);
router.get("/form", getOnlineForm);

export default router;
