const sql = require('mssql');
const { getConnection } = require('../db');

const withdraw = async (req, res) => {
    const { idCuenta, monto } = req.body;

    // Validación de entrada
    if (!idCuenta) {
        return res.status(400).json({ error: 'El idCuenta es requerido.' });
    }

    if (monto === undefined || monto === null || typeof monto !== 'number' || monto <= 0) {
        return res.status(400).json({ error: 'El monto debe ser un valor numérico positivo y mayor a cero.' });
    }

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('IdCuenta', sql.Int, idCuenta);
        request.input('Monto', sql.Decimal(18, 2), monto);

        // Ejecutar el procedimiento
        const result = await request.execute('sp_RealizarRetiro');

        res.status(200).json({
            message: 'Retiro exitoso',
            montoRetirado: monto
        });

    } catch (error) {
        console.error('Error en withdraw:', error);

        // Manejar el error proveniente de SQL Server  (ej. Saldo insuficiente)
        if (error.originalError && error.originalError.info && error.originalError.info.message) {
            return res.status(400).json({ error: error.originalError.info.message });
        }

        res.status(500).json({ error: 'Error interno del servidor al procesar el retiro.' });
    }
};

module.exports = {
    withdraw
};
