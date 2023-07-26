import express from "express"
import dotenv from "dotenv"
import Debug from "debug"
import api from "./routes/api.js"

dotenv.config()
const debug = Debug("app:listen")

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use(api)

app.listen(PORT, () => {
  debug(`Listen to ${PORT}`)
})

export default app
