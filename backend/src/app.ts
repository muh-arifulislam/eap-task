import cors from "cors";
import express, { Application } from "express";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

//parsers
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

app.get("/api/v1/ping", (req, res) => {
  res.json({ message: "pong" });
});

//Global Error Handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
