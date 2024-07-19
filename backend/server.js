const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const port = process.env.PORT || 3003;
const { errorHandler } = require('./middleware/errormiddleware');

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api/goals/", require("./routes/goalroutes"));
app.use("/api/users/", require("./routes/userroutes"));


app.use(errorHandler);

app.listen(port, () => console.log("The server is running on port " + port));
