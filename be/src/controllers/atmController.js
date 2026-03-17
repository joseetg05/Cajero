const { sql, getConnection } = require('../db');

const withdraw = async (req, res) => {
    const { tarjeta, pin } = req.user;
    const { monto } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('NumeroTarjeta', sql.VarChar, tarjeta);
        request.input('PIN', sql.VarChar, pin);
        request.input('Monto', sql.Decimal(18, 2), monto);

        // Ejecutar el procedimiento
        await request.execute('sp_RealizarRetiro');

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
    const { tarjeta } = req.user;
    const { monto } = req.body;

    try {
        const pool = await getConnection();
        const request = pool.request();

        request.input('NumeroTarjeta', sql.VarChar, tarjeta);
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

const getBalance = async (req, res) => {
    const { tarjeta, pin } = req.user;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('NumeroTarjeta', sql.VarChar, tarjeta)
            .input('PIN', sql.VarChar, pin)
            .execute('sp_ConsultarSaldo');

        const record = result.recordset[0];
        if (!record) {
            return res.status(404).json({ error: 'Información de cuenta no encontrada.' });
        }

        res.status(200).json({
            saldo: record.SaldoDisponible,
            moneda: record.Moneda,
            titular: record.Titular,
            numeroCuenta: record.NumeroCuenta
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al consultar el saldo.' });
    }
};

const getTransactions = async (req, res) => {
    const { IdCuenta } = req.user;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('IdCuenta', sql.Int, IdCuenta)
            .execute('sp_ConsultarMovimientos');

        res.status(200).json({
            movimientos: result.recordsets[0],
            resumen: result.recordsets[1]
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al consultar movimientos.' });
    }
};

const getClientInfo = async (req, res) => {
    const { tarjeta } = req.user;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('NumeroTarjeta', sql.VarChar, tarjeta)
            .execute('sp_ConsultarInfoCliente');

        const record = result.recordset[0];
        if (!record) {
            return res.status(404).json({ error: 'Información del cliente no encontrada.' });
        }

        res.status(200).json({
            titular: record.Titular,
            cedula: record.Cedula,
            correo: record.Correo,
            iban: record.NumeroCuenta,
            moneda: record.Moneda,
            saldo: record.SaldoActual,
            vencimientoTarjeta: record.VencimientoTarjeta,
            estadoTarjeta: record.EstadoTarjeta,
            intentosRestantes: record.IntentosRestantes
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al consultar información del cliente.' });
    }
};

module.exports = {
    withdraw,
    deposit,
    getTransactions,
    getBalance,
    getClientInfo
};
