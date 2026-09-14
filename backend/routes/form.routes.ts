import { Router } from "express";
import {
  deleteFormAsync,
  getCompiledFormsAsync,
  getDataDashboardAsync,
  getFormAsync,
  getFormsAsync,
  getLastCompiledFormsAsync,
  getLastFormsAsync,
  saveFormAsync,
} from "../controller/formController.js";

const router = Router();

router.get("/get-all", getFormsAsync);

router.get("/get-last", getLastFormsAsync);

router.get("/get/:idForm", getFormAsync);

router.get("/get-compiled-forms/:idForm", getCompiledFormsAsync);

router.get("/get-last-compiled-forms", getLastCompiledFormsAsync);

router.post("/insert-update-form", saveFormAsync);

router.post("/delete-form", deleteFormAsync);

router.get("/get-data-dashboard", getDataDashboardAsync);

export default router;
