"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createCampaignValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().min(1, "Name is required"),
        stakeholder: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(Object.values(client_1.CampaignStatus))
            .default(client_1.CampaignStatus.PENDING),
        thumbnail: zod_1.z.string().optional(),
        start_date: zod_1.z.string().nullable().optional(),
        end_date: zod_1.z.string().nullable().optional(),
        description: zod_1.z.string().optional(),
        goal: zod_1.z.string().optional(),
        partner_compensation: zod_1.z
            .number()
            .min(0, "Partner compensation must be a positive number")
            .default(0),
        partner_deliverables: zod_1.z.string().optional(),
        contributed_partners: zod_1.z.string().optional(),
        prospected_partners: zod_1.z.string().optional(),
        content_HQ: zod_1.z.string().optional(),
        content_guidelines: zod_1.z.string().optional(),
        image_inspiration: zod_1.z.string().optional(),
        video_inspiration: zod_1.z.string().optional(),
        content_engagement: zod_1.z
            .number()
            .min(0, "Content engagement must be a positive number")
            .default(0),
        product_expense: zod_1.z
            .number()
            .min(0, "Product expense must be a positive number")
            .default(0),
        partner_expense: zod_1.z
            .number()
            .min(0, "Partner expense must be a positive number")
            .default(0),
        social_platforms: zod_1.z.array(zod_1.z.object({
            platform: zod_1.z.string(),
            url: zod_1.z.string(),
        })),
    })
        .strict(),
});
const updateCampaignValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        stakeholder: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(Object.values(client_1.CampaignStatus))
            .optional(),
        thumbnail: zod_1.z.string().optional(),
        start_date: zod_1.z.string().nullable().optional(),
        end_date: zod_1.z.string().nullable().optional(),
        description: zod_1.z.string().optional(),
        goal: zod_1.z.string().optional(),
        partner_compensation: zod_1.z
            .number()
            .min(0, "Partner compensation must be a positive number")
            .optional(),
        partner_deliverables: zod_1.z.string().optional(),
        contributed_partners: zod_1.z.string().optional(),
        prospected_partners: zod_1.z.string().optional(),
        content_HQ: zod_1.z.string().optional(),
        content_guidelines: zod_1.z.string().optional(),
        image_inspiration: zod_1.z.string().optional(),
        video_inspiration: zod_1.z.string().optional(),
        content_engagement: zod_1.z
            .number()
            .min(0, "Content engagement must be a positive number")
            .optional(),
        product_expense: zod_1.z
            .number()
            .min(0, "Product expense must be a positive number")
            .optional(),
        partner_expense: zod_1.z
            .number()
            .min(0, "Partner expense must be a positive number")
            .optional(),
        social_platforms: zod_1.z
            .array(zod_1.z.object({
            platform: zod_1.z.string(),
            url: zod_1.z.string(),
        }))
            .optional(),
    })
        .strict(),
});
const deleteCampaignValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        ids: zod_1.z
            .array(zod_1.z
            .string({ invalid_type_error: "Id should be a text" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID"))
            .min(1, "Id is required"),
    })
        .strict(),
});
exports.CampaignValidations = {
    createCampaignValidationSchema,
    updateCampaignValidationSchema,
    deleteCampaignValidationSchema,
};
