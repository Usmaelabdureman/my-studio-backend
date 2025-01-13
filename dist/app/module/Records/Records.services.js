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
exports.RecordsServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const common_1 = require("../../constants/common");
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const Records_constants_1 = require("./Records.constants");
const createRecord = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let month_uploaded = null;
    if (payload.month_uploaded)
        month_uploaded = new Date(payload.month_uploaded);
    const result = yield prisma_1.default.records.create({
        data: Object.assign(Object.assign({}, payload), { month_uploaded: month_uploaded }),
    });
    return result;
});
const getRecords = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder, id } = query, remainingQuery = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder", "id"]);
    if (sortBy) {
        (0, fieldValidityChecker_1.default)(Records_constants_1.dataManagementSortableFields, sortBy);
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
            OR: Records_constants_1.dataManagementSearchableFields.map((field) => {
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
    const result = yield prisma_1.default.records.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
    });
    const total = yield prisma_1.default.records.count({ where: whereConditons });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
const updateRecord = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.records.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return result;
});
const deleteRecords = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ids }) {
    const records = yield prisma_1.default.records.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    if (!(records === null || records === void 0 ? void 0 : records.length)) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No record found to delete");
    }
    const result = yield prisma_1.default.records.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    return {
        deleted_count: result.count,
        message: `${result.count} records deleted successfully`
    };
});
exports.RecordsServices = {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecords
};
