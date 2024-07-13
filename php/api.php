<?php

header('Content-Type: application/json');

require_once './dataconect.php';

// Conectar a la base de datos
$conn = getDbConnection();

// Obtener el nombre de la capa desde la URL
$layer = isset($_GET['layer']) ? $_GET['layer'] : '';
$tipo  = isset($_GET['tipo'])  ? $_GET['tipo'] : '';

// Definir la consulta basada en el valor de $tipoConsulta
if ($tipo === 'map') {
    $query = "SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geojson FROM $layer";
} else {
    $query = "SELECT * FROM $layer";
}


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

    // Crear un array properties excluyendo 'gid' y 'geojson'
    $properties = [];
    foreach ($row as $key => $value) {
        if ($key !== 'gid' && $key !== 'geojson' && $key !== 'geom') {
            $properties[$key] = $value;
        }
    }

    $features[] = [
        'type' => 'Feature',
        'geometry' => $feature,
        'properties' => $properties
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
