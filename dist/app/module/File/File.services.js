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
exports.FileServices = void 0;
const sharp_1 = __importDefault(require("sharp"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const supabase_1 = __importDefault(require("../../shared/supabase"));
const File_constants_1 = require("./File.constants");
const filesUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    const user = req.user;
    if (!((_a = files === null || files === void 0 ? void 0 : files.files) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new ApiError_1.default(httpStatus.BAD_REQUEST, "No file found");
    }
    const prepared_files = [];
    if (files === null || files === void 0 ? void 0 : files.files) {
        for (let i = 0; i < files.files.length; i++) {
            const file = files.files[i];
            if (!File_constants_1.allowedFileType.includes(file.mimetype)) {
                continue;
            }
            const name = `${Date.now()}-${file.originalname}`;
            const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
            const { data } = yield supabase_1.default.storage
                .from(config_1.default.supabase_bucket_general)
                .upload(name, file.buffer, {
                contentType: file.mimetype,
            });
            if (data === null || data === void 0 ? void 0 : data.id) {
                prepared_files.push({
                    user_id: user.id,
                    name: file.originalname,
                    alt_text: file.originalname.replace(/\.[^/.]+$/, ""),
                    type: file.mimetype,
                    size: file.size,
                    width: metadata.width || 0,
                    height: metadata.height || 0,
                    path: `/${config_1.default.supabase_bucket_general}/${data.path}`,
                    bucket_id: data.id,
                });
            }
        }
    }
    const uploaded_files = prepared_files.map((i) => i.path);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.file.createMany({
            data: prepared_files,
            skipDuplicates: true,
        });
        const files = yield prisma_1.default.file.findMany({
            where: {
                path: {
                    in: uploaded_files
                }
            },
            select: {
                name: true,
                path: true
            }
        });
        return files;
    }));
    return result;
});
exports.FileServices = {
    filesUpload
};
