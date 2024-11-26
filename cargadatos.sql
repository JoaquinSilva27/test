-- Drop all triggers
BEGIN
    FOR tr IN (SELECT trigger_name FROM user_triggers) LOOP
        EXECUTE IMMEDIATE 'DROP TRIGGER ' || tr.trigger_name;
    END LOOP;
END;
/
-- Drop all procedures
BEGIN
    FOR p IN (SELECT object_name FROM user_objects WHERE object_type = 'PROCEDURE') LOOP
        EXECUTE IMMEDIATE 'DROP PROCEDURE ' || p.object_name;
    END LOOP;
END;
/
-- Drop all functions
BEGIN
    FOR f IN (SELECT object_name FROM user_objects WHERE object_type = 'FUNCTION') LOOP
        EXECUTE IMMEDIATE 'DROP FUNCTION ' || f.object_name;
    END LOOP;
END;
/
-- Drop all sequences
BEGIN
    FOR s IN (SELECT sequence_name FROM user_sequences) LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
    END LOOP;
END;
/

-- Drop all tables
BEGIN
    FOR t IN (SELECT table_name FROM user_tables) LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
    END LOOP;
END;
/









begin
	AGREGAR_REGIONES('LORSON PAIS');
    AGREGAR_REGIONES('PAIS naiko');
	AGREGAR_DIRECCIONES('LORSON CALLE',777);
    AGREGAR_DIRECCIONES('CALLE naiko',666);
	AGREGAR_COMUNAS('LORSON COMUNA',1,1);
    AGREGAR_COMUNAS('COMUNA naiko',2,2);
    --
   	AGREGAR_TIPO_CUOTAS('ORDINARIA',1000);
	AGREGAR_TIPO_CUOTAS('EXTRA ORDINARIA',2000);
	AGREGAR_SERVICIOS('COMEDOR DE PAN');
    AGREGAR_SERVICIOS('lamedor DE pan');
	AGREGAR_CUOTAS(1,0,'01-01-2025',1);
    AGREGAR_CUOTAS(2,0,'01-01-2025',2);
    --
    AGREGAR_USUARIOS(1,'nicolas','user','MONTAMINOS','URETRA',1,'LORONSONLAND@GMAIL.COM',1111,1,0);
    AGREGAR_USUARIOS(2,'nicolas','admin','robles','alargado',1,'sadpapu@GMAIL.COM',666,2,0);
    AGREGAR_PREDIOS(5,50,0,1);
    AGREGAR_PREDIOS(6,125,0,2);
    --
    AGREGAR_SUBZONAS('PIEZA DE LORSON');
	AGREGAR_ZONAS('CASA DE LORSON',1,1);
	AGREGAR_SECTORES('POBLACION DE LORSON',1);
    AGREGAR_SUBZONAS('PIEZA DE naiko');
	AGREGAR_ZONAS('CASA DE naiko',2,2);
	AGREGAR_SECTORES('POBLACION DE naiko(rankagua)',2);
	--
	AGREGAR_CANALES('canal DE LORSON',50,1);
	AGREGAR_DIRECTIVAS('COME PANES',1);
	AGREGAR_PRESIDENTES('NICOLAS','MONTAMINOS','URETRA',1);
    AGREGAR_CANALES('canal DE naiko',100,2);
	AGREGAR_DIRECTIVAS('COME burguer',2);
	AGREGAR_PRESIDENTES('NICOLAS','sadnikaido','aña',2);
	--
	VINCULAR_PREDIO_CANALES(1,1,1);
    VINCULAR_PREDIO_CANALES(1,2,2);
    --
    AGREGAR_PROYECTOS('FABRICA LADRILLOS','UNA FABRICA LADRILLOS','01-01-2024','01-01-2025','ACTIVO',1);
	AGREGAR_COMPUERTAS(255,'PUERTA DEL BAÑO DE LORSON',1);
	AGREGAR_CELADORES('NICOLITO','MONTAMINOS','IMBECIL',1);
    AGREGAR_PROYECTOS('FABRICA monster','UNA FABRICA de mosnter','01-01-2024','01-01-2025','inactivo',2);
	AGREGAR_COMPUERTAS(2565,'guitalla naiko',2);
	AGREGAR_CELADORES('naikolito','aña','rodriguez',2);
	--
end;

