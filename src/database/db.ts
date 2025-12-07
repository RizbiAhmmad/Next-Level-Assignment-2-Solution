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
            role VARCHAR(100) NOT NULL CHECK (role IN ('admin', 'customer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);

await pool.query(`
    CREATE TABLE IF NOT EXISTS Vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(200) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('car','bike','van','SUV')),
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) NOT NULL CHECK (availability_status IN ('available','booked')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`);

await pool.query(`
    CREATE TABLE IF NOT EXISTS Bookings (
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES Vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price INT NOT NULL CHECK (total_price > 0),
        status VARCHAR(50) NOT NULL CHECK (status IN ('active','cancelled','returned')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`);

    console.log("Database Connected ");
}