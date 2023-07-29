import express from "express"
import jwt from "jsonwebtoken"
import Debug from "debug"
import dotenv from "dotenv"
import { verifyUser } from "../utils/verifyuser.js"
import paths from "./constants/Paths.js"
dotenv.config()

const router = express.Router()
const secretKey = process.env.JWT_SECRET

function authMiddleware(req, res, next) {
  const { authorization } = req.headers
  let token

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    res.status(401).json("Missing authorization token")
    return
  }

  if (authorization !== "") {
    const [_, tokenAuth] = authorization.split(" ")
    token = tokenAuth
  }

  try {
    if (token !== "") {
      const decoded = jwt.verify(token, secretKey)
      req.token = token
      Debug("app:token")(token)
      req.user = decoded
      Debug("app:decoded")(decoded)
      next()
    }
  } catch (error) {
    Debug("app:authmiddleware error")(error)
    res.status(401).json({ message: "Invalid token" })
  }
}

/**
 * @swagger
 * /auth/login:
 *  post:
 *      tags:
 *          - Authorization
 *      summary: "Returns Authorization Token"
 *      description: "Authorizes default users with username and password set as root to use the endpoints"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *              example:
 *                  email: "user@root.com"
 *                  password: "root"
 *      produces:
 *          - application/json
 *      responses:
 *          201:
 *              description: "Authorization token"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "data": "token"
 *
 */
router.post(paths.Auth.Login, (req, res) => {
  const response = verifyUser(req, secretKey)

  if (response.success == true) {
    res.status(201).json(response)
  } else {
    res.status(404).json(response)
  }
})

/**
 * @swagger
 * /auth:
 *   get:
 *      responses:
 *          201:
 *              description: "Created"
 *
 */
router.get("/", authMiddleware, async (_, res) => {
  res.send("Hello world auth")
})
export default {
  authMiddleware,
  router
}
