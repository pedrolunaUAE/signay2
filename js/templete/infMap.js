function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//www.w3schools.com/icons/icons_reference.asp
// Función para actualizar el contenido de las pestañas
function updateInfMap(properties) {
    const infMap = document.getElementById('infMap');
    if (infMap) {
        infMap.classList.remove('d-none');

        // Declaracion de cabecera del pane de información
        const cabecerainfo = `
            <div class="card">
                <div class="card-header bg-dark text-white">
                    <h8 class="card-title"> ${properties.tipo}:${properties.cvegeo} - ${properties.nomgeo}</h8>
                </div>
            </div>
        `;
        $('#cabecera-info').html(cabecerainfo);

        const cardinfo = `
            <select id="infoSelector" class="form-select mb-3">
                <option value="basic">Información Básica</option>
                <option value="gnero">Información por Género</option>
                <option value="estpob">Estrucutra poblacional</option>
            </select>
            <div class="card">
                <div id="social-cardbody" class="card-body">
                </div>
            </div>
        `;
        $('#social-info').html(cardinfo);
        

        function showBasicInfo(properties) {
            const percentageWomen = (properties.pobm / properties.pobtot * 100).toFixed(1);
            const percentageMen   = (properties.pobh / properties.pobtot * 100).toFixed(1);
            const basicInfo = `
                <table class="table flex-table">
                    <thead>
                        <tr>
                            <th colspan="4" class="text-center">Información sociodemográfica</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="2" class="text-center" style='background-color:#215D7B;'>
                                <div class="flex-container">
                                    <i class='fa fa-group' style='font-size:20px;color:#fff'></i></strong>
                                    
                                </div>
                            </td> 
                            <td colspan="2" class="text-center" style='background-color:#81388D;'>
                                <div class="flex-container">
                                    <i class='bi bi-people' style='font-size:20px;color:#fff'></i></strong>
                                </div>
                            </td> 
                        </tr>
                        <tr>
                           <td colspan="2">
                                <div class="flex-column-container">    
                                    <span class="data-title">Población Total</span>
                                    <span class="data-number"  style='color:#215D7B'>${formatNumber(properties.pobtot)}
                                        <button class="icon-button" onclick="updateLayerStyle('pobmuntot')">
                                            <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                        </button>
                                    </span>
                                    <span class="data-context">habitantes</span>
                                </div>
                            </td>

                            <td colspan="2">
                                <div class="flex-column-container">
                                    <span class="data-title">Dencidad de Población</span>
                                    <span class="data-number"  style='color:#81388D'>${formatNumber(properties.den_pob_km2)}
                                        <button class="icon-button" onclick="updateLayerStyle('despobmun')">
                                            <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                        </button>
                                    </span>
                                    <span class="data-context">Habitantes por </span>
                                    <span class="data-context">Kilometro cuadrado</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center" style='background-color:#A78CC2;'>
                                <div class="flex-container">
                                    <i class='fa fa-female' style='font-size:20px;color:#fff'></i></strong>  
                                </div>
                            </td>
                            <td class="text-center" style='background-color:#3493C2;'>
                                <div class="flex-container">
                                    <i class='fas fa-male' style='font-size:20px;color:#fff'></i></strong>  
                                </div>
                            </td> 
                            <td colspan="2" class="text-center" style='background-color:#C54717;'>
                                <div class="flex-container">
                                    <i class='fas fa-user-graduate' style='font-size:20px;color:#fff'></i></strong>
                                </div>
                            </td> 
                        </tr>
                        <tr>
                           <td>
                                <div class="flex-column-container">    
                                    <span class="data-title">Mujeres</span>
                                    <span class="data-number"  style='color:#215D7B'>${percentageWomen}%
                                        <button class="icon-button" onclick="updateLayerStyle()">
                                            <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                        </button>
                                    </span>
                                    <span class="data-context">${formatNumber(properties.pobm)}</span>
                                </div>
                            </td>

                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-title">Hombres</span>
                                    <span class="data-number"  style='color:#215D7B'>${percentageMen}%
                                        <button class="icon-button" onclick="updateLayerStyle()">
                                            <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                        </button>
                                    </span>
                                    <span class="data-context">${formatNumber(properties.pobh)}</span>
                                </div>
                            </td>

                            <td colspan="2">
                                <div class="flex-column-container">
                                    <span class="data-title">Escolaridad promedio</span>
                                    <span class="data-number"  style='color:#C54717'>${formatNumber(properties.edu_pesco)}
                                        <button class="icon-button" onclick="updateLayerStyle('promEsco')">
                                            <i class="fas fa-map-marker-alt" style='font-size:14px;color:black'></i>
                                        </button>
                                    </span>
                                    <span class="data-context">años </span>
                                </div>
                            </td>
                        </tr>
                       
                        <tr>
                           <td colspan="2" class="text-center">
                                <div class="flex-container">
                                    <span class="data-title">Grandes grupos de edad</span>
                                </div>
                            </td> 
        
                            <td colspan="2" class="text-center">
                                <div class="flex-container">
                                    <span class="data-title">Nivel de escolaridad</span>
                                </div>
                            </td> 
                        </tr>
                        <tr>
                           <td class="text-center" style='background-color:#F6A017;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff';>Niños</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#F6A017'>${properties.ninos}%</span>
                                </div>
                            </td>
                            <td class="text-center" style='background-color:#828386;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff'>Prescolar</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#828386'>${percentageWomen}%</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                           <td class="text-center" style='background-color:#897C7A;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff'>Jovenes</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#897C7A'>${properties.jovenes}%</span>
                                </div>
                            </td>
                            <td class="text-center" style='background-color:#902180;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff'>Primaria</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#902180'>${percentageWomen}%</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                           <td class="text-center" style='background-color:#615857;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff'>Jovenes adultos</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#615857'>${properties.ajovenes}%</span>
                                </div>
                            </td>
                            <td class="text-center" style='background-color:#009F9E;'>
                                <div class="flex-container" >
                                    <span class="data-title" style='color:#fff'>Secundaria</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#009F9E'>${percentageWomen}%</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                           <td class="text-center" style='background-color:#009D9C;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff'>Adultos</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#215D7B'>${properties.adultos}%</span>
                                </div>
                            </td>
                            <td class="text-center" style='background-color:#31B700;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff'>Bachillerato</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#31B700'>${percentageWomen}%</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                           <td class="text-center" style='background-color:#F296AE;'>
                                <div class="flex-container">
                                    <i class='fas fa-user-tie' style='font-size:20px;color:#fff'></i></strong>
                                    <span class="data-title" style='color:#fff's>Adultos Mauyores</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#F296AE'>${properties.amayores}%</span>
                                </div>
                            </td>
                            <td class="text-center" style='background-color:#0071B5;'>
                                <div class="flex-container">
                                    <span class="data-title" style='color:#fff'>Universidad</span>
                                </div>
                            </td> 
                            <td>
                                <div class="flex-column-container">    
                                    <span class="data-number"  style='color:#0071B5'>${percentageWomen}%</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
            document.getElementById('social-cardbody').innerHTML = basicInfo;
        }

        // Función para crear el contenido de la gráfica de género
        function showGenderChart(properties) {
            const chartContainer = `<div id="chart"></div>`;
            document.getElementById('social-cardbody').innerHTML = chartContainer;
            createdonutChart(properties.pobh, properties.pobm, 'chart');
        }


        function showEstructuraChart(data) {
            // Datos de ejemplo
            
                       
            var hombres =   [data.pobh0_4,  data.pobh5_9,   data.pobh10_14, data.pobh15_19, data.pobh20_24, data.pobh25_29,
                            data.pobh30_34, data.pobh35_39, data.pobh40_44,  data.pobh45_49, data.pobh50_54, data.pobh55_59,
                            data.pobh60_64, data.pobh65_69, data.pobh70_74,  data.pobh75_89, data.pobh80_44, data.pobh85ym,];

	
            var mujeres =   [data.pobm0_4,  data.pobm5_9,   data.pobm10_14,  data.pobm15_19, data.pobm20_24, data.pobm25_29,
                            data.pobm30_34, data.pobm35_39, data.pobm40_44, data.pobm45_49, data.pobm50_54, data.pobm55_59,
                            data.pobm60_64, data.pobm65_69, data.pobm70_74, data.pobm75_89, data.pobm80_44, data.pobm85ym,];

            const chartContainer = `<div id="chart"></div>`;
            document.getElementById('social-cardbody').innerHTML = chartContainer;
            createEstrucChart(hombres, mujeres, 'chart');
        }
    
        // Función para manejar el cambio del combo box
        function handleInfoChange(event) {
            const selectedValue = event.target.value;
            if (selectedValue === 'basic') {
                showBasicInfo(properties);
            } else if (selectedValue === 'gnero') {
                showGenderChart(properties);
            }
            else if (selectedValue === 'estpob') {
                showEstructuraChart(properties);
            }
        }

        // Asignar el evento de cambio al combo box
        document.getElementById('infoSelector').addEventListener('change', handleInfoChange);

        // Mostrar la información básica por defecto
        handleInfoChange({ target: { value: 'basic' } });

       
        const economInfo = `
            <h4>Información Económica</h4>
            <p><strong>Ingreso Promedio:</strong></p>
            <p><strong>Desempleo:</strong></p>
         `;

        const indicaInfo = `
            <h4>Información Sociodemográfica</h4>
            <p><strong>Hombres:</strong> <i class="bi bi-person"></i> ${properties.Hombres}</p>
            <p><strong>Mujeres:</strong> <i class="bi bi-person-fill"></i> ${properties.Mujeres}</p>
        `;

        // Asignar el contenido a cada tab-pane
        // document.getElementById('social-info').innerHTML = socioInfo;
        document.getElementById('econom-info').innerHTML = economInfo;
        document.getElementById('indica-info').innerHTML = indicaInfo;
    }
}

