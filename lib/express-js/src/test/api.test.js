import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import jwt from "jsonwebtoken"
import debug from "debug"
import { after, before, describe, it } from "mocha"
import paths from "../routes/constants/Paths.js"
import app from "../../server.js"

chai.use(chaiHttp)
describe("Authorization with and without token", () => {
  let token = ""
  before(() => {
    const { USERNAME, PASSWORD, JWT_SECRET } = process.env
    token = jwt.sign(
      {
        USERNAME,
        PASSWORD
      },
      JWT_SECRET
    )
  })
  after(() => {
    token = undefined
  })

  it("should return Hello World without auth", (done) => {
    chai
      .request(app)
      .get(paths.Base)
      .end((err, res) => {
        expect(err).to.be.null
        debug("app:without auth")(res.text)
        expect(res).to.have.status(200)
        expect(res.text).to.equal("Hello World!")
        done()
      })
  })

  it("should return Hello World with auth", (done) => {
    chai
      .request(app)
      .get(paths.Auth.Base)
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null
        debug("app:with auth")(res.text)
        expect(res).to.have.status(200)
        expect(res.text).to.equal("Hello world auth")
        done()
      })
  })

  it("should return 401 Unauthorized if no token is provided", (done) => {
    chai
      .request(app)
      .get(paths.Auth.Base)
      .end((err, res) => {
        expect(err).to.be.null
        debug("app:unauthorized")(res.text)
        expect(res).to.have.status(401)
        expect(res.text).to.equal('"Missing authorization token"')
        done()
      })
  })
})
