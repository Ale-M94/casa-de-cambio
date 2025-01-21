const encabezado = document.querySelector('#header-cotizaciones');
const listaDivisas = document.querySelector('#selector-divisa');
const fecha = document.querySelector('#selector-fecha');
const $consulta = document.querySelector('#boton-consultar');
const $reiniciarConsulta = document.querySelector('#boton-reiniciar');
const datosCotizaciones = document.querySelector('#tbody-cotizaciones');


function obtenerMonedas() {
    const consultaCasaDeCambio = fetch('https://api.frankfurter.app/latest');
    consultaCasaDeCambio.then(response => response.json())
        .then(responseJSON => {
            Object.keys(responseJSON.rates).forEach(moneda => {
                const opcionMoneda = document.createElement('option');
                opcionMoneda.textContent = moneda;
                opcionMoneda.value = moneda;
                listaDivisas.appendChild(opcionMoneda);
            });
        })
        .catch(error => console.error('Falló', error));
};

function configurarInputFecha(fecha) {
    const hoy = (new Date()).toISOString().split('T')[0];
    fecha.setAttribute('max', hoy);
    fecha.setAttribute('value', hoy);
};

function consultarCambios() {
    $consulta.onclick = function () {
        const fechaISO = fecha.value;
        const [anio, mes, dia] = fechaISO.split('-');
        const fechaFormateada = `${dia}-${mes}-${anio}`;

        listaDivisas.classList.remove('rojo');
        fecha.classList.remove('rojo');
        fetch(`https://api.frankfurter.app/${fecha.value}?base=${listaDivisas.value}`)
            .then(response => response.json())
            .then(encabezado.textContent = `Cotizaciones del día ${fechaFormateada} del ${listaDivisas.value}`)
            .then(responseJSON => {
                Object.entries(responseJSON.rates).forEach(([divisa, cotizacion]) => {
                    document.querySelector('#resultado-consulta').style.display = "block";

                    const fila = document.createElement('tr');

                    const celdaDivisa = document.createElement('td');
                    celdaDivisa.textContent = divisa;
                    fila.appendChild(celdaDivisa);

                    const celdaCotizacion = document.createElement('td');
                    celdaCotizacion.textContent = cotizacion;
                    fila.appendChild(celdaCotizacion);

                    datosCotizaciones.appendChild(fila);
                })
            })
            .then(document.querySelector('#mensaje-error').style.display = 'none')

            .catch(error => {
                document.querySelector('#resultado-consulta').style.display = "none";
                document.querySelector('#mensaje-error').style.display = 'block';
                console.log(error);
            });
    }
};

$reiniciarConsulta.onclick = function () {
    document.querySelector('#resultado-consulta').style.display = "none";
    datosCotizaciones.innerHTML = '';
};

function inicializar() {
    configurarInputFecha(fecha);
    obtenerMonedas();
    consultarCambios();
};

inicializar();
