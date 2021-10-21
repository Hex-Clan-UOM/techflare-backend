require("dotenv").config({ path: __dirname + "/../../test.env" });
const expect = require("chai").expect;
const mongoose = require("mongoose");
const request = require("supertest");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { registerUser } = require("../../src/schemas").User;
const { registerPost } = require("../../src/schemas").Post;
const appConfig = require("../../appConfig");
const createApp = require("../../app");
const connectMongo = require("../../src/connectors");
const { createUser } = require("../../src/services").userService;
describe("[CONTROLLER] POST", function () {
  let User;
  let Post;
  let app;
  let userCreated;
  const sandbox = sinon.createSandbox();
  // Called once before any of the tests in this block begin.
  before(function (done) {
    app = createApp();
    this.timeout(0);
    app.listen((err) => {
      if (err) {
        return done(err);
      }
      this.timeout(0);
      return connectMongo(appConfig.mongoDB).then((res) => {
        if (mongoose.connection.readyState === 1) {
          if (!User) {
            User = registerUser(mongoose.connection);
          }
          if (!Post) {
            Post = registerPost(mongoose.connection);
          }
          return User.deleteMany({})
            .then((users) => {
              return Post.deleteMany({});
            })
            .then((posts) => {
              return createUser({
                given_name: "Hex",
                family_name: "Clan",
                sub: "118394798226339311512",
                email: "theepichris@gmail.com",
                picture:
                  "https://lh3.googleusercontent.com/a-/AOh14GjzWMhFKkPjiSLfgwf4shvmgwLg1OBUZCq6WMp0=s96-c",
              });
            })
            .then(function (result) {
              userCreated = result;
              return done();
            })
            .catch(function (result) {
              return done(e);
            });
        }
      });
    });
  });

  beforeEach(function (done) {
    if (mongoose.connection.readyState === 1) {
      Post.deleteMany({})
        .then((res) => {
          return done();
        })
        .catch((e) => {
          return done(e);
        });
    }
  });

  afterEach(function (done) {
    sandbox.restore();
    done();
  });

  after(function (done) {
    mongoose.disconnect();
    done();
  });

  describe("GET /posts/search", function () {
    beforeEach(function (done) {
      this.timeout(0);
      const ps = require("./samplePosts").map((post) => {
        return { ...post, author: userCreated._id };
      });
      //   Post = mongoose.model("Post");
      Post.insertMany(ps)
        .then((result) => {
          posts = result;
          return done();
        })
        .catch((e) => {
          done(e);
        });
    });
    it("should throw error if access token is not provided", function (done) {
      request(app)
        .get("/posts/search")
        .query({
          value: "cupidatat",
        })
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

    it("should return search posts", function (done) {
      this.timeout(0);
      const stub = sandbox.stub(jwt, "verify");
      stub.withArgs("123", appConfig.accessTokenSecret).onFirstCall().returns({
        userid: userCreated._id,
        googleid: userCreated.googleId,
        iat: 1634500700,
      });
      request(app)
        .get("/posts/search")
        .set("Authorization", "123")
        .query({
          value: "cupidatat",
          skip: 2,
          limit: 3,
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.be.equal(true);
          expect(res.body.posts.length).to.be.equal(3);
          res.body.posts.map((obj) => {
            expect(`${obj.title} ${obj.body}`).to.include("cupidatat");
          });
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should return search posts that exactly match with strict query string", function (done) {
      this.timeout(0);
      const stub = sandbox.stub(jwt, "verify");
      stub.withArgs("123", appConfig.accessTokenSecret).onFirstCall().returns({
        userid: userCreated._id,
        googleid: userCreated.googleId,
        iat: 1634500700,
      });
      request(app)
        .get("/posts/search")
        .set("Authorization", "123")
        .query({
          value: "Exercitation sunt quis reprehende",
          strict: true,
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.be.equal(true);
          expect(res.body.posts.length).to.be.equal(1);
          expect(
            `${res.body.posts[0].title} ${res.body.posts[0].body}`
          ).to.include("Exercitation sunt quis reprehende");
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  describe("GET /posts", function (done) {
    beforeEach(function (done) {
      this.timeout(0);
      const ps = require("./samplePosts").map((post) => {
        return { ...post, author: userCreated._id };
      });
      //   Post = mongoose.model("Post");
      Post.insertMany(ps)
        .then((result) => {
          posts = result;
          return done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should return all posts", function (done) {
      this.timeout(0);
      const stub = sandbox.stub(jwt, "verify");
      stub.withArgs("123", appConfig.accessTokenSecret).onFirstCall().returns({
        userid: userCreated._id,
        googleid: userCreated.googleId,
        iat: 1634500700,
      });
      request(app)
        .get("/posts")
        .set("Authorization", "123")
        .query({
          limit: 20,
          skip: 0,
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.number).to.be.equal(101);
          expect(res.body.posts.length).to.be.equal(20);
          const posts = res.body.posts;
          for (i = 0; i < posts.length; i++) {
            if (i < posts.length - 1) {
              expect(
                moment(posts[i].createdAt).isSameOrAfter(moment(posts[i + 1]))
              ).to.be.equal(true);
            }
          }
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should throw error with invalid access token", function (done) {
      request(app)
        .get("/posts")
        .set("Authorization", "123")
        .query({
          limit: 20,
          skip: 0,
        })
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
  });
});
