// Definir los estilos de las capas directamente en el objeto layers
const layersTree = {
    label: 'Árbol de capas',
    children: [
        {
            label: 'Límites Geoestadísticos',
            children: [
                {
                    label: 'Entidad',
                    layer: L.geoJSON(null, { 
                        style: { 
                            color: 'red', 
                            fillColor: 'red',
                            weight: 2, 
                            opacity: 0.8, 
                            fillOpacity: 0,
                            dashArray: ''
                        }
                    }),
                    url: 'php/api.php?layer=sigee.v_ent&tipo=map',
                    addToMap: true,
                    alFrente:false,
                    priority: 1 // Baja prioridad, se muestra debajo de otros
                },
                {
                    label: 'Municipios',
                    layer: L.geoJSON(null, {
                         style: { 
                            color: '#000', 
                            fillColor: '#000',
                            weight: 1, 
                            opacity: 0.8, 
                            fillOpacity: 0,
                            dashArray: '5, 5', 
                        }
                    }),
                    url: 'php/api.php?layer=sigee.v_mun&tipo=map',
                    addToMap: true,
                    alFrente:false,
                    priority: 2 // Baja prioridad, se muestra debajo de otros
                },{
                    label: 'Localidades',
                    layer: L.geoJSON(null, { 
                        style: { 
                            color: 'green', 
                            weight: 2, 
                            opacity: 0.9, 
                            dashArray: '1, 5' 
                        }
                    }),
                    url: 'php/api.php?layer=sigee.v_loc&tipo=map',
                    addToMap: false,
                    alFrente:false,
                    priority: 3
                },
            ]
        },
        {
            label: 'Indicadores',
            children: [
            ]
        }
    ]
};
