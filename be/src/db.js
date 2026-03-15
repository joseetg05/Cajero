require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const connString = `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER}\\${process.env.DB_INSTANCE};Database=${process.env.DB_NAME};Trusted_Connection=yes;Encrypt=yes;TrustServerCertificate=yes;`;

const dbSettings = {
    connectionString: connString
};

const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error('Error connectando a la base de datos:', error);
        throw error;
    }
};

module.exports = {
    sql,
    getConnection
};
