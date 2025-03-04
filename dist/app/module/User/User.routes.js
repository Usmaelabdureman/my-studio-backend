"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const User_controllers_1 = require("./User.controllers");
const fileUploader_1 = require("../../utils/fileUploader");
const validateFormData_1 = __importDefault(require("../../middlewares/validateFormData"));
const User_validations_1 = require("./User.validations");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.get("/", 
// auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
User_controllers_1.UserControllers.getUsers);
router.get("/profile", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.USER), User_controllers_1.UserControllers.getMe);
router.patch("/update-profile", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.USER), fileUploader_1.fileUploader.singleUpload.single("profile_pic"), (0, validateFormData_1.default)(User_validations_1.UserValidations.updateProfileValidationSchema), User_controllers_1.UserControllers.updateProfile);
router.patch("/update-user/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(User_validations_1.UserValidations.updateUserValidationSchema), User_controllers_1.UserControllers.updateUser);
router.delete("/delete", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), User_controllers_1.UserControllers.deleteUsers);
exports.UserRoutes = router;
