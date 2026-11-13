const { GraphQLError } = require("graphql");
const { verifyToken } = require("./jwt");

/**
 * extract and verify the JWT from the Authorization header of
 * GraphQL request context and return the authenticated user's id
 *
 * this accepts the token either raw or as "Bearer <token>"
 *
 * and will throw GraphQLErrors with below extension codes:
 *  - MISSING_AUTH_HEADER : no Authorization header on the request
 *  - INVALID_TOKEN       : token is malformed, expired or has a bad payload
 *
 * @param {object} context - GraphQL context ({ req } from expressMiddleware)
 * @returns {string} userId
 */
const getUserFromContext = (context) => {
  const authHeader = context?.req?.headers?.authorization;

  if (!authHeader) {
    throw new GraphQLError("Authorization header must be provided", {
      extensions: { code: "MISSING_AUTH_HEADER" },
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : authHeader;

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    // wrap the error 
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "INVALID_TOKEN" },
    });
  }

  const { userId } = decoded;

  if (!userId) {
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "INVALID_TOKEN" },
    });
  }

  return userId;
};

module.exports = { getUserFromContext };
