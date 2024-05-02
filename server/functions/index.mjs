import express from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import typeDefs from "../server/api/typeDefs.js";
import resolvers from "../server/api/resolvers.js";
import auth from "../server/middleware/auth.js";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import serverless from "serverless-http";

dotenv.config();

const PORT = process.env.PORT;
const MONGODB = process.env.MONGO_DB_URL;

const app = express();
const httpServer = http.createServer(app);
const context = (ctx) => ctx;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req }) => {
    console.log("SERVER ::: ", req);
    return { user: req.currentUser };
  },
});

await server.start();

// Enable CORS for all origins (not recommended for production)
app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server, { context }),
  auth
);

// Connect to MongoDB before starting the server
(async () => {
  try {
    await mongoose
      .connect(MONGODB, { useNewUrlParser: true })
      .then(
        // to show when the connection is made
        () => {
          console.log("Database Connected Successfully");
          httpServer.listen({ port: PORT });
          return { url: PORT };
        }
      )
      // // to handle the response object and show where your server is running
      .then((res) => {
        console.log(`Server is running on port ${res.url}`);
      });
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit process on connection failure
  }
})();

module.exports.handler = serverless(app);
