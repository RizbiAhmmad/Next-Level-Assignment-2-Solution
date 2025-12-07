import { pool } from "../../database/db";

const createVehicleIntoDB = async (payload: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `INSERT INTO Vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

const getAllVehiclesFromDB = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles ORDER BY id DESC`);
  return result.rows;
};

const getSingleVehicleFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [id]);
  return result.rows[0];
};

const updateVehicleIntoDB = async (id: string, payload: any) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (let key in payload) {
    fields.push(`${key}=$${index}`);
    values.push(payload[key]);
    index++;
  }

  const query = `UPDATE Vehicles SET ${fields.join(", ")} , updated_at=NOW() WHERE id=$${index} RETURNING *`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteVehicleFromDB = async (id: string) => {

  const check = await pool.query(
    `SELECT * FROM Bookings WHERE vehicle_id=$1 AND status='active'`,
    [id]
  );

  if (check.rows.length > 0) {
    throw new Error("Vehicle cannot be deleted because it has active bookings");
  }

  await pool.query(`DELETE FROM Vehicles WHERE id=$1`, [id]);
};

export const vehicleServices = {
  createVehicleIntoDB,
  getAllVehiclesFromDB,
  getSingleVehicleFromDB,
  updateVehicleIntoDB,
  deleteVehicleFromDB
};
