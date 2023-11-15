import dotenv from "dotenv"
import Debug from "debug"
import swaggerUi from "swagger-ui-express"
import app from "./app"
import swaggerJSDoc from "swagger-jsdoc"

dotenv.config()
const PORT: number | string = process.env.PORT ?? 3000
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "0.1.0",
      description: "API endpoints to receive data from Green Arrow Engine Bounce Recovery"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          name: "Authorization",
          scheme: "bearer",
          in: "header",
          description:
            "When using the token within this documentation, you can simply enter the token without any prefix. However,if you intend to use the token outside of this documentation, you should include the prefix Bearer: before entering the token.For example, if the token is abcde12345, you would enter it as Bearer abcde12345.Additionally, you should include this value in the Authorization header of your HTTP request. Specifically, the header should have the key Authorization and the value should be Bearer followed by a space and the token ",
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
  apis: ["**/*.ts"]
}
const specs = swaggerJSDoc(options)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs))

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`)
  Debug.enable("app:*")
})
