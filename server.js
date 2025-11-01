const app = require("./app");
const mongoDb = require("./db/connectDb");

const start = async () => {
  try {
    await mongoDb();
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
