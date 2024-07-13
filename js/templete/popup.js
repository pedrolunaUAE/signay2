// popup.js
function generateTable(properties) {
    let tableRows = '';
    for (const [key, value] of Object.entries(properties)) {
        tableRows += `
            <tr>
                <td scope="row">${key.toUpperCase()}</td>
                <th>${value.trim()}</th>
            </tr>
        `;
    }
    return `
        <table class="table table-sm table-borderless">
            ${tableRows}
        </table>
    `;
}

function createPopupContent(properties) {
    const tableHTML = generateTable(properties);
    return `
        <div class="card custom-popup" style="width: 14rem;">
             <button class="custom-popup-close" aria-label="Cerrar">
                <i class="bi bi-x-lg"></i> <!-- Ícono de Bootstrap para el cierre -->
            </button>
            <div class="card-body" style="font-size: 0.8rem;">
                <h6 class="card-title">${properties.tipo.trim()}:</h6>
                ${tableHTML}
                <div class="col-1 d-flex justify-content-center align-items-center">
                    <button id="btnInfMap2" class="btn btn-light">
                        <i class="bi bi-info-circle icono-grande"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}