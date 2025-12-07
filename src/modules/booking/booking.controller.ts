import { Request, Response } from "express";
import { bookingServices } from "./booking.service";


const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBookingIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    const id = req.user!.id;

    const result = await bookingServices.getAllBookingsFromDB(role, id);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    const id = req.user!.id;
    const bookingId = Number(req.params.bookingId);

    const result = await bookingServices.updateBookingIntoDB(
      bookingId,
      role,
      req.body.status,
      id
    );

    res.status(200).json({
      success: true,
      message:
        result.status === "returned"
          ? "Booking marked as returned. Vehicle is now available"
          : "Booking cancelled successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
