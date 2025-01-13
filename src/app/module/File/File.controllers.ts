import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { FileServices } from "./File.services";

const filesUpload = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await FileServices.filesUpload(req);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Files uploaded successfully",
        data: result,
    });
});


export const FileControllers = {
    filesUpload
}