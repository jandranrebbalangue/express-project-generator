import express, { type Application } from "express"
import helmet from "helmet"
import cors from "cors"
import routes from "./routes"
const app: Application = express()

app.use(
  helmet({
    originAgentCluster: false,
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false
  })
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(
  cors({
    allowedHeaders: ["Content-Type", "api_key", "Authorization"]
  })
)
app.use("/", routes)

export default app
