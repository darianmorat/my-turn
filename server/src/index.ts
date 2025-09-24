import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route";
import queueRoute from "./routes/queue.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
   }),
);

app.use("/user", userRoute);
app.use("/queue", queueRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`listening in port: ${PORT}`);
});
