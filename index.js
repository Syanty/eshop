const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongodbConnection = require("./config/db");
const ProductRoutes = require("./routes/product");
const CategoryRoutes = require("./routes/category");
const UserRoutes = require("./routes/user");
const OrderRoutes = require("./routes/order")
const cors = require("cors");
const authJwt = require('./middlewares/jwt')
const errorHandler = require('./middlewares/error-handler')

const app = express();

//cors headers
app.use(cors());
app.options("*", cors());

//middlewares
app.use(express.json());
app.use(morgan("dev"));
//auth middleware
app.use(authJwt())
//error middleware
app.use(errorHandler)


//routes
const BASE_URL = process.env.BASE_URL;

app.use(`${BASE_URL}/products`, ProductRoutes);

app.use(`${BASE_URL}/categories`, CategoryRoutes);

app.use(`${BASE_URL}/accounts`, UserRoutes);

app.use(`${BASE_URL}/orders`,OrderRoutes)

//server
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
  mongodbConnection();
});
