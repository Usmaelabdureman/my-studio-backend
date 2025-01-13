import { CampaignStatus } from "@prisma/client";
import { z } from "zod";

const createCampaignValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required"),
      stakeholder: z.string().optional(),
      status: z
        .enum(Object.values(CampaignStatus) as [string, ...string[]])
        .default(CampaignStatus.PENDING),
      thumbnail: z.string().optional(),
      start_date: z.string().nullable().optional(),
      end_date: z.string().nullable().optional(),
      description: z.string().optional(),
      goal: z.string().optional(),
      partner_compensation: z
        .number()
        .min(0, "Partner compensation must be a positive number")
        .default(0),
      partner_deliverables: z.string().optional(),
      contributed_partners: z.string().optional(),
      prospected_partners: z.string().optional(),
      content_HQ: z.string().optional(),
      content_guidelines: z.string().optional(),
      image_inspiration: z.string().optional(),
      video_inspiration: z.string().optional(),
      content_engagement: z
        .number()
        .min(0, "Content engagement must be a positive number")
        .default(0),
      product_expense: z
        .number()
        .min(0, "Product expense must be a positive number")
        .default(0),
      partner_expense: z
        .number()
        .min(0, "Partner expense must be a positive number")
        .default(0),
      social_platforms: z.array(
        z.object({
          platform: z.string(),
          url: z.string(),
        })
      ),
    })
    .strict(),
});

const updateCampaignValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required").optional(),
      stakeholder: z.string().optional(),
      status: z
        .enum(Object.values(CampaignStatus) as [string, ...string[]])
        .optional(),
      thumbnail: z.string().optional(),
      start_date: z.string().nullable().optional(),
      end_date: z.string().nullable().optional(),
      description: z.string().optional(),
      goal: z.string().optional(),
      partner_compensation: z
        .number()
        .min(0, "Partner compensation must be a positive number")
        .optional(),
      partner_deliverables: z.string().optional(),
      contributed_partners: z.string().optional(),
      prospected_partners: z.string().optional(),
      content_HQ: z.string().optional(),
      content_guidelines: z.string().optional(),
      image_inspiration: z.string().optional(),
      video_inspiration: z.string().optional(),
      content_engagement: z
        .number()
        .min(0, "Content engagement must be a positive number")
        .optional(),
      product_expense: z
        .number()
        .min(0, "Product expense must be a positive number")
        .optional(),
      partner_expense: z
        .number()
        .min(0, "Partner expense must be a positive number")
        .optional(),
      social_platforms: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string(),
          })
        )
        .optional(),
    })
    .strict(),
});

const deleteCampaignValidationSchema = z.object({
  body: z
    .object({
      ids: z
        .array(
          z
            .string({ invalid_type_error: "Id should be a text" })
            .regex(
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
              "Invalid ID"
            )
        )
        .min(1, "Id is required"),
    })
    .strict(),
});

export const CampaignValidations = {
  createCampaignValidationSchema,
  updateCampaignValidationSchema,
  deleteCampaignValidationSchema,
};
