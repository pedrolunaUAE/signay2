<?php
// Configuración de la base de datos
$host = '127.0.0.1';
$port = '5432';
$dbname = 'mxsig';
$user = 'inegi';
$password = 'Secret.2020*';

function getDbConnection() {
    global $host, $port, $dbname, $user, $password;
    $conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
    if (!$conn) {
        die(json_encode(['error' => 'Unable to connect to the database']));
    }
    return $conn;
}
?>
