"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordsValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createRecordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: "Title is required",
            invalid_type_error: "Title should be a text",
        })
            .min(1, "Title is required"),
        campaign: zod_1.z.string().optional(),
        product: zod_1.z.string().optional(),
        stakeholder: zod_1.z.string().optional(),
        posting_quality: zod_1.z.string().optional(),
        google_drive_files: zod_1.z.string().optional(),
        playbook_link: zod_1.z.string().optional(),
        uppromote_conversion: zod_1.z.number().int().min(0).default(0),
        asset_status: zod_1.z.string().optional(),
        month_uploaded: zod_1.z.string().nullable().optional(),
        REVO_pinterest: zod_1.z.string().default("not-posted"),
        pin_accounts_used: zod_1.z.string().default("not-posted"),
        pinterest_PIN_click: zod_1.z.number().int().min(0).default(0),
        pinterest_view: zod_1.z.number().int().min(0).default(0),
        REVO_instagram: zod_1.z.string().optional(),
        IG_like: zod_1.z.number().int().min(0).default(0),
        IG_comment: zod_1.z.number().int().min(0).default(0),
        IG_share: zod_1.z.number().int().min(0).default(0),
        IG_view: zod_1.z.number().int().min(0).default(0),
        IG_social_sets_used: zod_1.z.string().optional(),
        partner_IG_link: zod_1.z.string().optional(),
        REVO_twitter: zod_1.z.string().default("not-posted"),
        REVO_tiktok: zod_1.z.string().default("not-posted"),
        REVO_TT_view: zod_1.z.number().int().min(0).default(0),
        tiktok_accounts_used: zod_1.z.string().default("not-posted"),
        partner_tiktok_link: zod_1.z.string().default("not-posted"),
        partner_TT_like: zod_1.z.number().int().min(0).default(0),
        partner_TT_comments: zod_1.z.number().int().min(0).default(0),
        partner_TT_comment: zod_1.z.string().optional(),
        partner_TT_share: zod_1.z.number().int().min(0).default(0),
        partner_TT_view: zod_1.z.number().int().min(0).default(0),
        partner_TT_save: zod_1.z.number().int().min(0).default(0),
        TT_dummy_account_used: zod_1.z.string().optional(),
        YT_account_used: zod_1.z.string().default("not-posted"),
        partner_YT_link: zod_1.z.string().default("not-posted"),
        partner_YT_like: zod_1.z.number().int().min(0).default(0),
        partner_YT_comment: zod_1.z.number().int().min(0).default(0),
        partner_YT_view: zod_1.z.number().int().min(0).default(0),
        partner_YT_save: zod_1.z.number().int().min(0).default(0),
        REVO_clubrevo_youtube: zod_1.z.string().default("not-posted"),
        REVO_youtube: zod_1.z.string().default("not-posted"),
        YT_clubrevo_like: zod_1.z.number().int().min(0).default(0),
        YT_clubrevo_view: zod_1.z.number().int().min(0).default(0),
        YT_REVOMADIC_like: zod_1.z.number().int().min(0).default(0),
        YT_REVOMADIC_comment: zod_1.z.number().int().min(0).default(0),
        YT_REVOMADIC_share: zod_1.z.number().int().min(0).default(0),
        YT_REVOMADIC_view: zod_1.z.number().int().min(0).default(0),
        creator_status: zod_1.z.string().optional(),
        profile: zod_1.z.string().optional(),
        posting_status: zod_1.z
            .enum(Object.values(client_1.PostingStatus))
            .default(client_1.PostingStatus.NOT_POSTED),
        partner_hq: zod_1.z.string().optional(),
        portfolio: zod_1.z.string().optional(),
        contributed_engagement: zod_1.z.number().int().min(0).default(0),
        by_tags: zod_1.z.string().optional(),
        by_city: zod_1.z.string().optional(),
        AI_internet_search: zod_1.z.string().optional(),
        facilities_contributed_content: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        video: zod_1.z.string().optional()
    }),
});
const updateRecordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            invalid_type_error: "Title should be a text",
        })
            .optional(),
        campaign: zod_1.z.string().optional(),
        product: zod_1.z.string().optional(),
        stakeholder: zod_1.z.string().optional(),
        posting_quality: zod_1.z.string().optional(),
        google_drive_files: zod_1.z.string().optional(),
        playbook_link: zod_1.z.string().optional(),
        uppromote_conversion: zod_1.z.number().int().min(0).optional(),
        asset_status: zod_1.z.string().optional(),
        month_uploaded: zod_1.z.string().nullable().optional(),
        REVO_pinterest: zod_1.z.string().optional(),
        pin_accounts_used: zod_1.z.string().optional(),
        pinterest_PIN_click: zod_1.z.number().int().min(0).optional(),
        pinterest_view: zod_1.z.number().int().min(0).optional(),
        REVO_instagram: zod_1.z.string().optional(),
        IG_like: zod_1.z.number().int().min(0).optional(),
        IG_comment: zod_1.z.number().int().min(0).optional(),
        IG_share: zod_1.z.number().int().min(0).optional(),
        IG_view: zod_1.z.number().int().min(0).optional(),
        IG_social_sets_used: zod_1.z.string().optional(),
        partner_IG_link: zod_1.z.string().optional(),
        REVO_twitter: zod_1.z.string().optional(),
        REVO_tiktok: zod_1.z.string().optional(),
        REVO_TT_view: zod_1.z.number().int().min(0).optional(),
        tiktok_accounts_used: zod_1.z.string().optional(),
        partner_tiktok_link: zod_1.z.string().optional(),
        partner_TT_like: zod_1.z.number().int().min(0).optional(),
        partner_TT_comments: zod_1.z.number().int().min(0).optional(),
        partner_TT_comment: zod_1.z.string().optional(),
        partner_TT_share: zod_1.z.number().int().min(0).optional(),
        partner_TT_view: zod_1.z.number().int().min(0).optional(),
        partner_TT_save: zod_1.z.number().int().min(0).optional(),
        TT_dummy_account_used: zod_1.z.string().optional(),
        YT_account_used: zod_1.z.string().optional(),
        partner_YT_link: zod_1.z.string().optional(),
        partner_YT_like: zod_1.z.number().int().min(0).optional(),
        partner_YT_comment: zod_1.z.number().int().min(0).optional(),
        partner_YT_view: zod_1.z.number().int().min(0).optional(),
        partner_YT_save: zod_1.z.number().int().min(0).optional(),
        REVO_clubrevo_youtube: zod_1.z.string().optional(),
        REVO_youtube: zod_1.z.string().optional(),
        YT_clubrevo_like: zod_1.z.number().int().min(0).optional(),
        YT_clubrevo_view: zod_1.z.number().int().min(0).optional(),
        YT_REVOMADIC_like: zod_1.z.number().int().min(0).optional(),
        YT_REVOMADIC_comment: zod_1.z.number().int().min(0).optional(),
        YT_REVOMADIC_share: zod_1.z.number().int().min(0).optional(),
        YT_REVOMADIC_view: zod_1.z.number().int().min(0).optional(),
        creator_status: zod_1.z.string().optional(),
        profile: zod_1.z.string().optional(),
        posting_status: zod_1.z
            .enum(Object.values(client_1.PostingStatus))
            .optional(),
        partner_hq: zod_1.z.string().optional(),
        portfolio: zod_1.z.string().optional(),
        contributed_engagement: zod_1.z.number().int().min(0).optional(),
        by_tags: zod_1.z.string().optional(),
        by_city: zod_1.z.string().optional(),
        AI_internet_search: zod_1.z.string().optional(),
        facilities_contributed_content: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        video: zod_1.z.string().optional()
    }),
});
const deleteRecordsValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string({ invalid_type_error: "Id should be a text" }).regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID"), { message: "Array of ids is required" }).min(1, "Id is required")
    })
});
exports.RecordsValidations = {
    createRecordValidationSchema,
    updateRecordValidationSchema,
    deleteRecordsValidationSchema
};
