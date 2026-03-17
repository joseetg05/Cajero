require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const dbSettings = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER}\\${process.env.DB_INSTANCE};Database=${process.env.DB_NAME};Trusted_Connection=yes;`,
    driver: 'msnodesqlv8'
};

let pool;

const getConnection = async () => {
    try {
        if (!pool) {
            pool = new sql.ConnectionPool(dbSettings);
            await pool.connect();
        } else if (!pool.connected) {
             await pool.connect();
        }
        return pool;
    } catch (error) {
        pool = null; // Reset para reintento
        throw error;
    }
};

module.exports = {
    sql,
    getConnection
};
