require("dotenv").config();
const mongoose = require("mongoose");
const { redisClient, trackRedis } = require("./redis");

class DB {
      mongo_uri = process.env.MONGO_URI;

      conn = null;

      constructor() {
            this.track();
      }

      async connect() {
            this.conn = await mongoose.connect(this.mongo_uri);
      }

      track() {
            mongoose.connection.on("connected", () => {
                  console.log("\nConnected to mongoDB ...");
            });

            mongoose.connection.on("error", (err) => {
                  console.log(err.message);
            });

            mongoose.connection.on("disconnected", () => {
                  console.log("\nDisconnected from mongoDB ...");
            });

            process.on("SIGINT", async () => {
                  await mongoose.connection.close();
                  process.exit(0);
            });
      }
}

const db = new DB();

module.exports = { db, redisClient, trackRedis };
