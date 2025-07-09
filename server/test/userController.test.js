import { expect } from 'chai'; 
import sinon from "sinon";
import { handleUserSignUp, handleUserLogIn } from "../controllers/userController.js";
import User from "../Models/userModel.js";
import * as authService from "../services/auth.js";
import bcrypt from "bcrypt";

describe("User Controller", () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {}, params: {}, user: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      cookie: sinon.stub(),
      clearCookie: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("handleUserSignUp", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = { firstName: "", lastName: "", email: "", password: "" };
      await handleUserSignUp(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "All fields are required" })).to.be.true;
    });

   
  });

  describe("handleUserLogIn", () => {
    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "", password: "" };
      await handleUserLogIn(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "All fields are required" })).to.be.true;
    });

    it("should return 404 if user is not found", async () => {
      req.body = { email: "unknown@example.com", password: "password123" };
      sandbox.stub(User, "findOne").resolves(null); // User not found

      await handleUserLogIn(req, res, next);

      expect(User.findOne.calledOnceWith({ email: req.body.email })).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Invalid Login Credentials" })).to.be.true;
    });

    it("should return 404 if user is not verified", async () => {
      req.body = { email: "john.doe@example.com", password: "password123" };
      sandbox.stub(User, "findOne").resolves({ isVerified: false }); // User not verified

      await handleUserLogIn(req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Please your Verify Account to Login" })).to.be.true;
    });
  });
});
