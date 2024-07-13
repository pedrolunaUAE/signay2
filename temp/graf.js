// Crear la gráfica de anillo
const data = [{
    values: [properties.Hombres, properties.Mujeres],
    labels: ['Hombres', 'Mujeres'],
    type: 'pie',
    hole: .6, // Tamaño del agujero para crear un efecto de anillo
    textinfo: 'none', // No mostrar texto en la gráfica
    hoverinfo: 'label+value+percent', // No mostrar información en el tooltip
    marker: {
        colors: ['#1f77b4', '#ff7f0e'] // Colores para hombre y mujer
    }
}];

const layout = {
    title: 'Distribución por Género',
    showlegend: true,
    height: 300,
    width: 300
};

// Desactivar la barra de herramientas
const config = {
    displayModeBar: false // Ocultar la barra de herramientas
};

Plotly.newPlot('genderChart', data, layout, config);


function updateInfMap(properties) {
    const infMap = document.getElementById('infMap');
    if (infMap) {
       // Mostrar la sección infMap
       infMap.classList.remove('d-none');

       // Actualizar Información Básica
       const basicInfo = `
            <p><strong>Clave:</strong> ${properties.Clave}</p>
            <p><strong>Nombre:</strong> ${properties.Nombre}</p>
            <p><strong>Población:</strong> ${properties.Población}</p>
            <p><strong>Tipo:</strong> ${properties.tipo}</p>
       `;
       document.getElementById('basic-info').innerHTML = basicInfo;

       // Actualizar Información Sociodemográfica
       const socioInfo = `
            <p><strong>Hombres:</strong> <i class="bi bi-person"></i> ${properties.Hombres}</p>
            <p><strong>Mujeres:</strong> <i class="bi bi-person-fill"></i> ${properties.Mujeres}</p>
       `;
       document.getElementById('socio-info').innerHTML = socioInfo;

       // Cambiar de pestaña a la primera con contenido
       changeTab('basic-tab');
    }
}

// Función para cambiar de pestaña
function changeTab(tabId) {
    // Verifica si el elemento existe
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
        const tabTrigger = new bootstrap.Tab(tabElement);
        tabTrigger.show();
    } else {
        console.error(`El elemento con ID ${tabId} no existe.`);
    }
}

// Ejemplo de uso de la función con datos de prueba
document.addEventListener('DOMContentLoaded', function() {
    const exampleProperties = {
        Clave: '001',
        Nombre: 'Ejemplo',
        Población: 5000,
        Hombres: 2500,
        Mujeres: 2500,
        tipo: 'Entidad'
    };
    updateInfMap(exampleProperties);
});
