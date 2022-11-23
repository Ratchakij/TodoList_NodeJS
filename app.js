const express = require("express");
const todoRoute = require("./routes/todoRoute");
const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/notFound");

const app = express();

// ให้ app ดึงค่าข้อมูลจาก request body มาใช้ได้
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/todos", todoRoute);

// Error middlewares
app.use(errorMiddleware);
app.use(notFoundMiddleware);

app.listen(8000, () => console.log("server running on port 8000")); // รอรับ request ที่ port 8000
