const sql = require('mssql');
const { getConnection } = require('../db');

const withdraw = async (req, res) => {
    const { idCuenta, monto } = req.body;

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

const deposit = async (req, res) => {
    const { idCuenta, monto } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('IdCuenta', sql.Int, idCuenta);
        request.input('Monto', sql.Decimal(18, 2), monto);

        // Ejecutar el procedimiento
        await request.execute('sp_RealizarDeposito');

        res.status(201).json({
            message: 'Depósito exitoso',
            montoDepositado: monto
        });

    } catch (error) {
        console.error('Error en deposit:', error);

        // Manejar el error proveniente de SQL Server
        if (error.originalError && error.originalError.info && error.originalError.info.message) {
            return res.status(400).json({ error: error.originalError.info.message });
        }

        res.status(500).json({ error: 'Error interno del servidor al procesar el depósito.' });
    }
};

module.exports = {
    withdraw,
    deposit
};
