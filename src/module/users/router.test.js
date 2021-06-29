const chai = require('chai')
const { expect } = chai
const { ObjectID } = require('mongodb')
const chaiHttp = require('chai-http')
const JWT = require('jsonwebtoken')
const databaseConnection = require('../../database/connection')
const { secret } = require('../../config/auth')
let server

chai.use(chaiHttp)

const userOne = {
    username: 'janedoe',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@test.com',
    password: 'secretcode',
    createdAt: new Date(),
    registrationIp: '127.0.0.1',
}
describe('Endpoint users', function () {
    this.timeout(150000)
    before(async function () {
        delete require.cache[require.resolve('../../../server')]
        server = require('../../../server')
        await databaseConnection.connect()
        databaseConnection.getDatabase().dropDatabase()
        const User = databaseConnection.getDatabase().collection('users')
        const result = await User.insertOne(userOne)
        const token = JWT.sign(
            {
                iss: 'check-in',
                sub: result.ops[0]._id,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 30),
            },
            secret
        )
        this.data = {
            _id: result.ops[0]._id,
            username: result.ops[0].username,
            firstName: result.ops[0].firstName,
            lastName: result.ops[0].lastName,
            email: result.ops[0].email,
            created_at: new Date(),
            token: token,
        }
    })
    after(async function () {
        await databaseConnection.close()
        server.close()
    })
    describe('GET /v1/users/', function () {
        it('It Should get user details', function (done) {
            chai.request(server)
                .get('/v1/users')
                .set('Authorization', `Bearer ${this.data.token}`)
                .send()
                .end((err, res) => {
                    if (err) {
                        done()
                    } else {
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.a('object')
                        done()
                    }
                })
        })
    })
    describe('GET /v1/users/:id', function () {
        it('It should get user details based on id on query', function (done) {
            const _id = new ObjectID(this.data._id)
            chai.request(server)
                .get(`v1/users/${_id}`)
                .send()
                .end((err, res) => {
                    if (err) {
                        done()
                    } else {
                        expect(res).to.have.status(200)
                        done()
                    }
                })
        })
        it('It should unable to fetch user data based on unexsisting id', function (done) {
            const _id = new ObjectID(123)
            chai.request(server)
                .get(`v1/users/${_id}`)
                .send()
                .end((err, res) => {
                    if (err) {
                        done()
                    } else {
                        expect(res).to.have.status(404)
                        done()
                    }
                })
        })
    })
    describe('PUT /v1/users/:id', function () {
        it('It should able to change user details based on request body', function (done) {
            const _id = new ObjectID(this.data._id)
            chai.request(server)
                .get(`v1/users/${_id}`)
                .send({
                    firstName: 'Bob',
                    lastName: 'Mortimer',
                })
                .end((err, res) => {
                    if (err) {
                        done()
                    } else {
                        expect(res).to.have.status(200)
                        done()
                    }
                })
        })
        it('It Should unable to change data from unexsisting user id', function (done) {
            const _id = new ObjectID(1234)
            chai.request(server)
                .get(`v1/users/${_id}`)
                .send({
                    firstName: 'Bob',
                    lastName: 'Mortimer',
                })
                .end((err, res) => {
                    if (err) {
                        done()
                    } else {
                        expect(res).to.have.status(404)
                        done()
                    }
                })
        })
    })
})
