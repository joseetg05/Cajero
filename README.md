# Cajero Automático — BancoCUC

Simulación de cajero automático (ATM).

## Requisitos Obligatorios
Es necesario tener instalado lo siguiente:
1. **Node.js y npm** (Descargar en [nodejs.org](https://nodejs.org/))
2. **SQL Server** (Express o superior) y **SSMS**
3. **ODBC Driver 17 for SQL Server**

---

##  Pasos para iniciar la aplicación

### 1. Base de Datos
1. Abre **SQL Server Management Studio (SSMS)**.
2. Abre y ejecuta el archivo `bd.sql` que está en la raíz del proyecto. Esto creará la base de datos `Cajero` y sus datos de prueba.

### 2. Backend (Servidor)
1. Abre una terminal en la carpeta `be`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tu conexión en el archivo `.env` (Servidor, Instancia y Nombre de BD).
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

### 3. Frontend (Interfaz)
1. Abre otra terminal en la carpeta `fe`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm run dev
   ```
4. Abre el enlace que aparece en la terminal (normalmente http://localhost:5173).

---

##  Datos de Acceso (Prueba)
*   **Tarjeta:** `12345678`
*   **PIN:** `1234`

---

##  Tecnologías usadas
*   **BD:** SQL Server (T-SQL, Stored Procedures)
*   **Backend:** Node.js, Express, JWT
*   **Frontend:** Vue.js 3, Pinia, Axios
