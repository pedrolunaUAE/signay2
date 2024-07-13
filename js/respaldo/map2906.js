let legendControl; // Variable global para almacenar la instancia de la leyenda
let municipioLayer; // Variable global para almacenar la capa de Municipios

function updateLayerStyle() {
    if (municipioLayer) {
        municipioLayer.setStyle(getStylePobMun); // Aplicar nuevo estilo a la capa de municipios

        // Obtener las capas activas del árbol de capas y actualizar la leyenda
        const activeLayers = [];
        traverseTree(layersTree, node => {
            if (map.hasLayer(node.layer) && node.addToMap) {
                activeLayers.push(node);
            }
        });

        updateLegend(layersTree, activeLayers); // Actualizar la leyenda con los estilos actualizados
    }
}

const map = L.map('map', {
    zoomControl: false // Desactiva el control de zoom por defecto
}).setView([21.87, -104.85], 8); // Coordenadas de Nayarit

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Añadir un control de zoom personalizado en la posición superior derecha
L.control.zoom({
    position: 'topright'
}).addTo(map);


// Cargar capas al mapa 

function loadLayer(layer, url, addToMap, alFrente, label) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Lanza un error si la respuesta no es OK
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            layer.addData(data);

            layer.eachLayer(function(featureLayer) {
                const properties = featureLayer.feature.properties;
                
                // Si la capa es entidad agrega los datos estatales
                if (properties.tipo === 'Entidad') {
                    updateInfMap(properties);
                }

                // Guarda la capa de 
                if (properties.tipo === 'Municipio') {
                    municipioLayer = layer; // Almacenar la capa de Municipios
                }

                featureLayer.on('click', function(e) {
                    updateInfMap(properties);
                });
            });

            if (addToMap) {
                map.addLayer(layer); // Agregar la capa al mapa solo si addToMap es true
                if (alFrente) {
                    layer.bringToFront(); // Traer la capa al frente
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar la capa:', error);
            alert(`Ocurrió un error al cargar los datos de la capa: ${error.message}`);
        });
}

// Carga las capas al mapa por orden de prioirdad
function cargarCapasEnOrden(layersTree) {
    const layers = [];

    function traverseTree(node) {
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => traverseTree(child));
        } else if (node.layer && node.url) {
            layers.push(node);
        }
    }

    traverseTree(layersTree);

    // Ordenar las capas por prioridad antes de cargarlas
    layers.sort((a, b) => a.priority - b.priority);

    layers.forEach(layerConfig => {
        loadLayer(layerConfig.layer, layerConfig.url, layerConfig.addToMap, layerConfig.alFrente);
    });

    // Inicialmente crear la leyenda solo con las capas activas
    updateLegend(layersTree,layers);
}

// Llamar a la función para cargar las capas en el orden deseado
cargarCapasEnOrden(layersTree);

//Ordena las capas por su prioridad y las trae al frente en el orden correcto.
function manageLayerPriority(layers) {
    // Ordena las capas en función de su propiedad 'priority' de menor a mayor.
    const sortedLayers = layers.sort((a, b) => a.priority - b.priority);

    // Para cada capa ordenada, verifica si está en el mapa y la trae al frente.
    sortedLayers.forEach(layerConfig => {
        if (map.hasLayer(layerConfig.layer)) {
            layerConfig.layer.bringToFront();
        }
    });
}

// Evento que se dispara cuando se agrega una capa al mapa.
map.on('layeradd', function(e) {
    const activeLayers = [];

    // Recorre el árbol de capas y agrega las capas activas al array `activeLayers`.
    traverseTree(layersTree, node => {
        if (map.hasLayer(node.layer)) {
            activeLayers.push(node);
        }
    });

    // Gestiona la prioridad de las capas activas.
    manageLayerPriority(activeLayers);

    // Actualiza la leyenda con las capas activas
    updateLegend(layersTree, activeLayers);
});

// Evento que se dispara cuando se elimina una capa del mapa.
map.on('layerremove', function(e) {
    const activeLayers = [];

    // Recorre el árbol de capas y agrega las capas activas al array `activeLayers`.
    traverseTree(layersTree, node => {
        if (map.hasLayer(node.layer)) {
            activeLayers.push(node);
        }
    });

    // Gestiona la prioridad de las capas activas.
    manageLayerPriority(activeLayers);

    // Actualiza la leyenda con las capas activas
    updateLegend(layersTree, activeLayers);
});

//Recorre el árbol de capas y ejecuta una función de callback en cada nodo hoja que contiene una capa.
function traverseTree(node, callback) {
     // Si el nodo tiene hijos, recorre cada uno de ellos.
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseTree(child, callback));
    } 
    
    // Si el nodo es una hoja y contiene una capa, ejecuta el callback.
    else if (node.layer) {
        callback(node);
    }
}

// Inicializar el control de capas en forma de árbol
const layersControl = L.control.layers.tree(null, layersTree, {
    collapsed: true, // Para que inicie colapsado
    namedToggle: true,
    selectorBack: false,
    closedSymbol: '&#8862; &#x1f5c0;', // Símbolo de cerrado
    openedSymbol: '&#8863; &#x1f5c1;', // Símbolo de abierto
    position: 'topleft', // Mueve el control al lado izquierdo superior
    collapseAllExpanded: false, // No expande todas las ramas al inicio
    expandAllCollapsed: true // Colapsa todas las ramas al inicio
}).addTo(map);

// Expandir solo la primera rama al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const firstBranch = document.querySelector('.leaflet-control-layers-list > li:first-child .leaflet-control-layers-toggle');
    if (firstBranch && !firstBranch.classList.contains('leaflet-control-layers-expanded')) {
        firstBranch.click(); // Expande la primera rama
    }
});




// Definicion de leyendas


// Actualiza las leyendas del mapa
function updateLegend(layersTree, layers) {
    const activeLayers = [];

    layers.forEach(layerConfig => {
        if (layerConfig.addToMap) {
            activeLayers.push(layerConfig);
        }
    });

    // Crear la leyenda solo con las capas activas
    const legends = activeLayers.map(layerConfig => {
        const { label, layer } = layerConfig;
        const style = layer.options.style;
        const dashArray = style.dashArray ? (typeof style.dashArray === 'string' ? style.dashArray.split(',').map(Number) : style.dashArray) : [];
        return {
            label: label,
            type: "polyline", // Ajusta según el tipo de geometría
            layers: [layer],
            color: style.color,
            weight: style.weight,
            dashArray: dashArray
        };
    });

    // Si ya existe una instancia de leyenda, remuévela del mapa
    if (legendControl) {
        legendControl.remove(map);
    }

    // Crear una nueva instancia de la leyenda
    legendControl = L.control.legend({
        position: 'bottomright',
        title: 'Simbología',
        legends: legends,
        elementType: 'div' // Especifica el tipo de contenedor HTML
    });

    // Añadir la leyenda al mapa
    legendControl.addTo(map);
}
