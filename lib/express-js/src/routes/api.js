import { Router } from "express"
import BaseRoutes from "./BaseRoutes.js"
import AuthRoutes from "./AuthRoutes.js"
import Paths from "./constants/Paths.js"

const apiRouter = Router()
const baseRouter = Router()

baseRouter.get(Paths.Base, BaseRoutes)
apiRouter.use(Paths.Base, baseRouter)
apiRouter.use(Paths.Auth.Base, AuthRoutes.router)
export default apiRouter
