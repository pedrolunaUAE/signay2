// chart.js

function createEstrucChart(hombres, mujeres,elementId) {
        
    var edades = ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80+"];
        
    // Invertir los valores de los hombres para mostrarlos a la izquierda
    var hombres_neg = hombres.map(x => -x);

    var trace1 = {
        x: hombres_neg,
        y: edades,
        name: 'Hombres',
        orientation: 'h',
        type: 'bar',
        marker: {
            color: '#F4A93C'
        },
    };

    var trace2 = {
        x: mujeres,
        y: edades,
        name: 'Mujeres',
        orientation: 'h',
        type: 'bar',
        marker: {
            color: '#A99A00'
        }
    };

    var data = [trace1, trace2];

    var layout = {
        title: 'Estructura por edad y sexo',
        barmode: 'overlay',
        xaxis: {
            tickvals: [-50000, -25000, 0, 25000, 50000],
            ticktext: ['50000', '25000', '0', '25000', '50000']
        },
        yaxis: {
            title: 'Edad'
        },
        bargap: 0.1,
        legend: {
            orientation: 'h', // Horizontal orientation
            x: 0.5, // Center horizontally
            y: -0.2, // Position below the plot area
            xanchor: 'center', // Horizontal alignment
            yanchor: 'bottom' // Vertical alignment
        }
    };

    var config = {
        displayModeBar: false // Disable the default mode bar
    };

    Plotly.newPlot(elementId, data, layout, config);
}
