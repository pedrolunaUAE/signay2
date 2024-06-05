const map = L.map('map').setView([21.87, -104.85], 8); // Coordenadas de Nayarit

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const baseLayers = {};
const overlays = {};
const loadedLayers = {};

// Función para asignar estilos basados en el nombre de la capa
function getLayerStyle(layerName) {
    switch (layerName) {
        case 'entidad':
            return {
                color: 'blue',
                weight: 3,
                opacity: 0.0
            };
        case 'municipios':
            return {
                color: 'red',
                weight: 2,
                opacity: 0.5,
                dashArray: '5, 5'
            };
        case 'localidades':
            return {
                color: 'green',
                weight: 2,
                opacity: 1,
                dashArray: '1, 5'
            };
        default:
            return {
                color: 'black',
                weight: 1,
                opacity: 1
            };
    }
}

// Función para cargar capas con nombre de capa como parámetro
function loadLayer(layerName, layerLabel) {
    fetch(`php/api.php?layer=${layerName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const layer = L.geoJSON(data, {
                style: getLayerStyle(layerName)
            });
            loadedLayers[layerName] = layer;
            overlays[layerLabel] = layer;
            layersControl.addOverlay(layer, layerLabel);
        })
        .catch(error => {
            console.error(`Error al cargar la capa ${layerName}:`, error);
            alert(`Ocurrió un error al cargar los datos de la capa ${layerName}.`);
        });
}

// Inicializa el control de capas vacío
const layersControl = L.control.layers(baseLayers, overlays, { position: 'topright' }).addTo(map);

// Cargar múltiples capas
loadLayer('entidad', 'Entidad');
loadLayer('municipios', 'Municipios');
loadLayer('localidades', 'Localidades');

// Evento para manejar la selección de capas en el dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        const layerName = this.getAttribute('data-layer');
        const layerLabel = this.innerText;
        if (loadedLayers[layerName]) {
            if (map.hasLayer(loadedLayers[layerName])) {
                map.removeLayer(loadedLayers[layerName]);
            } else {
                map.addLayer(loadedLayers[layerName]);
            }
        } else {
            loadLayer(layerName, layerLabel);
        }
    });
});