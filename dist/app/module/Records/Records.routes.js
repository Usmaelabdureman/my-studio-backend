"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordsRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Records_controllers_1 = require("./Records.controllers");
const Records_validations_1 = require("./Records.validations");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), Records_controllers_1.RecordsControllers.getRecords);
router.post("/add-record", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Records_validations_1.RecordsValidations.createRecordValidationSchema), Records_controllers_1.RecordsControllers.createRecord);
router.patch("/update-record/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Records_validations_1.RecordsValidations.updateRecordValidationSchema), Records_controllers_1.RecordsControllers.updateRecord);
router.delete("/delete-records", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Records_validations_1.RecordsValidations.deleteRecordsValidationSchema), Records_controllers_1.RecordsControllers.deleteRecords);
exports.RecordsRoutes = router;
