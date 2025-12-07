import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.createVehicleIntoDB(req.body);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.getAllVehiclesFromDB();

    return res.status(200).json({
      success: true,
      message: data.length ? "Vehicles retrieved successfully" : "No vehicles found",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is required",
      });
    }

    const data = await vehicleServices.getSingleVehicleFromDB(vehicleId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is required",
      });
    }

    const data = await vehicleServices.updateVehicleIntoDB(vehicleId, req.body);

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is required",
      });
    }

    await vehicleServices.deleteVehicleFromDB(vehicleId);

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
};
