<?php

header('Content-Type: application/json');

// Habilitar el registro de errores en PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de la base de datos
$host = 'mxsig-db';  // Usar el nombre del servicio Docker
$port = '5432';
$dbname = 'mdm6data';
$user = 'postgres';
$password = 'postgres';

// Conectar a la base de datos
$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

// Verificar la conexión
if (!$conn) {
    echo json_encode(['error' => 'Unable to connect to the database']);
    exit;
}

// Obtener el nombre de la capa desde la URL
$layer = isset($_GET['layer']) ? $_GET['layer'] : '';

// Validar el nombre de la capa para evitar inyección SQL
$allowed_layers = ['entidad', 'municipios', 'localidades']; // Añade los nombres de capas permitidos
if (!in_array($layer, $allowed_layers)) {
    echo json_encode(['error' => 'Invalid layer specified']);
    pg_close($conn);
    exit;
}
// Aqui se realiza la consulta
// Construir la consulta SQL
$query = "SELECT ST_AsGeoJSON(ST_Transform(the_geom, 4326)) AS geojson FROM mg.$layer";

// Imprimir la consulta para depuración
error_log("Query: $query");

// Ejecutar la consulta
$result = pg_query($conn, $query);

// Verificar el resultado de la consulta
if (!$result) {
    echo json_encode(['error' => 'Query failed: ' . pg_last_error($conn)]);
    pg_close($conn);
    exit;
}

// Procesar los resultados de la consulta
$features = [];
while ($row = pg_fetch_assoc($result)) {
    $feature = json_decode($row['geojson'], true);
    $features[] = [
        'type' => 'Feature',
        'geometry' => $feature,
        'properties' => [] // Puedes agregar propiedades adicionales aquí si es necesario
    ];
}

// Devolver los datos en formato GeoJSON
echo json_encode([
    'type' => 'FeatureCollection',
    'features' => $features
]);

// Cerrar la conexión a la base de datos
pg_close($conn);
?>
