const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Conectado' });
});

const { getConnection } = require('./src/db');
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    try {
        await getConnection();
        console.log('Conexión a DB exitosa');
    } catch (error) {
        console.error('Fallo al conectar a la base de datos en el inicio:', error);
    }
});
