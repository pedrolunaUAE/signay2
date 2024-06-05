// Declaracion inicia de apagado del panel infMap

const infMap = document.getElementById('infMap');
const mapContainer = document.getElementById('map-container');
mapContainer.classList.remove('col-lg-8');
infMap.classList.remove('col-lg-4');
mapContainer.classList.add('col-lg-12');
map.invalidateSize();


// Declaracion de accion del boton para motrar panel de información

document.getElementById('btnInfMap').addEventListener('click', function() {
    const infMap = document.getElementById('infMap');
    const mapContainer = document.getElementById('map-container');
    if (infMap.classList.contains('d-none')) {
        infMap.classList.remove('d-none');
        mapContainer.classList.remove('col-lg-12');
        mapContainer.classList.add('col-lg-8');
        infMap.classList.add('col-lg-4');
    } else {
        infMap.classList.add('d-none');
        mapContainer.classList.remove('col-lg-8');
        mapContainer.classList.add('col-lg-12');
        infMap.classList.remove('col-lg-4');
    }
    map.invalidateSize();
});