import bcrypt from "bcryptjs";
import { pool } from "../../database/db";


const createUserIntoDB=async(payload:Record<string,unknown>)=>{
 const { name, email, password, phone, role } = payload;

const hashPassword=await bcrypt.hash(password as string,12)

    const result = await pool.query(
      `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, hashPassword, phone, role]
    );

    delete result.rows[0].password;
    
    return result;
}

export const userServices={
    createUserIntoDB
}