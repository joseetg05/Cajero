const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Adjunta datos de cuenta y credenciales para uso en controladores (ej: sp_ConsultarSaldo)
        req.user = { 
            IdCuenta: decoded.IdCuenta,
            tarjeta: decoded.tarjeta,
            pin: decoded.pin
        }; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
