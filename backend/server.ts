import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import { AppDataSource } from "./src/config/data";

// Route Imports
import authRoutes from "./src/routes/auth";
import bookingRoutes from "./src/routes/booking";
import messagingRoutes from "./src/routes/messaging";
import searchRoutes from "./src/routes/search";
import adminRoutes from "./src/routes/admin";
import recommendationRoutes from "./src/routes/recommendation";

// Load Environment Variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8443;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Base Route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// Mounting REST API Routers
app.use("/api/auth", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api/messages", messagingRoutes);
app.use("/api/events", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", recommendationRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "An unexpected internal server error occurred." });
});

// Initialize Database & Start HTTPS Server (SSL/TLS Required - Req 1)
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully.");

    // Check for SSL Certificates (Self-signed or CA-issued for dev/prod)
    const certPath = path.join(__dirname, "../certs/server.crt");
    const keyPath = path.join(__dirname, "../certs/server.key");

    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };

      https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`HTTPS Server running on https://localhost:${PORT}`);
      });
    } else {
      console.warn("SSL certificates missing in /certs. Back to HTTP.");
      app.listen(PORT, () => {
        console.log(`HTTP Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("Error in Data Source initialization:", error);
  });