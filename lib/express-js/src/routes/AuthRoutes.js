import express from "express"
import jwt from "jsonwebtoken"
import Debug from "debug"
import { verifyUser } from "../utils/verifyuser.js"

const router = express.Router()
const secretKey = process.env.JWT_SECRET

function authMiddleware(req, res, next) {
  const { authorization } = req.headers

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing authorization token" })
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
      next()
    }
  } catch (error) {
    Debug("app:authmiddleware error")(error)
    res.status(401).json({ message: "Invalid token" })
  }
}

/**
 * @swagger
 * /login:
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
router.post("/auth", (req, res) => {
  const response = verifyUser(req)

  if (response.success == true) {
    res.status(201).json(response)
  } else {
    res.status(404).json(response)
  }
})

/* function auth(req, res) { */
/*   const response = verifyUser(req) */
/**/
/*   if (response.success == true) { */
/*     res.status(201).json(response) */
/*   } else { */
/*     res.status(404).json(response) */
/*   } */
/* } */

/**
 * @swagger
 * /:
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
