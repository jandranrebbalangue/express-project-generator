import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import debug from "debug"
import { describe, it } from "mocha"
import paths from "../routes/constants/Paths.js"
import app from "../server.js"

chai.use(chaiHttp)
describe("GET Hello World", () => {
  it("should return Hello World", (done) => {
    chai
      .request(app)
      .get(paths.Base)
      .end((err, res) => {
        debug("app:test")(res.text)
        expect(err).to.be(null)
        expect(res).to.have.status(200)
        expect(res.text).to.equal("Hello World!")
        done()
      })
  })
})
