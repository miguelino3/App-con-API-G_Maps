<?php
    require_once "conexionBD.php";
if (isset($_REQUEST['getMarkers'])) {
    $cnx = conexionBD::getConexion();
    $rutaReq = $_REQUEST['getMarkers'];
    $datos = [];

    $stm = $cnx->query("SELECT indice, latit, longit FROM marcadores WHERE nombreRuta LIKE '" . $rutaReq . "'");
    if ($stm->rowCount() > 0) {
        while ($arr = $stm->fetch(PDO::FETCH_ASSOC)) {
            /**
             *  $arr será
             *      'indice' => x,
             *      'latit' => x.00001,
             *      'longit' => y.00002
             */
            $datos[] = $arr;
        }
        echo json_encode($datos);
    } else {
        echo json_encode('0');
    }
}

if (isset($_REQUEST['getRutasName'])) {
    $cnx = conexionBD::getConexion();
    $nombrerutas = [];
    
    $stm = $cnx->query("SELECT DISTINCT nombreRuta FROM marcadores ORDER BY 1");
    if ($stm->rowCount() > 0) {
        while ($arr = $stm->fetch(PDO::FETCH_ASSOC)) {
            $nombrerutas[] = $arr['nombreRuta'];
        }
        echo json_encode($nombrerutas);
    } else {
        echo json_encode('0');
    }
}
if (isset($_REQUEST['borrarRuta'])) {
    $cnx = conexionBD::getConexion();
    $sql = "DELETE FROM marcadores WHERE nombreRuta LIKE '{$_REQUEST['borrarRuta']}'";

    $stm = $cnx->prepare($sql);
    if ($stm->execute() && $stm->rowCount() > 0) {
        echo json_encode('1');
    } else {
        echo json_encode('0');
    }
}

if (isset($_REQUEST['subirMarkers'])) {
    $cnx = conexionBD::getConexion();
    $nombreRuta = $_REQUEST['nombreRuta'];
    $marcadores = json_decode($_REQUEST['marcadores']);
    $contador = 0;
    $fallo = false;
    try {
        foreach ($marcadores as $marker) {
        $latLng = explode('x', $marker);
        $sql = "INSERT INTO marcadores VALUES(null, '{$nombreRuta}', '{$contador}', '{$latLng[0]}', '{$latLng[1]}')";
        $stm = $cnx->prepare($sql);
        if (!$stm->execute()) {
            //si se ha fallado al insertar campos, salimos del bucle
            $fallo = true;
            break;
        }
        $contador++;
        //Si no ha fallado, seguimos insertando marcadores
    }
    if ($fallo) {
        echo json_encode('0');
    } else {
        echo json_encode('1');
    }
    } catch (PDOException $ex) {
        echo json_encode($ex->getMessage());
    }
    
}