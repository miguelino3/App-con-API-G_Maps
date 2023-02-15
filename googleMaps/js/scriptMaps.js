    let marcadoresJSON = [];
    var labelIndex = 0;
    var botonCLR = document.querySelector('#clearBTN');
    var botonMOSTRAR = document.querySelector('#mostrarMARKS'), toggle = false;
    var botonGUARDAR = document.querySelector('#guardarRuta'),
        botonBORRAR = document.querySelector('#borrarRuta'),
        selectRutas = document.querySelector('#savedRutas'),
        rutaSelectedTxt = document.querySelector('#rutaSelected');
    
    botonCLR.addEventListener('click', borrarTodos);
    botonMOSTRAR.addEventListener('click', function() {
        if (toggle) {
            mostrarTodos();
            toggle = false;
        } else {
            ocultarTodos();
            toggle = true;
        }
    });
    document.onload = obtenerRutas;

    botonGUARDAR.addEventListener('click', guardarMarkers);
    selectRutas.addEventListener('dblclick', obtenerRutas);
    selectRutas.addEventListener('change', obtenerMarkers);
    botonBORRAR.addEventListener('click', borrarRuta);

    // let a = document.querySelector('a');
    // a.onclick = function(e) {
    //     e.preventDefault();
    // }
var map;
function initMap() {
    let position = { lat: 43.5293, lng: -5.6773 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 13,
    });
    var marker = new google.maps.Marker({
        position: {lat: 43.542194, lng: -5.676875},
        map: map,
        title: 'Acuario de Gijón'
    });
    console.log(marker.position.lat() + 'º, ' + marker.position.lng());
    google.maps.event.addListener(map, "click", (e) => {
        addMarker(e.latLng, map);
    }); //e.latLng recoge la latitud y longitud, (en objeto JSON) de la zona sobre la que clicamos

}

function guardarMarkers() {
    if (marcadoresJSON.length == 0){
        //No hay marcadores
        alert('No hay marcadores creados!');
    }
    //Guardar en BBDD, por AJAX, los marcadores que tengamos
    //para esto, deberemos recoger los ATRIBUTOS de los marcadores (logitud y latitud, se obtienen por funciones)
    let markersEnvio = [],
        nombreDeRuta = document.querySelector('#nombRuta').value; //Y el Nombre de Ruta introducido
    for (let i = 0; i<marcadoresJSON.length ;i++) {
        let marker = marcadoresJSON[i];
        markersEnvio.push(marker.position.lat() + 'x' + marker.position.lng());
    }
    if (nombreDeRuta == undefined || nombreDeRuta == "") {
        nombreDeRuta = "RutaDefault";
    }
    //Creamos el objeto formData, para enviar por AJAX
    let fd = new FormData();
    fd.append('subirMarkers', 1);
    fd.append('nombreRuta', nombreDeRuta);
    fd.append('marcadores', JSON.stringify(markersEnvio));

    subirMarkersAJAX(fd);
    rutaSelectedTxt.innerHTMl = "";
    obtenerRutas();
}
function subirMarkersAJAX(formDatas) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            toggleCarga();
            let res = JSON.parse(this.responseText);
            if (res == '1') {
                alert("Marcadores enviados!");
                limpiarCampoTxtRutas();
            } else if (res == '0') {
                alert("ERROR al subir los marcadores!");
            } else {
                alert('ERROR, el Nombre de Ruta ya existe...');
                limpiarCampoTxtRutas();
            }
        } else {
            toggleCarga();
        }
    }
    xhttp.open('POST', 'http://localhost/ejerciciosAJAX/googleMaps/controller/controladorBD.php');
    xhttp.send(formDatas);
}
function limpiarCampoTxtRutas() {
    document.querySelector('#nombRuta').value = "";
}

