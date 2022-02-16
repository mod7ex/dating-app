require("dotenv").config();
const redis = require("redis");

export const redisClient = redis.createClient({
      socket: {
            host: process.env.HOST_REDIS || "127.0.0.1",
            port: process.env.PORT_REDIS || 6379,
      },
      username: process.env.USERNAME_REDIS ,
      password: process.env.PASSWORD ,
});

let trackRedis = async (client = redisClient) => {
      console.log("tracking redis now ....................");

      client.on("connect", () => {
            console.error("\nClient connected to redis ...");
      });

      client.on("ready", () => {
            console.error("\nClient connected to redis and ready to use ...");
      });

      client.on("error", (err) => {
            console.error(err.message);
            client.quit();
      });

      client.on("end", () => {
            console.error("\nClient disconnected from redis ...");
      });

      process.on("SIGINT", () => {
            client.quit();
            // process.exit(0);
      });

      await client.connect();
};

module.exports = { redisClient, trackRedis };
