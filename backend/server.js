const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("Missing MONGO_URI or JWT_SECRET in backend/.env");
}

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/authroutes"));
app.use('/api/employees', require("./src/routes/employeeroutes"));
app.use("/api/leads",require('./src/routes/leadroutes'));
app.use("/api/tickets", require("./src/routes/ticketroutes"));
app.use("/api/dashboard",require("./src/routes/dashboardroutes"));

mongoose.connect(process.env.MONGO_URI)
.catch((error) => {
    throw error;
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
