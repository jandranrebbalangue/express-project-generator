import request from "supertest"
import jwt from "jsonwebtoken"
import { expect, describe, it, beforeAll, afterAll } from "@jest/globals"
import Person from "../../models/entities/person"
import Persons from "../fixtures/persons.json"
import { type ResponseBody } from "../../types/types"
import { mongoConnect, mongoDisconnect } from "../../models"
import app from "../../app"

describe("Person endpoints", () => {
  let token: string | undefined
  beforeAll(async () => {
    await mongoConnect()
    await Person.deleteMany({})
    const privateKey = process.env.JWT_SECRET as string
    token = jwt.sign({ id: "1" }, privateKey)
  })

  afterAll(async () => {
    await mongoDisconnect()
    token = undefined
  })

  Persons.forEach((data) => {
    it(`should create person ${data.name} and return 200 OK with data if valid token is provided`, async () => {
      const response = await request(app)
        .post("/person")
        .set("Authorization", `Bearer ${token as string}`)
        .set("Content-Type", "application/json")
        .send(data)
      const json: ResponseBody = response.body as ResponseBody
      expect(json.message).toHaveProperty("_id")
      expect(response.status).toBe(201)
    })
  })
  it("return all people", async () => {
    const response = await request(app)
      .get("/people")
      .set("Authorization", `Bearer ${token as string}`)
    expect(response.body.message[0]).toHaveProperty("name")
    expect(response.body.message[0]).toHaveProperty("age")
    expect(response.body.message[0]).toHaveProperty("email")
    expect(response.body.message).toHaveLength(3)
  })

  it("should return 401 Unauthorized if no token is provided", async () => {
    const payload = { firstName: "John", lastName: "Doe" }
    const res = await request(app)
      .post("/person")
      .send(payload)
      .set("Content-Type", "application/json")
    expect(res.status).toBe(401)
  })
})
