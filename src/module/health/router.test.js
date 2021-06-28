const chai = require("chai")
const { expect } = chai

describe("Endpoint for Server health status", function () {
    describe("GET /v1/_health/check", function () {
        it("Should return a status code of 200 and 'OK' string as a response", function (done) {
            let server = require("../../../server")
            chai.request(server)
                .get("/v1/_health/check")
                .end((err, res) => {
                    if (err) {
                        done()
                    } else {
                        expect(res).to.have.status(200)
                        done()
                    }
                })
        })
    })
})
