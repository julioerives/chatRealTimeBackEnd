import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "chatRealTime"
});

export const getConnection = async () => {
    return await pool.getConnection();
};