const { AuthenticationError } = require("apollo-server");
const { verifyToken } = require("../utils/jwt");

module.exports = (context) => {
  // console.log(context.req.headers.authorization);
  // return context;
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader;
    if (token) {
      try {
        const user = verifyToken(token);
        return user;
      } catch (error) {
        throw new AuthenticationError(
          "Invalid or expired token",
          "INVALID_TOKEN"
        );
      }
    }
  }
  throw new AuthenticationError(
    "Authorization header must be provided",
    "MISSING_AUTH_HEADER"
  );
};
