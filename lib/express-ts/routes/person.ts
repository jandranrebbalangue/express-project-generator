import { Router, type Request, type Response } from "express"
import jwt from "jsonwebtoken"
import Debug from "debug"
import makeCreate from "../use-cases/create"
import Person from "../models/entities/person"
import { mongoConnect } from "../models"
import { JWT_SECRET } from "../constants"
import {
  type AuthenticateProps,
  type IPerson,
  type PersonRequest
} from "../types/types"
import authMiddleware from "../middlewares/auth"
import makeList from "../use-cases/list"
const router = Router()

/**
 * @swagger
 * /authenticate:
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

router.post("/authenticate", async (req: Request, res: Response) => {
  const privateKey = JWT_SECRET
  const payload: AuthenticateProps = req.body
  const { email, password } = payload

  if (
    email !== process.env.LOGIN_USERNAME ||
    password !== process.env.LOGIN_PASSWORD
  ) {
    res.status(401).json({ message: "Incorrect email or password" })
    return
  }

  let response
  try {
    response = {
      data: {
        username: email
      }
    }
    const token = jwt.sign({ user: response }, privateKey, { expiresIn: "1d" })
    Debug("app:token")({ token })
    req.token = token
    res.json({ success: true, message: token })
  } catch (error) {
    Debug("app:authenticate")({ error })
    res.status(500).json({
      message: "Internal server error"
    })
  }
})

/**
 * @swagger
 *  components:
 *   schemas:
 *     Person:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: test@gmail.com
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: John
 *         age:
 *           type: number
 *           description: The user's age.
 *           example: 18
 *
 * /person:
 *   post:
 *     summary: Post a Data from Person Data.
 *     requestBody:
 *       required: true
 *       description: Post any data from person.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Person'
 *     responses:
 *       200:
 *         description: Outputs data from api
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       401:
 *          description: Authorization token is missing or invalid.
 *
 */

router.post("/people", authMiddleware, async (req: Request, res: Response) => {
  await mongoConnect()
  const personRequest: PersonRequest = req.body
  const payload: IPerson = {
    email: personRequest.email,
    name: personRequest.name,
    age: personRequest.age
  }
  const create = makeCreate({ model: Person })
  const response = await create(payload)
  Debug("app:payload")({ payload })
  res.status(201).send({ success: true, message: response })
})

router.get("/people", authMiddleware, async (req: Request, res: Response) => {
  await mongoConnect()
  const list = makeList({ model: Person })
  const response = await list()
  Debug("app:response")({ response })
  res.status(200).send({ success: true, message: response })
})

export default router
