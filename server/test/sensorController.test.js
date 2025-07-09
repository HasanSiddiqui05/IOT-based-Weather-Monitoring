import { expect } from 'chai';
import sinon from 'sinon';
import { handleUpload, handleFetch } from '../Controllers/sensorController.js';
import Sensor from '../Models/sensorModel.js';

describe("Sensor Controller", () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {}, params: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("handleUpload", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = { temperature: "", humidity: "" };
      await handleUpload(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "All fields are required" })).to.be.true;
    });

    it("should create a sensor reading and return 201", async () => {
      req.body = { temperature: 25, humidity: 60 };
      const fakeReading = {
        timestamp: "2025-01-02 12:00",
        temperature: 25,
        humidity: 60,
      };

      sandbox.stub(Sensor, "create").resolves(fakeReading);

      await handleUpload(req, res, next);

      expect(Sensor.create.calledOnceWith({ timestamp: sinon.match.string, temperature: 25, humidity: 60 })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: "Success", sensorData: fakeReading })).to.be.true;
    });

    it("should return 500 if there is an internal server error", async () => {
      req.body = { temperature: 25, humidity: 60 };
      sandbox.stub(Sensor, "create").rejects(new Error("Database error"));

      await handleUpload(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: "Internal Server Error" })).to.be.true;
    });
  });

  describe("handleFetch", () => {
    it("should return sensor readings and status 200", async () => {
      const fakeReadings = [
        { timestamp: "2025-01-02 12:00", temperature: 25, humidity: 60 },
        { timestamp: "2025-01-02 13:00", temperature: 26, humidity: 55 },
      ];

      // Mock the find method and chain sort
      const findStub = sandbox.stub(Sensor, "find").resolves(fakeReadings);
      findStub.returns({
        sort: sandbox.stub().returns(fakeReadings),
      });

      await handleFetch(req, res, next);

      expect(Sensor.find.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "Success", readings: fakeReadings })).to.be.true;
    });

    it("should return 500 if there is an internal server error", async () => {
      sandbox.stub(Sensor, "find").rejects(new Error("Database error"));

      await handleFetch(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: "Internal Server Error" })).to.be.true;
    });
  });
});
