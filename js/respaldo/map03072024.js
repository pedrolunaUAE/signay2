let legendControl; // Variable global para almacenar la instancia de la leyenda
let municipioLayer; // Variable global para almacenar la capa de Municipios



// Inicializa el mapa centrado en Nayarit con control de zoom desactivado
const map = L.map('map', {
    zoomControl: false // Desactiva el control de zoom por defecto
}).setView([21.87, -104.85], 8); // Coordenadas de Nayarit

// Añade una capa de mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Añade un control de zoom personalizado en la posición superior derecha
L.control.zoom({
    position: 'topright'
}).addTo(map);


/**
 * Carga una capa desde una URL y la añade al mapa.
 * @param {object} layer - La capa a añadir.
 * @param {string} url - La URL desde donde cargar los datos de la capa.
 * @param {boolean} addToMap - Si se debe añadir la capa al mapa.
 * @param {boolean} alFrente - Si se debe traer la capa al frente del mapa.
 * @param {string} label - Etiqueta de la capa.
 */
function loadLayer(layer, url, addToMap, alFrente, label) {
    // Mostrar indicador de carga
    document.getElementById('loadingIndicator').style.display = 'inline';

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
                const properties = featureLayer.feature.properties;
                
                if (properties.tipo === 'Entidad') {
                    updateInfMap(properties);
                }

                if (properties.tipo === 'Municipio') {
                    municipioLayer = layer; // Almacenar la capa de Municipios
                }

                featureLayer.on('click', function(e) {
                    updateInfMap(properties);
                });
            });

            if (addToMap) {
                map.addLayer(layer); // Agregar la capa al mapa
                if (alFrente) {
                    layer.bringToFront(); // Traer la capa al frente
                }
            }

            // Ocultar indicador de carga después de cargar la capa
            document.getElementById('loadingIndicator').style.display = 'none';
        })
        .catch(error => {
            console.error('Error al cargar la capa:', error);
            alert(`Ocurrió un error al cargar los datos de la capa: ${error.message}`);
            document.getElementById('loadingIndicator').style.display = 'none';
        });
}

/**
 * Recorre el árbol de capas y ejecuta una función de callback en cada nodo hoja que contiene una capa.
 * @param {object} node - Nodo del árbol de capas.
 * @param {function} callback - Función a ejecutar en cada nodo hoja.
 */
function traverseTree(node, callback) {
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseTree(child, callback));
    } else if (node.layer) {
        callback(node);
    }
}

/**
 * Carga las capas en el orden definido por su prioridad.
 * @param {object} layersTree - Árbol de capas.
 */
function cargarCapasEnOrden(layersTree) {
    const layers = [];

    traverseTree(layersTree, node => {
        if (node.layer && node.url) {
            layers.push(node);
        }
    });

    layers.sort((a, b) => a.priority - b.priority);

    // Implementar carga diferida
    let index = 0;
    function loadNextLayer() {
        if (index < layers.length) {
            const layerConfig = layers[index];
            loadLayer(layerConfig.layer, layerConfig.url, layerConfig.addToMap, layerConfig.alFrente);
            index++;
            // Cargar la siguiente capa después de un pequeño retraso para no bloquear la interfaz
            setTimeout(loadNextLayer, 50);
        }
    }

    loadNextLayer();
}

// Llamar a la función para cargar las capas en el orden deseado
cargarCapasEnOrden(layersTree);

/**
 * Gestiona la prioridad de las capas activas, trayéndolas al frente en el orden correcto.
 * @param {array} layers - Capas activas.
 */
function manageLayerPriority(layers) {
    const sortedLayers = layers.sort((a, b) => a.priority - b.priority);

    sortedLayers.forEach(layerConfig => {
        if (map.hasLayer(layerConfig.layer)) {
            layerConfig.layer.bringToFront();
        }
    });
}

// Evento que se dispara cuando se agrega una capa al mapa
map.on('layeradd', function(e) {
    const activeLayers = [];

    traverseTree(layersTree, node => {
        if (map.hasLayer(node.layer)) {
            activeLayers.push(node);
        }
    });

    manageLayerPriority(activeLayers);
    updateLegend(activeLayers); // Actualiza la leyenda con las capas activas
});

// Evento que se dispara cuando se elimina una capa del mapa
map.on('layerremove', function(e) {
    const activeLayers = [];

    traverseTree(layersTree, node => {
        if (map.hasLayer(node.layer)) {
            activeLayers.push(node);
        }
    });

    manageLayerPriority(activeLayers);
    updateLegend(activeLayers); // Actualiza la leyenda con las capas activas
});

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


// Crear una nueva instancia del control de leyenda
legendControl = L.control({ position: 'bottomright' });

/**
 * Actualiza la leyenda del mapa en función de las capas activas y los estilos dinámicos.
 * @param {array} activeLayers - Capas activas en el mapa.
 * @param {boolean} includePobMunLegend - Indica si se debe incluir la configuración de la leyenda de población.
 */
function updateLegend(activeLayers, includePobMunLegend = false) {
 
    legendControl.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <h6><b>Simbología</b></h6>
            <div class="legend-item" style="margin-bottom: 5px;">
                <button class="collapse-button" onclick="toggleLegendSection('pobMunLegend')">Estratos de Población total</button>
            </div>
        `;

         div.innerHTML += `<div id="pobMunLegend" class="legend-section" style="display: none;"> `;
    
            // Agregar la configuración de la leyenda basada en los estratos de población si se requiere
            if (includePobMunLegend) {
                const pobMunLegendConfig = getPobMunLegendConfig();
                pobMunLegendConfig.forEach(item => {
                    div.innerHTML += `
                    <div class="legend-item" style="margin-bottom: 5px;">
                        <i style="background: ${item.color}; opacity: 0.6; border: 1px solid black;"></i> ${item.label}
                    </div>`;
                });
            }
    
            div.innerHTML += `</div>`; // Cerrar el div pobMunLegend aquí, después de agregar todos los items
    
        // Agregar las capas activas a la leyenda
        activeLayers.forEach(layer => {
            const style = getLayerStyles(layer.layer);

            if (style) {
                div.innerHTML += `
                <div class="legend-item" style="margin-bottom: 5px;">
                    <i style="border: 1px solid ${style.color};"></i> 
                    ${layer.label || 'Categoría'}
                </div>`;
            }
        });

        div.innerHTML += `</div>`;
        return div;
    };

    legendControl.addTo(map); // Añade el nuevo control de leyenda al mapa
}

/**
 * Obtiene los estilos de una capa.
 * @param {object} layer - La capa de la que se quiere obtener los estilos.
 * @returns {object} - Objeto con las propiedades de estilo.
 */
function getLayerStyles(layer) {
    if (layer && layer.options && layer.options.style) {
        return layer.options.style;
    }
    return null; // Devolvemos null si no se puede obtener el estilo
}

/**
 * Función para colapsar/expandir una sección de la leyenda.
 * @param {string} sectionId - El ID de la sección a colapsar/expandir.
 */
function toggleLegendSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

/**
 * Actualiza el estilo de la capa de municipios y actualiza la leyenda del mapa.
 */
function updateLayerStyle() {
    if (municipioLayer) {
        municipioLayer.setStyle(getStylePobMun); // Aplicar nuevo estilo a la capa de municipios

        const activeLayers = [];
        traverseTree(layersTree, node => {
            if (map.hasLayer(node.layer) && node.addToMap) {
                activeLayers.push(node);
            }
        });

        updateLegend(activeLayers, true); // Actualizar la leyenda con los estilos actualizados y añadir la configuración de población
    }
}