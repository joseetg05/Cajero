CREATE DATABASE Cajero

USE [Cajero]
GO

-- ============================================================
-- TABLAS
-- ============================================================

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Persona](
	[ID_PERSONA]       [int] IDENTITY(1,1) NOT NULL,
	[NOMBRE_COMPLETO]  [varchar](120) NOT NULL,
	[CEDULA]           [varchar](20)  NOT NULL,
	[FECHA_NACIMIENTO] [date]         NULL,
	[CORREO]           [varchar](40)  NULL,
PRIMARY KEY CLUSTERED ([ID_PERSONA] ASC),
UNIQUE NONCLUSTERED  ([CEDULA] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Cliente](
	[ID_CLIENTE] [int] IDENTITY(1,1) NOT NULL,
	[ID_PERSONA] [int] NOT NULL,
PRIMARY KEY CLUSTERED ([ID_CLIENTE] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Cuenta](
	[ID_CUENTA]          [int]          IDENTITY(1,1) NOT NULL,
	[IBAN]               [varchar](24)  NOT NULL,
	[SALDO_ACTUAL]       [decimal](18,2) NOT NULL DEFAULT (0.00),
	[MONEDA]             [varchar](4)   NULL       DEFAULT ('CRC'),
	[INTENTOS_RESTANTES] [int]          NULL       DEFAULT (3),
	[ID_CLIENTE]         [int]          NOT NULL,
PRIMARY KEY CLUSTERED ([ID_CUENTA] ASC),
UNIQUE NONCLUSTERED  ([IBAN] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Tarjeta](
	[ID_TARJETA]       [int]         IDENTITY(1,1) NOT NULL,
	[NUMERO_TARJETA]   [varchar](16) NOT NULL,
	[PIN]              [varchar](4)  NOT NULL,
	[FECHA_VENCIMIENTO][date]        NOT NULL,
	[ID_CUENTA]        [int]         NOT NULL,
PRIMARY KEY CLUSTERED ([ID_TARJETA] ASC),
UNIQUE NONCLUSTERED  ([NUMERO_TARJETA] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Tipo_Movimiento](
	[ID_TIPO_MOVIMIENTO] [int]         IDENTITY(1,1) NOT NULL,
	[DESCRIPCION]        [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED ([ID_TIPO_MOVIMIENTO] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Estado_Movimiento](
	[ID_ESTADO_MOVIMIENTO] [int]         IDENTITY(1,1) NOT NULL,
	[DESCRIPCION]          [varchar](30) NOT NULL,
PRIMARY KEY CLUSTERED ([ID_ESTADO_MOVIMIENTO] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Movimientos](
	[ID_MOVIMIENTO]        [int]           IDENTITY(1,1) NOT NULL,
	[ID_TIPO_MOVIMIENTO]   [int]           NOT NULL,
	[MONTO]                [decimal](18,2) NOT NULL,
	[ID_CUENTA]            [int]           NOT NULL,
	[FECHA_HORA]           [datetime]      NULL DEFAULT (GETDATE()),
	[MOTIVO]               [varchar](250)  NULL,
	[ID_ESTADO_MOVIMIENTO] [int]           NOT NULL,
PRIMARY KEY CLUSTERED ([ID_MOVIMIENTO] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Cliente]
    ADD FOREIGN KEY([ID_PERSONA]) REFERENCES [dbo].[Persona] ([ID_PERSONA]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Cuenta]
    ADD FOREIGN KEY([ID_CLIENTE]) REFERENCES [dbo].[Cliente] ([ID_CLIENTE])
GO
ALTER TABLE [dbo].[Tarjeta]
    ADD FOREIGN KEY([ID_CUENTA])  REFERENCES [dbo].[Cuenta]  ([ID_CUENTA])  ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Movimientos]
    ADD FOREIGN KEY([ID_CUENTA])            REFERENCES [dbo].[Cuenta]          ([ID_CUENTA])
GO
ALTER TABLE [dbo].[Movimientos]
    ADD FOREIGN KEY([ID_TIPO_MOVIMIENTO])   REFERENCES [dbo].[Tipo_Movimiento]  ([ID_TIPO_MOVIMIENTO])
GO
ALTER TABLE [dbo].[Movimientos]
    ADD FOREIGN KEY([ID_ESTADO_MOVIMIENTO]) REFERENCES [dbo].[Estado_Movimiento]([ID_ESTADO_MOVIMIENTO])
GO


INSERT INTO Tipo_Movimiento   (DESCRIPCION) VALUES ('Retiro');
INSERT INTO Tipo_Movimiento   (DESCRIPCION) VALUES ('Depósito');

INSERT INTO Estado_Movimiento (DESCRIPCION) VALUES ('Exitoso');
INSERT INTO Estado_Movimiento (DESCRIPCION) VALUES ('Pendiente');
INSERT INTO Estado_Movimiento (DESCRIPCION) VALUES ('Fondos Insuficientes');

INSERT INTO Persona (NOMBRE_COMPLETO, CEDULA, FECHA_NACIMIENTO, CORREO)
VALUES ('Juan Pérez García', '1-1234-5678', '1990-05-15', 'juan@email.com');

INSERT INTO Cliente (ID_PERSONA) VALUES (1);

INSERT INTO Cuenta (IBAN, SALDO_ACTUAL, MONEDA, INTENTOS_RESTANTES, ID_CLIENTE)
VALUES ('CR21015201001026287066', 500000.00, 'CRC', 3, 1);

INSERT INTO Tarjeta (NUMERO_TARJETA, PIN, FECHA_VENCIMIENTO, ID_CUENTA)
VALUES ('12345678', '1234', '2028-12-31', 1);
GO

CREATE PROCEDURE [dbo].[sp_LoginCajero]
    @NumeroTarjeta VARCHAR(16),
    @PIN           VARCHAR(4)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdTarjeta         INT;
    DECLARE @PinReal           VARCHAR(4);
    DECLARE @IntentosRestantes INT;
    DECLARE @FechaVencimiento  DATE;
    DECLARE @IdCuenta          INT;

    SELECT
        @IdTarjeta         = t.ID_TARJETA,
        @PinReal           = t.PIN,
        @FechaVencimiento  = t.FECHA_VENCIMIENTO,
        @IdCuenta          = t.ID_CUENTA,
        @IntentosRestantes = c.INTENTOS_RESTANTES
    FROM Tarjeta t
    INNER JOIN Cuenta c ON t.ID_CUENTA = c.ID_CUENTA
    WHERE t.NUMERO_TARJETA = @NumeroTarjeta;

    -- Tarjeta no existe
    IF @IdTarjeta IS NULL
    BEGIN
        SELECT 0 AS Exito, 'Tarjeta no encontrada o inválida.' AS Mensaje, NULL AS IdCuenta;
        RETURN;
    END

    -- Tarjeta bloqueada
    IF @IntentosRestantes <= 0
    BEGIN
        SELECT 0 AS Exito, 'Tarjeta bloqueada por exceso de intentos. Contacte a su banco.' AS Mensaje, NULL AS IdCuenta;
        RETURN;
    END

    -- Tarjeta vencida
    IF @FechaVencimiento < CAST(GETDATE() AS DATE)
    BEGIN
        SELECT 0 AS Exito, 'La tarjeta se encuentra vencida.' AS Mensaje, NULL AS IdCuenta;
        RETURN;
    END

    -- PIN incorrecto
    IF @PinReal <> @PIN
    BEGIN
        UPDATE Cuenta SET INTENTOS_RESTANTES = INTENTOS_RESTANTES - 1 WHERE ID_CUENTA = @IdCuenta;

        DECLARE @NuevosIntentos INT = @IntentosRestantes - 1;

        IF @NuevosIntentos = 0
            SELECT 0 AS Exito, 'PIN incorrecto. Tarjeta bloqueada por seguridad.' AS Mensaje, NULL AS IdCuenta;
        ELSE
            SELECT 0 AS Exito, 'PIN incorrecto. Le quedan ' + CAST(@NuevosIntentos AS VARCHAR) + ' intentos.' AS Mensaje, NULL AS IdCuenta;

        RETURN;
    END

    IF @IntentosRestantes < 3
        UPDATE Cuenta SET INTENTOS_RESTANTES = 3 WHERE ID_CUENTA = @IdCuenta;

    SELECT 1 AS Exito, 'Autenticación exitosa.' AS Mensaje, @IdCuenta AS IdCuenta;
END;
GO

-- Consultar saldo
-- Devuelve saldo, moneda, titular e IBAN de la cuenta.

CREATE PROCEDURE [dbo].[sp_ConsultarSaldo]
    @NumeroTarjeta VARCHAR(16),
    @PIN           VARCHAR(4)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PinReal VARCHAR(4);
    SELECT @PinReal = PIN FROM Tarjeta WHERE NUMERO_TARJETA = @NumeroTarjeta;

    IF @PinReal <> @PIN OR @PinReal IS NULL
    BEGIN
        PRINT 'Error: Autenticación fallida.';
        RETURN;
    END

    SELECT
        p.NOMBRE_COMPLETO AS Titular,
        c.IBAN            AS NumeroCuenta,
        c.SALDO_ACTUAL    AS SaldoDisponible,
        c.MONEDA          AS Moneda
    FROM Tarjeta t
    INNER JOIN Cuenta c  ON t.ID_CUENTA  = c.ID_CUENTA
    INNER JOIN Cliente cl ON c.ID_CLIENTE = cl.ID_CLIENTE
    INNER JOIN Persona p  ON cl.ID_PERSONA = p.ID_PERSONA
    WHERE t.NUMERO_TARJETA = @NumeroTarjeta;
END;
GO
-- Consultar información completa del cliente
--    Devuelve datos personales, cuenta, estado de tarjeta.

CREATE PROCEDURE [dbo].[sp_ConsultarInfoCliente]
    @NumeroTarjeta VARCHAR(16)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.NOMBRE_COMPLETO    AS Titular,
        p.CEDULA             AS Cedula,
        p.CORREO             AS Correo,
        c.IBAN               AS NumeroCuenta,
        c.MONEDA             AS Moneda,
        c.SALDO_ACTUAL       AS SaldoActual,
        t.FECHA_VENCIMIENTO  AS VencimientoTarjeta,
        CASE
            WHEN c.INTENTOS_RESTANTES <= 0                      THEN 'Bloqueada'
            WHEN t.FECHA_VENCIMIENTO < CAST(GETDATE() AS DATE)  THEN 'Vencida'
            ELSE 'Activa'
        END                  AS EstadoTarjeta,
        c.INTENTOS_RESTANTES AS IntentosRestantes
    FROM Tarjeta t
    INNER JOIN Cuenta c  ON t.ID_CUENTA   = c.ID_CUENTA
    INNER JOIN Cliente cl ON c.ID_CLIENTE  = cl.ID_CLIENTE
    INNER JOIN Persona p  ON cl.ID_PERSONA = p.ID_PERSONA
    WHERE t.NUMERO_TARJETA = @NumeroTarjeta;
END;
GO

-- Consultar movimientos de una cuenta
CREATE PROCEDURE [dbo].[sp_ConsultarMovimientos]
    @IdCuenta INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        m.ID_MOVIMIENTO,
        tm.DESCRIPCION AS Tipo,
        m.MONTO,
        m.FECHA_HORA,
        m.MOTIVO,
        em.DESCRIPCION AS Estado
    FROM Movimientos m
    INNER JOIN Tipo_Movimiento   tm ON m.ID_TIPO_MOVIMIENTO    = tm.ID_TIPO_MOVIMIENTO
    INNER JOIN Estado_Movimiento em ON m.ID_ESTADO_MOVIMIENTO  = em.ID_ESTADO_MOVIMIENTO
    WHERE m.ID_CUENTA = @IdCuenta
    ORDER BY m.FECHA_HORA DESC;

    SELECT
        tm.DESCRIPCION            AS TipoMovimiento,
        em.DESCRIPCION            AS Estado,
        COUNT(m.ID_MOVIMIENTO)    AS CantidadOperaciones,
        SUM(m.MONTO)              AS MontoTotal,
        AVG(m.MONTO)              AS MontoPromedio,
        MIN(m.MONTO)              AS MontoMinimo,
        MAX(m.MONTO)              AS MontoMaximo
    FROM Movimientos m
    INNER JOIN Tipo_Movimiento   tm ON m.ID_TIPO_MOVIMIENTO    = tm.ID_TIPO_MOVIMIENTO
    INNER JOIN Estado_Movimiento em ON m.ID_ESTADO_MOVIMIENTO  = em.ID_ESTADO_MOVIMIENTO
    WHERE m.ID_CUENTA = @IdCuenta
    GROUP BY tm.DESCRIPCION, em.DESCRIPCION
    ORDER BY tm.DESCRIPCION, em.DESCRIPCION;
END;
GO

-- Realizar depósito
CREATE PROCEDURE [dbo].[sp_RealizarDeposito]
    @NumeroTarjeta VARCHAR(16),
    @Monto         DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdCuenta INT;
    SELECT @IdCuenta = ID_CUENTA FROM Tarjeta WHERE NUMERO_TARJETA = @NumeroTarjeta;

    IF @IdCuenta IS NULL THROW 50000, 'Error: Tarjeta o cuenta no encontrada.', 1;
    IF @Monto <= 0       THROW 50000, 'Error: El monto a depositar debe ser mayor a cero.', 1;

    UPDATE Cuenta
    SET SALDO_ACTUAL = SALDO_ACTUAL + @Monto
    WHERE ID_CUENTA = @IdCuenta;

    INSERT INTO Movimientos (ID_TIPO_MOVIMIENTO, MONTO, ID_CUENTA, MOTIVO, ID_ESTADO_MOVIMIENTO)
    VALUES (2, @Monto, @IdCuenta, 'Depósito en cajero automático', 1);
END;
GO
-- Realizar retiro
CREATE PROCEDURE [dbo].[sp_RealizarRetiro]
    @NumeroTarjeta VARCHAR(16),
    @PIN           VARCHAR(4),
    @Monto         DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdCuenta         INT;
    DECLARE @SaldoActual      DECIMAL(18,2);
    DECLARE @PinReal          VARCHAR(4);
    DECLARE @FechaVencimiento DATE;

    SELECT
        @IdCuenta         = c.ID_CUENTA,
        @SaldoActual      = c.SALDO_ACTUAL,
        @PinReal          = t.PIN,
        @FechaVencimiento = t.FECHA_VENCIMIENTO
    FROM Tarjeta t
    INNER JOIN Cuenta c ON t.ID_CUENTA = c.ID_CUENTA
    WHERE t.NUMERO_TARJETA = @NumeroTarjeta;

    IF @IdCuenta IS NULL          THROW 50000, 'Error: Tarjeta no encontrada.', 1;
    IF @PinReal <> @PIN           THROW 50000, 'Error: PIN incorrecto.', 1;
    IF @FechaVencimiento < GETDATE() THROW 50000, 'Error: Tarjeta vencida.', 1;
    IF @Monto <= 0                THROW 50000, 'Error: El monto debe ser mayor a cero.', 1;

    IF @SaldoActual < @Monto
    BEGIN
        INSERT INTO Movimientos (ID_TIPO_MOVIMIENTO, MONTO, ID_CUENTA, MOTIVO, ID_ESTADO_MOVIMIENTO)
        VALUES (1, @Monto, @IdCuenta, 'Intento de retiro fallido', 3);
        THROW 50000, 'Error: Fondos insuficientes.', 1;
    END

    UPDATE Cuenta
    SET SALDO_ACTUAL = SALDO_ACTUAL - @Monto
    WHERE ID_CUENTA = @IdCuenta;

    INSERT INTO Movimientos (ID_TIPO_MOVIMIENTO, MONTO, ID_CUENTA, MOTIVO, ID_ESTADO_MOVIMIENTO)
    VALUES (1, @Monto, @IdCuenta, 'Retiro en cajero automático', 1);
END;
GO
