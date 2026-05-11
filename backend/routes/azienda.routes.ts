import {Router} from "express"
import {getFaq, getForm} from "../controller/companyControllers.js"
const router=Router()

router.get("/FAQ",getFaq);
router.get("/form",getForm);

export default router