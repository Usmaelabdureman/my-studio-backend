"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundHandler_1 = __importDefault(require("./app/middlewares/notFoundHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const swagger_1 = __importDefault(require("./swagger"));
const gridfs_1 = __importDefault(require("./app/shared/gridfs"));
const app = (0, express_1.default)();
// middlewares configuration
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "https://my-studio-frontend.vercel.app",
        "https://my-studio-backend.vercel.app",
        "http://localhost:3000",
        "https://www.esmiztech.me",
        "https://esmiztech.me"
    ],
    credentials: true,
}));
// test server
app.get("/", (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Esmu  server is working fine",
    });
});
// Serve files stored in GridFS at /files/:filename
app.get('/files/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    try {
        const stream = yield gridfs_1.default.getFileStream(filename);
        stream.pipe(res);
    }
    catch (err) {
        res.status(404).json({ success: false, message: 'File not found' });
    }
}));
// api routes
app.use("/api/v1", routes_1.default);
// api documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// handle error
app.use(globalErrorHandler_1.default);
app.use(notFoundHandler_1.default);
exports.default = app;
