const mongoose = require("mongoose");
require("dotenv").config();
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", false);
const uri = `mongodb+srv://bad_bank_user:emiritus_bad_bank@cluster62502.obvmsts.mongodb.net/?retryWrites=true&w=majority`;
const connexion = mongoose
  .connect(uri, connectionParams)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

module.exports = connexion;
