import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { sortOrderType } from "../../constants/common";
import ApiError from "../../error/ApiError";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import pagination from "../../utils/pagination";
import { slugGenerator } from "../../utils/slugGenerator";
import { campaignSearchableFields, campaignSortableFields } from "./Campaign.constants";
import { TCreateCampaignPayload } from "./Campaign.interfaces";

const createCampaign = async (user: TAuthUser, payload: TCreateCampaignPayload) => {
    const { start_date, end_date, ...rest } = payload;

    let startDate = null;
    let endDate = null;
    if (start_date) {
        startDate = new Date(start_date)
    }
    if (end_date) {
        endDate = new Date(end_date)
    }

    const result = await prisma.campaign.create({
        data: {
            ...rest,
            start_date: startDate,
            end_date: endDate,
            user_id: user.id,
            slug: slugGenerator(payload.name),
        }
    })
    return result
}

const getCampaigns = async (query: Record<string, any>) => {
    const { searchTerm, page, limit, sortBy, sortOrder, id, ...remainingQuery } =
        query;
    if (sortBy) {
        fieldValidityChecker(campaignSortableFields, sortBy);
    }
    if (sortOrder) {
        fieldValidityChecker(sortOrderType, sortOrder);
    }

    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
        page,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.CampaignWhereInput[] = [];

    if (id)
        andConditions.push({
            id: id,
        });

    if (searchTerm) {
        andConditions.push({
            OR: campaignSearchableFields.map((field) => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }

    if (Object.keys(remainingQuery).length) {
        Object.keys(remainingQuery).forEach((key) => {
            andConditions.push({
                [key]: remainingQuery[key],
            });
        });
    }

    const whereConditons = {
        AND: andConditions,
    };

    const result = await prisma.campaign.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        include: {
            created_by: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    contact_number: true,
                    profile_pic: true,
                    role: true
                }
            }
        }
    });

    const total = await prisma.campaign.count({ where: whereConditons });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
};

const updateCampaign = async (id: string, payload: Record<string, any>) => {
    if (payload?.name) {
        payload.slug = slugGenerator(payload.name)
    }
    if (payload?.start_date) {
        payload.start_date = new Date(payload.start_date)
    }
    if (payload?.end_date) {
        payload.end_date = new Date(payload.end_date)
    }

    const result = await prisma.campaign.update({
        where: {
            id
        },
        data: {
            ...payload
        }
    });

    return result
}

const deleteCampaigns = async ({ ids }: { ids: string[] }) => {
    const campaigns = await prisma.campaign.findMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    if (!campaigns?.length) {
        throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found")
    }
    const result = await prisma.campaign.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    return {
        deleted_count: result.count,
        message: `${result.count} campaign deleted successfully`
    }
}

export const CampaignServices = {
    createCampaign,
    getCampaigns,
    updateCampaign,
    deleteCampaigns
}