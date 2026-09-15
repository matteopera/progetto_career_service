import { Router } from "express";

import { requireAdmin } from "../betterAuthMiddleware.js";
import getCompanyExcel from "../controller/excelController.js";
const router=Router()


router.get("/:formId",requireAdmin,getCompanyExcel)


export default router