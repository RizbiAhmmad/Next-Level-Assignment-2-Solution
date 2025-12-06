import { Pool } from "pg";

export const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_vDj2VLOhw0qc@ep-silent-feather-af70l3qc-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
})

export const initDB = async()=>{
    await pool.query(`
        CREATE TABLE  IF NOT EXISTS Users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            email VARCHAR(200) NOT NULL UNIQUE CHECK (email = LOWER(email)),
            password TEXT NOT NULL CHECK (char_length(password) >= 6),
            phone VARCHAR(100) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);
    console.log("Database Connected ");
}