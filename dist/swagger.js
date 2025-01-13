"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Wolf Studios",
        version: "1.0.0",
        description: "API documentation for Wolf Studios",
    },
    servers: [
        {
            url: "http://localhost:5003/api/v1",
            description: "Local Server",
        },
        {
            url: "https://wolf-studios-backend-phi.vercel.app/api/v1",
            description: "Deployed Server",
        },
    ],
    components: {
        securitySchemes: {
            AdminAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
            },
            UserAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
            },
        },
    },
};
const options = {
    swaggerDefinition,
    apis: ["./src/app/module/**/*.swagger.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
