const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: "string",
  email: "string",
  password: "string",
  total_balance: "number",
  checking_balance: "number",
  savings_balance: "number",
  created_at: "date",
  last_login: "date",
  transactions: [],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
