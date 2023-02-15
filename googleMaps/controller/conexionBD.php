<?php

/**
 * CLASE conexionBD
 *
 *  Se emplea para conectar a la base de datos; utiliza el método 'Singleton',
 *  que asegura que tan sólo haya UNA conexión a la BBDD por cada llamada.
 */
class conexionBD {
    //Constantes BBDD; cambiar segun el entorno
    private const USERNAME = 'root';
    private const PASSWD = '4321';
    private const BDNAME = 'rutasgm';
    private static $_instancia;

    public function __construct() {
        return new PDO('mysql:host=localhost;dbname=' . conexionBD::BDNAME, conexionBD::USERNAME, conexionBD::PASSWD);
    }

    public static function getConexion() {
        if (self::$_instancia == null) {
            try {
                self::$_instancia = new PDO('mysql:host=localhost;dbname=' . conexionBD::BDNAME, conexionBD::USERNAME, conexionBD::PASSWD);
            } catch (PDOException $ex) {
                $_SESSION['status'] = 'ERROR PDO: <span>' .  $ex->getMessage() . '</span>';
            }
            return self::$_instancia;
        } else {
            return self::$_instancia;
        }
    }

    public function __clone() {
        //Dejando esta función vacía, evitamos que se use la función
        //  clone() sobre instancias de este objeto
    }
    //Ya a partir de haber creado una instancia con esta clase,
    // podremos usar los métodos de los objetos PDO
}