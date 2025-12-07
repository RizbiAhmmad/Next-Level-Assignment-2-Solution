import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashPassword, phone, role]
  );

  delete result.rows[0].password;
  return result;
};

const getAllUserFromDB = async () => {
  return await pool.query(`SELECT id,name,email,phone,role FROM users`);
};

const getSingleUserFromDB = async (email: string) => {
  return await pool.query(
    `SELECT id,name,email,phone,role FROM users WHERE email=$1`,
    [email]
  );
};

const updateUserIntoDB = async (userId: number, payload: any) => {
  const { name, email, phone, role, password } = payload;

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }

  const result = await pool.query(
    `
    UPDATE users SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = COALESCE($4, role),
      password = COALESCE($5, password),
      updated_at = NOW()
    WHERE id = $6
    RETURNING id, name, email, phone, role
    `,
    [name, email, phone, role, hashedPassword, userId]
  );

  return result;
};

const deleteUserFromDB = async (userId: number) => {
  const activeBookings = await pool.query(
    `SELECT id FROM bookings WHERE customer_id=$1 AND status='active'`,
    [userId]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("User cannot be deleted — active bookings exist");
  }

  await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
  return true;
};

export const userServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
