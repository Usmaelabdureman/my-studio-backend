import { CampaignStatus } from "@prisma/client";

export type TCreateCampaignPayload = {
    name: string;
    stackholder?: string;
    status: CampaignStatus;
    thumbnail?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    goal?: string;
    partner_compensation: number;
    partner_deliverables?: string;
    contributed_partners?: string;
    prospected_partners?: string;
    content_HQ?: string;
    content_guidelines?: string;
    image_inspiration?: string;
    video_inspiration?: string;
    content_engagement: number;
    product_expense: number;
    partner_expense: number;
    social_platforms?: { platform: string, url: string }[]
}