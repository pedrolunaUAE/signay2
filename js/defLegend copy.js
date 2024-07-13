/**
 * Devuelve una función de estilo para una entidad basada en sus propiedades y el tipo de dato.
 * @param {string} tipodato - El tipo de dato para determinar el estilo.
 * @returns {function} - Función que devuelve las propiedades de estilo para un feature.
 */
function getStyleDato(tipodato) {
    return function(feature) {
        const properties = feature.properties;
        let style;
        let color;
        switch (tipodato) {
            case 'pobmuntot':
                const pobtot = properties.pobtot; // Obtiene la propiedad 'pobtot' del feature
                // Determina el color basado en el valor de 'pobtot'
                if (pobtot <= 10000) {
                    color = '#E1EDF5'; // Estrato 1
                } else if (pobtot <= 50000) {
                    color = '#A3CADD'; // Estrato 2
                } else if (pobtot <= 100000) {
                    color = '#6498B7'; // Estrato 3
                } else if (pobtot <= 200000) {
                    color = '#1D526D'; // Estrato 4
                } else {
                    color = '#0F2A37'; // Estrato 5
                }

                // Define el estilo para 'pobmuntot'
                style = {
                    color: 'black', // Color del borde
                    weight: 1, // Grosor del borde
                    fillColor: color, // Color de relleno
                    fillOpacity: 0.6 // Opacidad del relleno
                };
                break;
            case 'despobmun':
                const despob= properties.den_pob_km2; // Obtiene la propiedad 'pobtot' del feature
                
                // Determina el color basado en el valor de 'pobtot'
                if (despob <= 50) {
                    color = '#F2E1F4'; // Estrato 1
                } else if (despob <= 100) {
                    color = '#D9A5E0'; // Estrato 2
                } else if (despob <= 250) {
                    color = '#C068CC'; // Estrato 3
                } else if (despob <= 500) {
                    color = '#A735B8'; // Estrato 4
                } else {
                    color = '#81388D'; // Estrato 5
                }

                // Define el estilo para 'despobmun'
                style = {
                    color: 'black', // Color del borde
                    weight: 1, // Grosor del borde
                    fillColor: color, // Color de relleno
                    fillOpacity: 0.6 // Opacidad del relleno
                };
                break;  
            case 'promEsco':
                const escolaridad = properties.edu_pesco; // Supongamos que 'escolaridad' es el dato relevante
                let color;

                if (escolaridad <= 6) {
                    color = '#E6E0F8'; // Clase 1
                } else if (escolaridad <= 9) {
                    color = '#C3B9EB'; // Clase 2
                } else if (escolaridad <= 16) {
                    color = '#A092DD'; // Clase 3
                } else if (escolaridad <= 16) {
                    color = '#7C6BCF'; // Clase 4
                } else {
                    color = '#664785'; // Clase 5 (más alto)
                }

                style = {
                    color: 'black',
                    weight: 1,
                    fillColor: color,
                    fillOpacity: 0.6
                };
                break;

            default:
                // Define un estilo por defecto para otros tipos de dato
                style = {
                    color: '#000', // Color del borde (negro)
                    fillColor: '#000', // Color de relleno (negro)
                    weight: 1, // Grosor del borde
                    opacity: 0.8, // Opacidad del borde
                    fillOpacity: 0 // Opacidad del relleno
                };
                break;
        }

        return style;
    };
}

/**
 * Devuelve la configuración de la leyenda para 'pobmun'.
 * @returns {array} - Array de objetos con etiquetas y colores para la leyenda.
 */
function getLegendConfig(tipodato) {

    switch (tipodato) {
        case 'pobmuntot':
            legendConfig = {
                title: 'Habitantes',
                style: [
                    { label: '≤ 10,000', color: '#E1EDF5' }, // Estrato 1
                    { label: '10,001 - 50,000', color: '#A3CADD' }, // Estrato 2
                    { label: '50,001 - 100,000', color: '#6498B7' }, // Estrato 3
                    { label: '100,001 - 200,000', color: '#1D526D' }, // Estrato 4
                    { label: '> 200,000', color: '#0F2A37' } // Estrato 5
                ]
            }
            break;
        case 'despobmun':
            legendConfig = {
                title: 'Dencidad de Población (hab/km2)',
                style: [
                    { label: '≤ 50',        color: '#F2E1F4' }, // Estrato 1
                    { label: '51 - 100',    color: '#D9A5E0' }, // Estrato 2
                    { label: '101 - 250',   color: '#B260C0' }, // Estrato 3
                    { label: '251 - 500', color: '#A735B8' }, // Estrato 4
                    { label: '> 500',     color: '#763381' } // Estrato 5
                ]
            }
            break;
        case 'promEsco':
            legendConfig = {
                title: 'Escolaridad Promedio',
                style: [
                    { label: '≤ 6 años', color: '#E6E0F8' }, // Clase 1
                    { label: '6 - 9 años', color: '#C3B9EB' }, // Clase 2
                    { label: '9 - 12 años', color: '#A092DD' }, // Clase 3
                    { label: '12 - 16 años', color: '#7C6BCF' }, // Clase 4
                    { label: '> 16 años', color: '#664785' } // Clase 5 (más alto)
                ]
            }
            break;
    }
    return legendConfig;
}
