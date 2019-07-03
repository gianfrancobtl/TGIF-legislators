//$(function() {data});
var data;

fetch('https://api.propublica.org/congress/v1/113/house/members.json', {
  method: 'GET',
  headers: {
    'X-API-Key': 'KQcKrS8u50etFZIwwqYL5awbL0rF55usagtY04HA'
  }
}).then((response) => {
  return response.json();
}).then((json) => {
  data = json;
  vue(data);
}).catch((error) => {
  console.log("error:" + error);
});

//La siguiente, es una llamada al JSON que contiene la información de todos los estados de EEUU; dentro (1), se referencia una función que permitirá formar el elemento Select dentro del Dom del HTML;
fetch('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_titlecase.json', {
  method: 'GET',
}).then((response) => {
  return response.json();
}).then((json) => {
  data = json;
  estados(data); //1
}).catch((error) => {
  console.log("error:" + error);
});

//La siguiente funcion permite tomar data de la llamada al JSON; adentro, encierra una variable app que guarda la información de los senadores y permite que esta sea mostrada en el HTML con Vue;
function vue(valor) {
  
  var str = JSON.stringify(data, null, 2);
  var valor = JSON.parse(str);

  var app = new Vue({
    el: '#app',
    data: {
      congresistas: [],
    },
  })
  app.congresistas = data.results[0].members;
};

function estados() {
  var strEstados = JSON.stringify(data, null, 2);
  var valor = JSON.parse(strEstados);

  var contenidoEstados = document.getElementById("selectState");
  var arregloEstados = valor

  var selectOption = "";

  function elementoSelect(arregloEstados) {
    //console.log(arregloEstados);
    selectOption += "<option id='all'> " + "All states" + "</option>"
    for (i = 0; i < arregloEstados.length; i++) {
      selectOption += "<option id='" + arregloEstados[i].abbreviation + "'> " + arregloEstados[i].name + "</option>";
    }
    return selectOption;
  }
  contenidoEstados.innerHTML = elementoSelect(arregloEstados);
}

/*
arrayAux = [];
var str = JSON.stringify(data, null, 2);
var valor = JSON.parse(str)
var pro = document.getElementById("house-data")
var tbody = document.createElement("tbody")
// pro.appendChild(tbody)
var members = valor.results[0].members;


function dibujarTablaRepresentantes(members) {
  var tabla = "<thead class='thead-dark'><tr>" +
    "<th>Full Name</th>" +
    "<th>Party</th>" +
    "<th>State</th>" +
    "<th>Senority</th>" +
    "<th>Percentage of votes</th>" +
    "</tr>" +
    "</thead>";
  for (let i = 0; i < members.length; i++) {
    tabla += "<tr>";
    if (members[i].last_name != null && members[i].first_name != null && members[i].middle_name != null) {
      tabla += "<td><a href='" + members[i].url + "'>" + members[i].last_name + " " + members[i].first_name + " " + members[i].middle_name + "</a></td>"
    } else if (members[i].middle_name == null) {
      tabla += "<td><a href='" + members[i].url + "'>" + members[i].last_name + " " + members[i].first_name + " " + "..." + "</a></td>"
    }
    tabla += "<td>" + " " + members[i].party + " " + "</td>";
    tabla += "<td>" + " " + members[i].state + " " + "</td>";
    tabla += "<td>" + " " + members[i].seniority + " " + "</td>";
    tabla += "<td>" + " " + members[i].votes_with_party_pct + "%" + " " + "</td></tr>";
  }
  pro.innerHTML = tabla
}
//  tbody.appendChild(tabla)
//  pro.appendChild(tbody)

function filtrarTablaCheckbox() {
  arrayAux = [];
  let checkboxDemocrata = document.getElementById("checkboxD");
  let checkboxIndependiente = document.getElementById("checkboxI");
  let checkboxRepublicanos = document.getElementById("checkboxR");

  //console.log("Democrata: " + checkboxDemocrata.checked);
  //console.log("Independiente: " + checkboxIndependiente.checked);
  //console.log("Republicanos: " + checkboxRepublicanos.checked);

  if (checkboxDemocrata.checked) {
    arrayAux.push('D');
  }
  if (checkboxIndependiente.checked) {
    arrayAux.push('I');
  }
  if (checkboxRepublicanos.checked) {
    arrayAux.push('R');
  }
  return filtrarMiembrosPorPartido(arrayAux);
}

function filtrarMiembrosPorPartido(arrayAux) {
  let arregloFiltrado = [];
  for (let i = 0; i < members.length; i++) {
    let elemento = members[i];
    if (comprobarSiEstaAdentro(elemento)) {
      arregloFiltrado.push(elemento);
    }
  }
  return arregloFiltrado;
  //return arreglo.filter(comprobarSiEstaAdentro);
}

function comprobarSiEstaAdentro(elemento) {
  for (let i = 0; i < arrayAux.length; i++) {
    if (arrayAux[i] == elemento.party) {
      return true;
    }
  }
  return false;
  //return arrayAux.includes(elemento.party);
}


//la siguiente función filtra la tabla según el estado seleccionado.
function filtrarEstados(members) {
  selectState = document.getElementById("selectState").selectedOptions[0].id;
  //console.log(selectState); la variable de arriba toma el valor del elemento seleccionado en el dropdown. Por ejemplo, si se selecciona "alabama", selectState = AL.
  return members.filter(verSiPerteneceAEstado);
  //tomando el mismo ejemplo: la función de arriba filtrará a todos los miembros cuyo partido sea Alabama y los dibujará en la tabla gracias al evento onChange colocado en el input "select" del html.-
}

function verSiPerteneceAEstado(elemento) {
  return elemento.state == selectState;
  //console.log(elemento);
}

dibujarTablaRepresentantes(members);
*/
