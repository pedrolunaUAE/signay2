// chart.js

function createdonutChart(pobm, pobh, elementId) {
    const data = [{
        values: [pobm, pobh],
        labels: ['Hombres', 'Mujeres'],
        type: 'pie',
        hole: .6, // Gráfica de anillo
        textinfo: "label+percent",
        marker: {
            colors: ['#1f77b4', '#ff7f0e'] // Colores para hombres y mujeres
        },
        textfont: {
            size: 11 // Tamaño de la fuente ajustado
        }
    }];

    const layout = {
        title: {
            text: '', // Elimina el texto del título
            font: {
                size: 11 // Tamaño de la fuente del título
            }
        },
        showlegend: false, // Oculta la leyenda
        margin: { t: 20, b: 20, l: 20, r: 20 }, // Márgenes ajustados
        height: 200, // Altura de la gráfica
        width: 300, // Ancho de la gráfica
        annotations: [], // Anotaciones vacías para evitar texto no deseado
        modebar: {
            remove: ['toImage', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
        }
    };

    Plotly.newPlot(elementId, data, layout);
}
