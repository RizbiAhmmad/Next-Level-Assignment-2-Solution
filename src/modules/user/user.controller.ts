import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUserFromDB();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const email = req.user!.email;
    const result = await userServices.getSingleUserFromDB(email);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user!;
    const userId = Number(req.params.userId);

    if (loggedInUser.role === "customer" && loggedInUser.id !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You cannot update this user" });
    }

    const result = await userServices.updateUserIntoDB(userId, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user!;

    if (loggedInUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can delete users" });
    }

    const userId = Number(req.params.userId);

    await userServices.deleteUserFromDB(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
