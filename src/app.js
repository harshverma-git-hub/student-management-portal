import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import homeworkRoutes from "./routes/homework.routes.js";
import testRoutes from "./routes/test.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import path from "path";
import recycleBinRoutes from "./routes/recycleBin.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static(path.resolve("src/uploads")));
app.use("/api/recycle-bin", recycleBinRoutes);
app.use("/api/profile", profileRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Student Management Backend Running 🚀" });
});

export default app;
