import { PostingStatus } from "@prisma/client";
import { z } from "zod";

const createRecordValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title should be a text",
      })
      .min(1, "Title is required"),
    campaign: z.string().optional(),
    product: z.string().optional(),
    stakeholder: z.string().optional(),
    posting_quality: z.string().optional(),
    google_drive_files: z.string().optional(),
    playbook_link: z.string().optional(),
    uppromote_conversion: z.number().int().min(0).default(0),
    asset_status: z.string().optional(),
    month_uploaded: z.string().nullable().optional(),
    REVO_pinterest: z.string().default("not-posted"),
    pin_accounts_used: z.string().default("not-posted"),
    pinterest_PIN_click: z.number().int().min(0).default(0),
    pinterest_view: z.number().int().min(0).default(0),
    REVO_instagram: z.string().optional(),
    IG_like: z.number().int().min(0).default(0),
    IG_comment: z.number().int().min(0).default(0),
    IG_share: z.number().int().min(0).default(0),
    IG_view: z.number().int().min(0).default(0),
    IG_social_sets_used: z.string().optional(),
    partner_IG_link: z.string().optional(),
    REVO_twitter: z.string().default("not-posted"),
    REVO_tiktok: z.string().default("not-posted"),
    REVO_TT_view: z.number().int().min(0).default(0),
    tiktok_accounts_used: z.string().default("not-posted"),
    partner_tiktok_link: z.string().default("not-posted"),
    partner_TT_like: z.number().int().min(0).default(0),
    partner_TT_comments: z.number().int().min(0).default(0),
    partner_TT_comment: z.string().optional(),
    partner_TT_share: z.number().int().min(0).default(0),
    partner_TT_view: z.number().int().min(0).default(0),
    partner_TT_save: z.number().int().min(0).default(0),
    TT_dummy_account_used: z.string().optional(),
    YT_account_used: z.string().default("not-posted"),
    partner_YT_link: z.string().default("not-posted"),
    partner_YT_like: z.number().int().min(0).default(0),
    partner_YT_comment: z.number().int().min(0).default(0),
    partner_YT_view: z.number().int().min(0).default(0),
    partner_YT_save: z.number().int().min(0).default(0),
    REVO_clubrevo_youtube: z.string().default("not-posted"),
    REVO_youtube: z.string().default("not-posted"),
    YT_clubrevo_like: z.number().int().min(0).default(0),
    YT_clubrevo_view: z.number().int().min(0).default(0),
    YT_REVOMADIC_like: z.number().int().min(0).default(0),
    YT_REVOMADIC_comment: z.number().int().min(0).default(0),
    YT_REVOMADIC_share: z.number().int().min(0).default(0),
    YT_REVOMADIC_view: z.number().int().min(0).default(0),
    creator_status: z.string().optional(),
    profile: z.string().optional(),
    posting_status: z
      .enum(Object.values(PostingStatus) as [string, ...string[]])
      .default(PostingStatus.NOT_POSTED),
    partner_hq: z.string().optional(),
    portfolio: z.string().optional(),
    contributed_engagement: z.number().int().min(0).default(0),
    by_tags: z.string().optional(),
    by_city: z.string().optional(),
    AI_internet_search: z.string().optional(),
    facilities_contributed_content: z.string().optional(),
    image: z.string().optional(),
    video: z.string().optional()
  }),
});

const updateRecordValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        invalid_type_error: "Title should be a text",
      })
      .optional(),
    campaign: z.string().optional(),
    product: z.string().optional(),
    stakeholder: z.string().optional(),
    posting_quality: z.string().optional(),
    google_drive_files: z.string().optional(),
    playbook_link: z.string().optional(),
    uppromote_conversion: z.number().int().min(0).optional(),
    asset_status: z.string().optional(),
    month_uploaded: z.string().nullable().optional(),
    REVO_pinterest: z.string().optional(),
    pin_accounts_used: z.string().optional(),
    pinterest_PIN_click: z.number().int().min(0).optional(),
    pinterest_view: z.number().int().min(0).optional(),
    REVO_instagram: z.string().optional(),
    IG_like: z.number().int().min(0).optional(),
    IG_comment: z.number().int().min(0).optional(),
    IG_share: z.number().int().min(0).optional(),
    IG_view: z.number().int().min(0).optional(),
    IG_social_sets_used: z.string().optional(),
    partner_IG_link: z.string().optional(),
    REVO_twitter: z.string().optional(),
    REVO_tiktok: z.string().optional(),
    REVO_TT_view: z.number().int().min(0).optional(),
    tiktok_accounts_used: z.string().optional(),
    partner_tiktok_link: z.string().optional(),
    partner_TT_like: z.number().int().min(0).optional(),
    partner_TT_comments: z.number().int().min(0).optional(),
    partner_TT_comment: z.string().optional(),
    partner_TT_share: z.number().int().min(0).optional(),
    partner_TT_view: z.number().int().min(0).optional(),
    partner_TT_save: z.number().int().min(0).optional(),
    TT_dummy_account_used: z.string().optional(),
    YT_account_used: z.string().optional(),
    partner_YT_link: z.string().optional(),
    partner_YT_like: z.number().int().min(0).optional(),
    partner_YT_comment: z.number().int().min(0).optional(),
    partner_YT_view: z.number().int().min(0).optional(),
    partner_YT_save: z.number().int().min(0).optional(),
    REVO_clubrevo_youtube: z.string().optional(),
    REVO_youtube: z.string().optional(),
    YT_clubrevo_like: z.number().int().min(0).optional(),
    YT_clubrevo_view: z.number().int().min(0).optional(),
    YT_REVOMADIC_like: z.number().int().min(0).optional(),
    YT_REVOMADIC_comment: z.number().int().min(0).optional(),
    YT_REVOMADIC_share: z.number().int().min(0).optional(),
    YT_REVOMADIC_view: z.number().int().min(0).optional(),
    creator_status: z.string().optional(),
    profile: z.string().optional(),
    posting_status: z
      .enum(Object.values(PostingStatus) as [string, ...string[]])
      .optional(),
    partner_hq: z.string().optional(),
    portfolio: z.string().optional(),
    contributed_engagement: z.number().int().min(0).optional(),
    by_tags: z.string().optional(),
    by_city: z.string().optional(),
    AI_internet_search: z.string().optional(),
    facilities_contributed_content: z.string().optional(),
    image: z.string().optional(),
    video: z.string().optional()
  }),
});

const deleteRecordsValidationSchema = z.object({
  body: z.object({
    ids: z.array(z.string({ invalid_type_error: "Id should be a text" }).regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID"), { message: "Array of ids is required" }).min(1, "Id is required")
  })
});

export const RecordsValidations = {
  createRecordValidationSchema,
  updateRecordValidationSchema,
  deleteRecordsValidationSchema
};
