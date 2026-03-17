const { getConnection, sql } = require('../db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { tarjeta, pin } = req.body;

    if (!tarjeta || !pin) {
        return res.status(400).json({ error: 'La tarjeta y el PIN son obligatorios' });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('NumeroTarjeta', sql.VarChar, tarjeta)
            .input('PIN', sql.VarChar, pin)
            .execute('sp_LoginCajero');

        const record = result.recordset[0];

        if (!record) {
            return res.status(500).json({ error: 'Error inesperado invocando a la base de datos' });
        }

        const { Exito, Mensaje, IdCuenta } = record;

        if (Exito === 1) {
            const token = jwt.sign(
                { IdCuenta, tarjeta, pin },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ token, idCuenta: IdCuenta, mensaje: Mensaje });
        } else {
            return res.status(401).json({ error: Mensaje });
        }
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    login
};
