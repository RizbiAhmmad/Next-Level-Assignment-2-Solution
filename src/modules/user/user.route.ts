import { Router } from "express";
import { userController } from "./user.controller";
import verify from "../../middleware/verify";

const router =Router();
router.post('/',verify, userController.createUser)

export const userRoute = router