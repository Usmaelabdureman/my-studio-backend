"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Campaign_controllers_1 = require("./Campaign.controllers");
const Campaign_validations_1 = require("./Campaign.validations");
const router = (0, express_1.Router)();
router.get("/", Campaign_controllers_1.CampaignControllers.getCampaigns);
router.post("/add-campaign", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Campaign_validations_1.CampaignValidations.createCampaignValidationSchema), Campaign_controllers_1.CampaignControllers.createCampaign);
router.delete("/delete", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Campaign_validations_1.CampaignValidations.deleteCampaignValidationSchema), Campaign_controllers_1.CampaignControllers.deleteCampaigns);
router.patch("/update/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Campaign_validations_1.CampaignValidations.updateCampaignValidationSchema), Campaign_controllers_1.CampaignControllers.updateCampaign);
exports.CampaignRoutes = router;
