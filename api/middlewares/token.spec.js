const Middleware = require("./token");
const Request = require("mock-express-request");

describe("middlewares/token", () => {
  const tokenName = "TestToken";
  const tokenValue = "TestValue";

  const middleware = Middleware(tokenName, tokenValue);

  describe("Valid token", () => {
    it("Should call next", () => {
      const next = jest.fn();
      const req = new Request({
        headers: {
          [tokenName]: tokenValue,
        },
      });
      middleware(req, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0]).toBe(undefined);
    });

    it("Should call next even if the header name is lower case", () => {
      const next = jest.fn();
      const req = new Request({
        headers: {
          [tokenName.toLowerCase()]: tokenValue,
        },
      });
      middleware(req, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0]).toBe(undefined);
    });

    it("Should call next even if the header name is upper case", () => {
      const next = jest.fn();
      const req = new Request({
        headers: {
          [tokenName.toUpperCase()]: tokenValue,
        },
      });
      middleware(req, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0]).toBe(undefined);
    });
  });

  describe("Invalid token", () => {
    const expectedError = new Error("Invalid token");

    it("Should throw error if the header is undefined", () => {
      const next = jest.fn();
      const req = new Request({});

      middleware(req, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0]).toMatchObject(expectedError);
    });

    it("Should throw error if the header is null", () => {
      const next = jest.fn();
      const req = new Request({
        headers: {
          [tokenName]: null,
        },
      });

      middleware(req, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0]).toMatchObject(expectedError);
    });

    it("Should throw error if the header is empty string", () => {
      const next = jest.fn();
      const req = new Request({
        headers: {
          [tokenName]: "",
        },
      });

      middleware(req, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0]).toMatchObject(expectedError);
    });

    it("Should throw error if the header it doesn't match the value", () => {
      const next = jest.fn();
      const req = new Request({
        headers: {
          [tokenName]: "some other value",
        },
      });

      middleware(req, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0]).toMatchObject(expectedError);
    });
  });
});
