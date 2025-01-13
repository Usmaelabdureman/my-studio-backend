"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const common_1 = require("../../constants/common");
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const slugGenerator_1 = require("../../utils/slugGenerator");
const Campaign_constants_1 = require("./Campaign.constants");
const createCampaign = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { start_date, end_date } = payload, rest = __rest(payload, ["start_date", "end_date"]);
    let startDate = null;
    let endDate = null;
    if (start_date) {
        startDate = new Date(start_date);
    }
    if (end_date) {
        endDate = new Date(end_date);
    }
    const result = yield prisma_1.default.campaign.create({
        data: Object.assign(Object.assign({}, rest), { start_date: startDate, end_date: endDate, user_id: user.id, slug: (0, slugGenerator_1.slugGenerator)(payload.name) })
    });
    return result;
});
const getCampaigns = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder, id } = query, remainingQuery = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder", "id"]);
    if (sortBy) {
        (0, fieldValidityChecker_1.default)(Campaign_constants_1.campaignSortableFields, sortBy);
    }
    if (sortOrder) {
        (0, fieldValidityChecker_1.default)(common_1.sortOrderType, sortOrder);
    }
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const andConditions = [];
    if (id)
        andConditions.push({
            id: id,
        });
    if (searchTerm) {
        andConditions.push({
            OR: Campaign_constants_1.campaignSearchableFields.map((field) => {
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
    const result = yield prisma_1.default.campaign.findMany({
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
    const total = yield prisma_1.default.campaign.count({ where: whereConditons });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
const updateCampaign = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload === null || payload === void 0 ? void 0 : payload.name) {
        payload.slug = (0, slugGenerator_1.slugGenerator)(payload.name);
    }
    if (payload === null || payload === void 0 ? void 0 : payload.start_date) {
        payload.start_date = new Date(payload.start_date);
    }
    if (payload === null || payload === void 0 ? void 0 : payload.end_date) {
        payload.end_date = new Date(payload.end_date);
    }
    const result = yield prisma_1.default.campaign.update({
        where: {
            id
        },
        data: Object.assign({}, payload)
    });
    return result;
});
const deleteCampaigns = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ids }) {
    const campaigns = yield prisma_1.default.campaign.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    if (!(campaigns === null || campaigns === void 0 ? void 0 : campaigns.length)) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Campaign not found");
    }
    const result = yield prisma_1.default.campaign.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    return {
        deleted_count: result.count,
        message: `${result.count} campaign deleted successfully`
    };
});
exports.CampaignServices = {
    createCampaign,
    getCampaigns,
    updateCampaign,
    deleteCampaigns
};
