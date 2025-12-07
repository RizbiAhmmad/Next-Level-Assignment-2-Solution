import { pool } from "../../database/db";

const createBookingIntoDB = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleRes = await pool.query(
    `SELECT id, daily_rent_price, availability_status 
     FROM vehicles WHERE id=$1`,
    [vehicle_id]
  );

  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  if (end <= start) {
    throw new Error("End date must be after start date");
  }

  const diffDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const total_price = vehicle.daily_rent_price * diffDays;

  const bookingRes = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1,$2,$3,$4,$5,'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return bookingRes.rows[0];
};

const getAllBookingsFromDB = async (role: string, userId: number) => {
  if (role === "admin") {
    return await pool.query(`
      SELECT b.*, 
             u.name AS customer_name, u.email AS customer_email,
             v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);
  } else {
    return await pool.query(
      `
      SELECT b.*, 
             v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id=$1
      ORDER BY b.id DESC
      `,
      [userId]
    );
  }
};

const updateBookingIntoDB = async (bookingId: number, role: string, status: string, userId: number) => {

  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (role === "customer" && booking.customer_id !== userId) {
    throw new Error("Forbidden: You cannot modify others booking");
  }

  if (role === "customer") {
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("You cannot cancel booking after it has started");
    }

    await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );

    return { ...booking, status: "cancelled" };
  }

  if (role === "admin" && status === "returned") {
    await pool.query(
      `UPDATE bookings SET status='returned' WHERE id=$1`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );

    return { ...booking, status: "returned" };
  }

  throw new Error("Invalid booking update request");
};

export const bookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  updateBookingIntoDB,
};
