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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            layer.addData(data);

            layer.eachLayer(function(featureLayer) {
                featureLayer.on('click', function(e) {
                    const properties = e.target.feature.properties;
                    const popupContent = createPopupContent(properties);
                    
                    // Verificar si el tipo es 'entidad'
                    if (properties.tipo === 'Entidad') {
                        // No hacer nada si es 'entidad'
                        console.log("No se muestra popup para tipo 'entidad'");
                        return; // Salir de la función si es 'entidad'
                    }

                    // Crear el popup
                    const popup = e.target.bindPopup(popupContent, {
                        maxWidth: 300,
                        className: 'custom-popup',
                        closeButton: false // Desactiva el botón de cierre predeterminado
                    }).openPopup();

                    // Esperar hasta que el popup se añada al DOM
                    setTimeout(() => {
                        // Añadir el evento de cierre al botón personalizado
                        document.querySelector('.custom-popup-close').addEventListener('click', function() {
                            e.target.closePopup();
                        });

                        // Añadir el evento para el botón de información
                        document.querySelector('#btnInfMap2').addEventListener('click', function(event) {
                            event.preventDefault();
                            if (infMap.classList.contains('d-none')) {
                                infMap.classList.add('show');
                                infMap.classList.remove('d-none');
                                mapContainer.classList.remove('col-lg-12');
                                mapContainer.classList.add('col-lg-8');
                                infMap.classList.add('col-lg-4');
                            }
                            updateInfMap(properties);
                            //mostrarPanelInfo(properties);
                        });
                    }, 100); // Esperar un corto periodo para asegurar que el popup está en el DOM
                    return;
                    
                });
            });

            if (addToMap) {
                map.addLayer(layer);
                if (alFrente) {
                    layer.bringToFront();
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar la capa:', error);
            alert(`Ocurrió un error al cargar los datos de la capa: ${error.message}`);
        });
}


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

