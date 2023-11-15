import { Router } from "express"
import Person from "./person"

const router = Router()
router.use("/", Person)
export default router
