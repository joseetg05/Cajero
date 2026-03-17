const { sql, getConnection } = require('../db');

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
        if (error.originalError?.info?.message) {
            return res.status(400).json({ error: error.originalError.info.message });
        }
        res.status(500).json({ error: 'Error interno al procesar el retiro.' });
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
        if (error.originalError?.info?.message) {
            return res.status(400).json({ error: error.originalError.info.message });
        }
        res.status(500).json({ error: 'Error interno al procesar el depósito.' });
    }
};

const getTransactions = async (req, res) => {
    const { IdCuenta } = req.user;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('IdCuenta', sql.Int, IdCuenta);

        const result = await request.execute('sp_ConsultarMovimientos');

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al consultar movimientos.' });
    }
};

module.exports = {
    withdraw,
    deposit,
    getTransactions
};
