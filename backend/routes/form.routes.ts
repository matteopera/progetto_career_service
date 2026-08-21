import { Router } from "express";
import { getFormsAsync } from "../controller/formController.js";
import { Request, Response } from "express";

const router = Router();

router.get("/get", getFormsAsync);

export default router;
