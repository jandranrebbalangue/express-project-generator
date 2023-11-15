import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import Debug from "debug"
import { JWT_SECRET } from "../constants"

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { authorization } = req.headers

  const privateKey = JWT_SECRET
  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing authorization token" })
    return
  }

  let token: any
  if (authorization !== "") {
    const [bearer, tokenAuth] = authorization.split(" ")
    Debug("app:bearer")({ bearer })
    token = tokenAuth
  }

  try {
    if (token !== "") {
      const decoded = jwt.verify(token, privateKey)
      Debug("app:token")({ token })
      req.token = token
      Debug("app:decoded")({ decoded })
      req.user = decoded
      next()
    }
  } catch (error) {
    Debug("endpoint:authMiddleware")({ error })
    res.status(401).json({ message: "Invalid token" })
  }
}
