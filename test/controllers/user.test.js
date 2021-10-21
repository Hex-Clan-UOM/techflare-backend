require("dotenv").config({ path: __dirname + "/../../test.env" });
const expect = require("chai").expect;
const request = require("supertest");
const mongoose = require("mongoose");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const createApp = require("../../app");
const appConfig = require("../../appConfig");
const connectMongo = require("../../src/connectors");
const { client, createUser } = require("../../src/services").userService;
const logger = require("../../src/commons/logger");
const middleware = require("../../src/express-middleware");
describe("[CONTROLLER] USER", function () {
  let User;
  let app;
  const sanbox = sinon.createSandbox();
  // Called once before any of the tests in this block begin.
  before(function (done) {
    app = createApp();
    app.listen((err) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  beforeEach(function (done) {
    this.timeout(0);
    connectMongo(appConfig.mongoDB)
      .then(function (res) {
        if (mongoose.connection.readyState === 1) {
          if (!User) {
            User = require("../../src/schemas").User.registerUser(
              mongoose.connection
            );
          }
          return User.deleteMany({})
            .then((res) => {
              done();
            })
            .catch((e) => {
              done(e);
            });
        }
        done(new Error("mongodb connection is not active"));
      })
      .catch((e) => {
        done(new Error(e.message));
      });
  });

  afterEach(function (done) {
    sanbox.restore();
    mongoose.disconnect();
    done();
  });

  describe("GET /", function () {
    it("should return home page", function (done) {
      request(app)
        .get("/")
        .set("Content-Type", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.be.equal(true);
          expect(res.body.message).to.be.equal("this is home page");
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  describe("POST /login", function () {
    it("Should return user info", function (done) {
      this.timeout(0);
      const stub = sinon
        .stub(client, "verifyIdToken")
        .onFirstCall()
        .resolves({
          getPayload: () => {
            return {
              iss: "https://accounts.google.com",
              azp: "108891814378-maujqp6evhdqeqqa8h98tt9bs4gf80j5.apps.googleusercontent.com",
              aud: "108891814378-maujqp6evhdqeqqa8h98tt9bs4gf80j5.apps.googleusercontent.com",
              sub: "118394798226339311512",
              email: "theepichris@gmail.com",
              email_verified: true,
              at_hash: "exgAd41CDmGUJNL2P_ONFQ",
              name: "Hex Clan",
              picture:
                "https://lh3.googleusercontent.com/a-/AOh14GjzWMhFKkPjiSLfgwf4shvmgwLg1OBUZCq6WMp0=s96-c",
              given_name: "Hex",
              family_name: "Clan",
              locale: "en",
              iat: 1634500600,
              exp: 1634504200,
            };
          },
        });

      const mock = sinon.mock(logger);
      const expectation = mock.expects("info");
      expectation.exactly(1);
      request(app)
        .post("/login")
        .send({ idToken: "12345" })
        .set("Accept", "application/json")
        .expect(201)
        .then((res) => {
          expectation.verify();
          expect(res.body.success).to.be.equal(true);
          expect(res.body.user).have.property("firstName");
          expect(res.body.user.googleId).to.be.equal("118394798226339311512");
          expect(res.body.message).to.be.equal(
            "you have logged in successfully"
          );
          expect(res.body.user).to.have.property("accessToken");
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it("Should throw error if id token is not provided", function (done) {
      request(app)
        .post("/login")
        .send({})
        .set("Accept", "application/json")
        .expect(501)
        .then((res) => {
          expect(res.body.success).to.be.equal(false);
          expect(res.body.message).to.be.equal(
            "unable to login in to the system, try again later"
          );
          expect(res.body.error).to.be.equal(
            "Cannot read property 'getPayload' of undefined"
          );
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it("Should throw error if id token is invalid", function (done) {
      request(app)
        .post("/login")
        .send({ idToken: "33442" })
        .set("Accept", "application/json")
        .expect(501)
        .then((res) => {
          expect(res.body.success).to.be.equal(false);
          expect(res.body.message).to.be.equal(
            "unable to login in to the system, try again later"
          );
          expect(res.body.error).to.be.equal(
            "Cannot read property 'getPayload' of undefined"
          );
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  describe("GET /user", function () {
    let user;
    beforeEach(function (done) {
      this.timeout(0);
      createUser({
        given_name: "John",
        family_name: "Lesley",
        sub: "12345",
        email: "email@gmail.com",
        picture: "/picture/me.jpg",
      })
        .then((res) => {
          user = res;
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
    it("should return user info", function (done) {
      this.timeout(0);
      const stub = sanbox.stub(jwt, "verify");
      stub.withArgs("123", appConfig.accessTokenSecret).onFirstCall().returns({
        userid: user._id,
        googleid: user.googleId,
        iat: 1634500700,
      });
      request(app)
        .get("/user")
        .set("Authorization", "123")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.firstName).to.be.equal("John");
          expect(res.body.lastName).to.be.equal("Lesley");
          expect(res.body.googleId).to.be.equal("12345");
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should throw erro if sent an invalid accesstoken", function (done) {
      request(app)
        .get("/user")
        .set("Authorization", "123")
        .expect("Content-Type", /json/)
        .expect(401)
        .then((res) => {
          expect(res.body.success).to.be.equal(false);
          expect(res.body.message).to.be.equal(
            "access denied: JsonWebTokenError: jwt malformed"
          );
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should throw error if access token not provided", function (done) {
      request(app)
        .get("/user")
        .expect("Content-Type", /json/)
        .expect(401)
        .then((res) => {
          expect(res.body.success).to.be.equal(false);
          expect(res.body.message).to.be.equal(
            "access denied: TypeError: Cannot read property 'replace' of undefined"
          );
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });
});
