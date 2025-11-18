import cors from "cors";
import express, { Application } from "express";
import httpStatus from "http-status";
import swaggerUi from "swagger-ui-express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import router from "./app/routes";
import swaggerSpec from "./swagger";
import gridfs from "./app/shared/gridfs";

const app: Application = express();

// middlewares configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://my-studio-frontend.vercel.app",
      "https://my-studio-backend.vercel.app",
      "http://localhost:3000",
      "https://www.esmiztech.me",
      "https://esmiztech.me"
    ],
    credentials: true,
  })
);

// test server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Esmu  server is working fine",
  });
});

// Serve files stored in GridFS at /files/:filename
app.get('/files/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const stream = await gridfs.getFileStream(filename);
    stream.pipe(res);
  } catch (err) {
    res.status(404).json({ success: false, message: 'File not found' });
  }
});

// api routes
app.use("/api/v1", router);

// api documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// handle error
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
