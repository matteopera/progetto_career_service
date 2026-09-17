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
import { requireAdmin } from "../middleware/betterAuthMiddleware.js";

const router = Router();

router.get("/get-all", requireAdmin, getFormsAsync);

router.get("/get/:idForm", getFormAsync);

router.get("/get-last", requireAdmin, getLastFormsAsync);

router.get("/get-last-compiled-forms", requireAdmin, getLastCompiledFormsAsync);

router.get("/get-compiled-forms/:idForm", requireAdmin, getCompiledFormsAsync);

router.post("/insert-update-form", requireAdmin, saveFormAsync);

router.post("/delete-form", requireAdmin, deleteFormAsync);

router.get("/get-data-dashboard", requireAdmin, getDataDashboardAsync);

export default router;
