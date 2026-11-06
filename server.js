import express from "express";
import cors from "cors";
import { redis, redisConfigured } from "./redis.js";
import moviesRouter from "./routes/movies.js";
import authRouter from "./routes/auth.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/movies", moviesRouter);

app.get("/", (req, res) => {
  res.json({ message: "1234" });
});

app.use((req, res) => {
  res.status(404).json({ message: "요청한 API를 찾을 수 없습니다." });
});

async function startServer() {
  if (redisConfigured) {
    // Redis 접속 정보가 있으면 연결 시도
    try {
      await redis.connect();
      console.log("Redis 연결 완료");
    } catch (error) {
      console.error("Redis 연결 실패:", error.message);
    }
  } else {
    // 접속 정보가 없으면 Redis 연결 생략
    console.log("Redis 미설정: DB 조회로 진행합니다.");
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`서버 실행: port ${port}`);
  });
}

startServer();
