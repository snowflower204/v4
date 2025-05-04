import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456789",
  database: "dbreceipt",
};

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password } = body || {};

    // Simple validation (replace Zod)
    if (
      typeof email !== "string" ||
      !email.includes("@") ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT email, password FROM user WHERE email=?",
      [email]
    );
    await connection.end();

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: userWithoutPassword,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error: " + error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