begin
	AGREGAR_REGIONES('Maule norte');
    AGREGAR_REGIONES('Maule sur');
    AGREGAR_REGIONES('Maule centro');
    AGREGAR_REGIONES('Bernardo O Higgins');
	AGREGAR_DIRECCIONES('24 norte',3452);
    AGREGAR_DIRECCIONES('calle aurora',325);
    AGREGAR_DIRECCIONES('arturo pratt',777);
    AGREGAR_DIRECCIONES('las aguas',424);
	AGREGAR_COMUNAS('talca',1,1);
    AGREGAR_COMUNAS('linares',2,2);
    AGREGAR_COMUNAS('colbun',3,3);
    AGREGAR_COMUNAS('rancagua',4,4);
    --
   	AGREGAR_TIPO_CUOTAS('ORDINARIA',1000);
	AGREGAR_TIPO_CUOTAS('ORDINARIA',2000);
    AGREGAR_TIPO_CUOTAS('ORDINARIA',3000);
	AGREGAR_TIPO_CUOTAS('EXTRA ORDINARIA',2000);
	AGREGAR_SERVICIOS('mantenimiento de canal');
    AGREGAR_SERVICIOS('mantenimiento de compuerta');
    AGREGAR_SERVICIOS('limpieza de canal');
    AGREGAR_SERVICIOS('limpieza de compuerta');
	AGREGAR_CUOTAS(1,0,'01-01-2025',1);
    AGREGAR_CUOTAS(2,0,'01-01-2025',2);
    AGREGAR_CUOTAS(3,0,'01-01-2025',3);
    AGREGAR_CUOTAS(4,0,'01-01-2025',4);
    --
    AGREGAR_USUARIOS(211899085,'sergio','user','arellano','varas',2,'sergio.arellano.01@alu.ucm.cl',962115452,1,0);
    AGREGAR_USUARIOS(212239828,'juan','user','ortiz','cancino',2,'juan.ortiz@alu.ucm.cl',996730408,2,0);
    AGREGAR_USUARIOS(213045369,'joaquin','admin','silva','rodriguez',3,'joaquin.silva@alu.ucm.cl',973873670,3,0);
    AGREGAR_USUARIOS(210599746,'nicolas','user','robles','alarcon',4,'nicolas.robles@alu.ucm.cl',966704954,4,0);
    AGREGAR_PREDIOS(5,10,0,211899085);
    AGREGAR_PREDIOS(15,40,0,212239828);
    AGREGAR_PREDIOS(35,60,0,210599746);
    AGREGAR_PREDIOS(50,100,0,210599746);
    --
    AGREGAR_SUBZONAS('lovalledor');
    AGREGAR_SUBZONAS('ramadillo');
    AGREGAR_SUBZONAS('lago negro');
    AGREGAR_SUBZONAS('cumpeo');
	AGREGAR_ZONAS('san dionisio',1,1);
    AGREGAR_ZONAS('donde el diablo perdio el poncho',2,2);
    AGREGAR_ZONAS('monte oscuro',3,3);
    AGREGAR_ZONAS('pudahuel',4,4);
	AGREGAR_SECTORES('anival bustos',1);
    AGREGAR_SECTORES('puesto norte',2);
    AGREGAR_SECTORES('juan gabriel',3);
    AGREGAR_SECTORES('camus',4);
	--
	AGREGAR_CANALES('teniente bello',50,1);
    AGREGAR_CANALES('lo prado',58,2);
    AGREGAR_CANALES('rio claro',102,3);
    AGREGAR_CANALES('malas penas',156,4);
	AGREGAR_DIRECTIVAS('directiva teniente bello',1);
    AGREGAR_DIRECTIVAS('directiva lo prado',2);
    AGREGAR_DIRECTIVAS('directiva rio claro',3);
    AGREGAR_DIRECTIVAS('directiva malas penas',4);
	AGREGAR_PRESIDENTES('NICOLAS','MONTecino','URrea',1);
    AGREGAR_PRESIDENTES('matias','espinoza','muños',2);
    AGREGAR_PRESIDENTES('juan','grabriel','campos',3);
    AGREGAR_PRESIDENTES('martin','verdugo','carvajal',4);
	--
	VINCULAR_PREDIO_CANALES(1,1,1);
    VINCULAR_PREDIO_CANALES(1,2,2);
    VINCULAR_PREDIO_CANALES(1,3,3);
    VINCULAR_PREDIO_CANALES(1,4,4);
    --
    AGREGAR_PROYECTOS('pavimentacion','pavimentacion de caminos circundantes','01-01-2024','01-10-2024','terminado',1);
    AGREGAR_PROYECTOS('expancion canal','ensanchamiento del canal','01-05-2024','20-12-2024','ACTIVO',2);
    AGREGAR_PROYECTOS('des acidificacion aguas','proyecto para reducir el ph del canal','16-02-2024','10-03-2024','terminado',3);
    AGREGAR_PROYECTOS('renovacion de compuertas','actualizacion de compuertas del canal','17-11-2024','15-01-2025','ACTIVO',4);
	AGREGAR_COMPUERTAS(10,'compuerta del canal teniente bello',1);
    AGREGAR_COMPUERTAS(26,'compuerta del canal lo prado',2);
	AGREGAR_COMPUERTAS(102,'compuerta del canal rio claro',3);
	AGREGAR_COMPUERTAS(75,'compuerta del canal malas penas',4);
	AGREGAR_CELADORES('matias','flores','crespo',1);
    AGREGAR_CELADORES('matias','flores','crespo',2);
    AGREGAR_CELADORES('matias','flores','crespo',3);
    AGREGAR_CELADORES('matias','flores','crespo',4);
	--
end;