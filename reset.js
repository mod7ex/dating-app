require("dotenv").config();
let { User, Message } = require("./models");

const mongoose = require("mongoose");

let reset = async () => {
      try {
            let conn = await mongoose.createConnection(process.env.MONGO_URI);

            // await conn.dropCollection(Message.collection.collectionName);
            await conn.dropCollection(process.env.SESSIONS_COLLECTION_NAME);
            await conn.dropCollection(User.collection.collectionName);

            await conn.close(true);
            process.exit(0);
      } catch (err) {
            console.log(err);
            process.exit(1);
      }
};

reset();
