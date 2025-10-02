import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import personalRoute from "./routes/personal.route";
import queueRoute from "./routes/queue.route";
import moduleRoute from "./routes/module.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
   }),
);

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/personal", personalRoute);
app.use("/queue", queueRoute);
app.use("/module", moduleRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`listening in port: ${PORT}`);
});
