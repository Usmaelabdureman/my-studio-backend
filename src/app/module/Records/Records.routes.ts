import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { RecordsControllers } from "./Records.controllers";
import { RecordsValidations } from "./Records.validations";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  RecordsControllers.getRecords
);

router.post(
  "/add-record",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(RecordsValidations.createRecordValidationSchema),
  RecordsControllers.createRecord
);

router.patch(
  "/update-record/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(RecordsValidations.updateRecordValidationSchema),
  RecordsControllers.updateRecord
);

router.delete(
  "/delete-records",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(RecordsValidations.deleteRecordsValidationSchema),
  RecordsControllers.deleteRecords
);

export const RecordsRoutes = router;
