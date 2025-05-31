require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const userRoute = require("./routers/userRoute");
const reportRoutes = require("./routers/reportRouter");
const DbContext = require("./config/dbConnection");
const productsRoute = require('./routers/productsRoute');
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const orderRoutes = require("./routers/orderRoutes");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// handle error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: err.status || 500,
        message: "Internal Server Error",
        error: err.message,
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

app.use("/api/user", userRoute);

app.use("/api/reports", reportRoutes);

app.use('/api/products', productsRoute);

app.use("/api/orders", orderRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
