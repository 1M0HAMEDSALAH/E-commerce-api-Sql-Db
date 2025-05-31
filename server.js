require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const userRoute = require("./routers/userRoute");
const reportRoutes = require("./routers/reportRouter");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//handel error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: err.status || 500,
        message: "Internal Server Error",
        error: err.message,
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the API",
    });
});

app.use("/api/user", userRoute);

app.use("/api/reports", reportRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});