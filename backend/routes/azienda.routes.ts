import {Router} from "express"
import {getFaq} from "../controller/companyControllers.js"
const router=Router()

router.get("/FAQ",getFaq);

export default router