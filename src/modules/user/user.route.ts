import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
// import verify from "../../middleware/verify";

const router =Router();
router.post('/', userController.createUser)
router.get('/',auth(Roles.admin), userController.getAllUser)
router.get('/singleuser',auth(Roles.admin, Roles.customer), userController.getSingleUser)

router.put("/:userId", auth(Roles.admin, Roles.customer), userController.updateUser);
router.delete("/:userId", auth(Roles.admin), userController.deleteUser);

export const userRoute = router