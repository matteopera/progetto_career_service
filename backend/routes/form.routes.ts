import { Router } from "express";
import {
  deleteFormAsync,
  getFormAsync,
  getFormsAsync,
  saveFormAsync,
} from "../controller/formController.js";

const router = Router();

router.get("/get-all", getFormsAsync);

router.get("/get/:idForm", getFormAsync);

router.post("/insert-update-form", saveFormAsync);

router.post("/delete-form", deleteFormAsync);

export default router;
