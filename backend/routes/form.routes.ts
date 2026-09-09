import { Router } from "express";
import { getFormsAsync, saveFormsAsync } from "../controller/formController.js";
import { Request, Response } from "express";

const router = Router();

router.get("/get", getFormsAsync);

router.post("/insert-form", saveFormsAsync);

export default router;
