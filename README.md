Vehicle Booking System – REST API

A complete Express.js + TypeScript API for user authentication, vehicle management, and booking operations.

📌 Live API URL: [https://assignment-2-solution.vercel.app/]

Features:
Authentication & Authorization

JWT-based login & protected routes

Role-based access control (Admin, Customer)

Secure password hashing

Middleware-based token verification

Vehicle Management:

Add new vehicles (admin only)

Get all available vehicles

Update vehicle status

Store vehicle type, price, and availability

Booking Module:

Create booking

Validate booking date & availability

Prevent cancelling once booking has started

Update booking status (active, cancelled, completed)

Get all bookings (admin & customer based on role)

Database:

NeonDB