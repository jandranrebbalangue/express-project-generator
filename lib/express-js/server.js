import express from "express"
import dotenv from "dotenv"
import Debug from "debug"
import helmet from "helmet"
import cors from "cors"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import api from "./src/routes/api.js"
import paths from "./src/routes/constants/Paths.js"
dotenv.config()
const debug = Debug("app:listen")

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express project",
      version: "0.0.1"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(api)

app.listen(PORT, () => {
  debug(`Listen to ${PORT}`)
})

export default app
