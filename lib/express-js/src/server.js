import express from "express"
import dotenv from "dotenv"
import Debug from "debug"
import helmet from "helmet"
import api from "./routes/api.js"
dotenv.config()
const debug = Debug("app:listen")

if (process.env.NODE_ENV === "production") {
  app.use(helmet())
}

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use(api)

app.listen(PORT, () => {
  debug(`Listen to ${PORT}`)
})

export default app