function obtenerMarkers(e) {
    let ruta = e.target.value;
    //ruta --> El string del nombre de la ruta
    //Ajax para obtener los marcadores de la BBDD
    const xhttp = new XMLHttpRequest();
    var accionRequest = new FormData();
    if (ruta == undefined || ruta == "") {
        alert('Introduce una ruta!!');
        return null;
    }
    accionRequest.append('getMarkers', ruta);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let resultado = JSON.parse(this.responseText);
            if (resultado == '0') {
                alert("No hay marcadores guardados!!!");
            } else {
                //marcadoresJSON = []; borrarTodosF() YA VACÍA EL ARRAY DE MARCADORES
                borrarTodosF();
                for (let marker of resultado) {
                    let location = { lat: marker.latit, lng: marker.longit };
                    addMarker2(location, map);
                }
                toggleCarga();
                rutaSelectedTxt.innerText = ruta;
            }
        } else {
            //Cargando...
            toggleCarga();
        }
    }
    xhttp.open('POST', 'http://localhost/ejerciciosAJAX/googleMaps/controller/controladorBD.php');
    xhttp.send(accionRequest);
}
function obtenerRutas() {
    let fd = new FormData();
    fd.append('getRutasName', 1);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            toggleCarga();
            let resultado = JSON.parse(this.responseText);
            if (resultado == '0') {
                alert("No hay rutas guardadas!");
                return null;
            }
            selectRutas.innerHTML = "";
            selectRutas.innerHTML = "<option value='N/A'>Elije una ruta...</option>"
            for (let nomRuta of resultado) {
                let opt = document.createElement('option');
                opt.value = nomRuta;
                opt.innerText = nomRuta;
                selectRutas.append(opt);
            }
        } else {
            toggleCarga();
        }
    }

    xhttp.open('POST', 'http://localhost/ejerciciosAJAX/googleMaps/controller/controladorBD.php');
    xhttp.send(fd);
}
function borrarRuta() {
    //Si no hemos seleccionado una ruta, no hacer el proceso de borrado
    if (rutaSelectedTxt.innerHTML == "" || rutaSelectedTxt.innerHTML === undefined) {
        alert("Selecciona una ruta para eliminar!");
        return null;
    }
    const xhttp = new XMLHttpRequest();
    let formd = new FormData();

    formd.append('borrarRuta', rutaSelectedTxt.innerHTML);
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            toggleCarga();
            let res = JSON.parse(this.responseText);
            if (res == '1') {
                alert("Ruta eliminada!");
                //Borramos y volvemos a cargar las rutas en el Select
                obtenerRutas();
                rutaSelectedTxt.innerHTML = "";
            } else {
                alert('ERROR al eliminar la ruta!');
            }
        } else {
            toggleCarga();
        }
    }
    xhttp.open('POST', 'http://localhost/ejerciciosAJAX/googleMaps/controller/controladorBD.php');
    xhttp.send(formd);
}
function toggleCarga() {
    $(".loading").fadeToggle();
}

/**
 * Funciones gestión de marcadores
 */
//No lo añade al array, pero sí lo muestra
function mostrarMarcador(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  let mark = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,
    label: preguntarLabel(),
    //Si label es null, no tendrá etiqueta
    map: map
  });
  return mark;
}
//Muestra el marcador//lo añade al array
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  let mark = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,
    label: preguntarLabel(),
    //Si label es null, no tendrá etiqueta
    map: map
  });
  mark.addListener("click", function() {
    mark.setMap(null);
    quitarMarkArray(mark);
  });
  marcadoresJSON.push(mark);
  return mark;
}
function addMarker2(location, map) {
    //misma función que arriba, pero no pregunta por el 'label'
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    let mark = new google.maps.Marker({
      position: location,
      animation: google.maps.Animation.DROP,
      //Si label es null, no tendrá etiqueta
      map: map
    });
    mark.addListener("click", function() {
      mark.setMap(null);
      quitarMarkArray(mark);
    });
    marcadoresJSON.push(mark);
    return mark;
  }
function quitarMarkArray(marker) {
    //Quitar el marcador del array
    for (const key in marcadoresJSON) {
        //si el marcador existe en el array, lo sacamos
        if (marcadoresJSON.indexOf(marker) == key) {
            marcadoresJSON.splice(key, 1);
        }
    }
}
/**
 * Funciones para mostrar/ocultar los marcadores
 */
function mostrarTodos() {
    marcadoresJSON.forEach(marker => {
        marker.setMap(map);
    });
}
function ocultarTodos() {
    //Circulamos por el array de Marcadores, por cada uno lo ocultamos del mapa
    marcadoresJSON.forEach(marker => {
        marker.setMap(null);
    });
}

function preguntarLabel() {
    if (confirm('¿Nombre para el marcador?')) {
        return prompt('Nombre del marcador:', 'marcador X');
    } else {
        return null;
    }
}

//crearMarcador() --> usado para el JSON
function crearMarcador(latitud, longitud) {
    var position = {
        lat: latitud,
        lng: longitud
    };
    return position;
}
function borrarTodos() {
    if (confirm('Borrar todos?')) {
        //Circulamos por el array de Marcadores, por cada uno lo ocultamos del mapa
        marcadoresJSON.forEach(marker => {
            marker.setMap(null);
        });
        //Y vaciamos el array, 'borrándolos' de la memoria
        marcadoresJSON = [];
    }
}
function borrarTodosF() {
//Circulamos por el array de Marcadores, por cada uno lo ocultamos del mapa
        marcadoresJSON.forEach(marker => {
            marker.setMap(null);
        });
        //Y vaciamos el array, 'borrándolos' de la memoria
        marcadoresJSON = [];
}