encabezado = document.querySelector('#header-cotizaciones');
listaDivisas = document.querySelector('#selector-divisa');
fecha = document.querySelector('#selector-fecha');
$consulta = document.querySelector('#boton-consultar');
$reiniciarConsulta = document.querySelector('#boton-reiniciar');
datosCotizaciones = document.querySelector('#tbody-cotizaciones');

fetch('https://api.frankfurter.app/latest')
    .then(response => response.json())
    .then(responseJSON => {
        Object.keys(responseJSON.rates).forEach(moneda => {
            opcionMoneda = document.createElement('option');
            opcionMoneda.textContent = moneda;
            opcionMoneda.value = moneda;
            listaDivisas.appendChild(opcionMoneda);
        });
    });


function validarDivisa(listaDivisas) {
    if (listaDivisas.value === '') {
        listaDivisas.classList.add('rojo');
        return false;
    };
    return true;
};

function validarFecha(fecha) {;
    if (fecha.value === '') {
        fecha.classList.add('rojo');
        return false;
    };
    return true;
};


$consulta.onclick = function () {
    if(!validarDivisa(listaDivisas) || !validarFecha(fecha)){
        return;
    };

    document.querySelector('#resultado-consulta').style.display = "none";
    datosCotizaciones.innerHTML = '';

    document.querySelector('#resultado-consulta').style.display = "block";
    listaDivisas.classList.remove('rojo');
    fecha.classList.remove('rojo');
    fetch(`https://api.frankfurter.app/${fecha.value}?base=${listaDivisas.value}`)
        .then(response => response.json())
        .then(encabezado.textContent = `Cotizaciones del día ${fecha.value} del ${listaDivisas.value}`)
        .then(responseJSON => {
            Object.entries(responseJSON.rates).forEach(([divisa, cotizacion]) => {
                const fila = document.createElement('tr');

                const celdaDivisa = document.createElement('td');
                celdaDivisa.textContent = divisa;
                fila.appendChild(celdaDivisa);

                const celdaCotizacion = document.createElement('td');
                celdaCotizacion.textContent = cotizacion;
                fila.appendChild(celdaCotizacion);

                datosCotizaciones.appendChild(fila);
            });
        });
};



$reiniciarConsulta.onclick = function () {
    document.querySelector('#resultado-consulta').style.display = "none";
    datosCotizaciones.innerHTML = '';
};

