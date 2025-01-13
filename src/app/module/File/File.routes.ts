import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { FileControllers } from "./File.controllers";

const router = Router();

router.post(
    "/upload",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
    fileUploader.multipleUpload,
    FileControllers.filesUpload
);

export const FileRoutes = router;
