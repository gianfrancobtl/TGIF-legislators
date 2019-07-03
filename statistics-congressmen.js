//Lo siguiente es el JSON que contiene los datos a utilizar en las tablas de los HTML de Party Loyalty y Attendance (Congressmen);

fetch('https://api.propublica.org/congress/v1/113/house/members.json', {
  method: 'GET',
  headers: {
    'X-API-Key': 'KQcKrS8u50etFZIwwqYL5awbL0rF55usagtY04HA'
  }
}).then((response) => { //1
  return response.json(); //2
}).then((json) => { //3
  data = json;
  vue(data);
}).catch((error) => {
  console.log("error: " + error);
});

var statistics = {
  "numberOfDemocrats": 0,
  "numberOfRepublicans": 0,
  "numberOfIndependents": 0,
  "totalCongressmen": 0,

  "promedioDeVotosDemocrats": 0,
  "promedioDeVotosRepublicans": 0,
  "promedioDeVotosIndependents": 0,
  "promedioDeVotosTotal": 0,

  "congresistasMenosFieles": [

	],
  "congresistasMasFieles": [

	],
  "congresistasMasComprometidos": [

  ],
  "congresistasMenosComprometidos": [

  ]
}

function vue(valor) {
  //Lo siguiente convierte el JSON de todos los congresistas en un array reccorrible llamado "members";
  var str = JSON.stringify(data, null, 2);
  var valor = JSON.parse(str);
  var members = valor.results[0].members;

  ///////////VARIABLES GLOBALES\\\\\\\\\\\\\\\\
  var democratObj = [];
  var republicanObj = [];
  var independentObj = [];

  //La siguiente función recorre el array de todos los miembros y, si se compueba que son de x partido, pushean el elemento completo, con todos los datos, a su correspondiente array (que comenzará vacío);
  function cantidadDeMiembros() {

    for (let i = 0; i < members.length; i++) {
      let elemento = members[i];
      if (elemento.party == "D") {
        democratObj.push(elemento);
      }
      if (elemento.party == "R") {
        republicanObj.push(elemento);
      }
      if (elemento.party == "I") {
        independentObj.push(elemento);
      }
    }
  }
  cantidadDeMiembros(members);

  //Las siguientes expresiones envían los valores obtenidos al JSON "statistics";
  statistics.numberOfDemocrats = democratObj.length;
  statistics.numberOfIndependents = independentObj.length;
  statistics.numberOfRepublicans = republicanObj.length;
  statistics.totalCongressmen = democratObj.length + republicanObj.length + independentObj.length;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //La siguiente función realiza el promedio de los votos para cada partido en función del parámetro "a", que será diferente según el partido que se quiera tomar;
  function promedioDeVotos(a) {
    let sumaVotos = 0;
    for (i = 0; i < a.length; i++) {
      elemento = a[i];
      sumaVotos += elemento.votes_with_party_pct;
    }
    if (sumaVotos != 0) {
      return (sumaVotos / a.length); //La function devuelve el valor de la suma de los votos dividido el total de los mismos (así se calculan los promedios);
    }
    return 0;
  }


  //Las siguientes cuatro lineas otorgan los valores obtenidos (con solamente dos decimales) a los elementos del JSON creado;
  statistics.promedioDeVotosDemocrats = promedioDeVotos(democratObj).toFixed(2);
  statistics.promedioDeVotosRepublicans = promedioDeVotos(republicanObj).toFixed(2);
  statistics.promedioDeVotosIndependents = promedioDeVotos(independentObj).toFixed(2);
  statistics.promedioDeVotosTotal = promedioDeVotos(members).toFixed(2);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //La siguiente variable guarda el valor de senadores buscado (el 10%);
  var cantidadBuscadaDeCongresistas = Math.floor(members.length * 10 / 100);

  //La siguiente variable guarda un array con todos los senadores, comenzando del menos fiel y terminando por los que son más;
  var filtradoDeCongresistasMenosFieles = (members.sort(function (a, b) {
    return parseFloat(a.total_votes) - parseFloat(b.total_votes);
  }));

  //El siguiente renglón envía la cantidad de senadores buscada al JSON "statistics". La función slice permite recortar el array;
  statistics.congresistasMenosFieles = filtradoDeCongresistasMenosFieles.slice(0, cantidadBuscadaDeCongresistas);

  //Ídem para los senadores más fieles;
  var filtradoDeCongresistasMasFieles = (members.reverse(function (a, b) {
    return parseFloat(a.total_votes) - parseFloat(b.total_votes);
  }));
  statistics.congresistasMasFieles = filtradoDeCongresistasMasFieles.slice(0, cantidadBuscadaDeCongresistas);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //La siguiente variable guarda un array con todos los congresistas comenzando por el congresista más comprometido (menos ausencias) y terminando por el menos comprometido;
  var filtradoDeCongresistasMasComprometidos = (members.sort(function (a, b) {
    return parseFloat(a.missed_votes) - parseFloat(b.missed_votes);
  }));

  statistics.congresistasMasComprometidos = filtradoDeCongresistasMasComprometidos.slice(0, cantidadBuscadaDeCongresistas);

  //Ídem con los congresistas menos comprometidos;
  var filtradoDeCongresistasMenosComprometidos = (members.reverse(function (a, b) {
    return parseFloat(a.missed_votes) - parseFloat(b.missed_votes);
  }));

  statistics.congresistasMenosComprometidos = filtradoDeCongresistasMenosComprometidos.slice(0, cantidadBuscadaDeCongresistas);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //DIBUJO DE LAS TABLAS--

  //La siguiente variable app guarda todos los valores que permitirán dibujar la tabla en el html;
  var app = new Vue({
    el: '#app',
    data: {
      partyInfo: [
        {
          party: 'Republicans',
          numberOfMembers: 0,
          percentajeOfVotes: 0,
        },
        {
          party: 'Democrats',
          numberOfMembers: 0,
          percentajeOfVotes: 0,
        },
        {
          party: 'Independents',
          numberOfMembers: 0,
          percentajeOfVotes: 0,
        },
        {
          party: 'Total',
          numberOfMembers: 0,
          percentajeOfVotes: 0,
        },
      ],
      congresistasMasFieles: [],
      congresistasMenosFieles: [],
      congresistasMasComprometidos: [],
      congresistasMenosComprometidos: [],
    },
  });

  //Las siguientes líneas otorgan a los elementos de la variable app los resultados obtenidos;
  app.partyInfo[0].numberOfMembers = statistics.numberOfRepublicans;
  app.partyInfo[0].percentajeOfVotes = statistics.promedioDeVotosRepublicans;

  app.partyInfo[1].numberOfMembers = statistics.numberOfDemocrats;
  app.partyInfo[1].percentajeOfVotes = statistics.promedioDeVotosDemocrats;

  app.partyInfo[2].numberOfMembers = statistics.numberOfIndependents;
  app.partyInfo[2].percentajeOfVotes = statistics.promedioDeVotosIndependents;

  app.partyInfo[3].numberOfMembers = statistics.totalCongressmen;
  app.partyInfo[3].percentajeOfVotes = statistics.promedioDeVotosTotal;

  app.congresistasMasFieles = statistics.congresistasMasFieles;
  app.congresistasMenosFieles = statistics.congresistasMenosFieles;
  app.congresistasMasComprometidos = statistics.congresistasMasComprometidos;
  app.congresistasMenosComprometidos = statistics.congresistasMenosComprometidos;

}

/*
var tablaHouseAtAGlance = document.getElementById("houseAtAGlance");
var tbody = document.createElement("tbody");

//La siguiente función dibuja la tabla de los "senadores en una primera mirada", tomando como parametro el array completo y distribuyendo los datos como es pedido;
function dibujarTablaGeneral(a) {
  var tabla = "<thead class='thead-dark'><tr>" +
    "<th>Party</th>" +
    "<th>No. of Reps</th>" +
    "<th>%voted with paty</th>" +
    "</tr>" +
    "</thead>";

  tabla += "<tr><td>Democrats</td>" + "<td>" + a.numberOfDemocrats + "</td><td>" + a.promedioDeVotosDemocrats + "% </td></tr>";
  tabla += "<tr><td>Republicans</td>" + "<td>" + a.numberOfRepublicans + "</td><td>" + a.promedioDeVotosRepublicans + "% </td></tr>";
  tabla += "<tr><td>Independents</td>" + "<td>" + a.numberOfIndependents + "</td><td>" + a.promedioDeVotosIndependents + "% </td></tr>";
  tabla += "<tr><td>Total</td>" + "<td>" + a.totalCongressmen + "</td><td>" + a.promedioDeVotosTotal + "% </td></tr>";

  tablaHouseAtAGlance.innerHTML = tabla;
}
dibujarTablaGeneral(estadisticas);
*/
/*
var tablaMasComprometidos = document.getElementById("mostEngagedCongressmen");
var tablaMenosComprometidos = document.getElementById("leastEngagedCongressmen");

function dibujarTablaCompromiso(a) {
  var tabla = "<thead class='thead-dark'><tr>" +
    "<th>Name</th>" +
    "<th>No. Missed Votes</th>" +
    "<th>% Missed</th>" +
    "</tr>" +
    "</thead>";

  for (i = 0; i < cantidadBuscadaDeCongresistas; i++) {
    elemento = a[i]
    tabla += "<tr>";
    if (elemento.last_name != null && elemento.first_name != null && elemento.middle_name != null) {
      tabla += "<td><a href='" + elemento.url + "'>" + elemento.last_name + " " + elemento.first_name + " " + elemento.middle_name + "</a></td>";
    } else if (elemento.middle_name == null) {
      tabla += "<td><a href='" + elemento.url + "'>" + elemento.last_name + " " + elemento.first_name + "</a></td>";
    }
    tabla += "<td>" + elemento.missed_votes + "</td>";
    tabla += "<td>" + elemento.missed_votes_pct + "%</td>";
  }
  return tabla;
}

tablaMasComprometidos.innerHTML = dibujarTablaCompromiso(estadisticas.congresistasMasComprometidos);
tablaMenosComprometidos.innerHTML = dibujarTablaCompromiso(estadisticas.congresistasMenosComprometidos);


//Las siguientes variables tomas por ID los elementos del HTML;
var tablaMenosFieles = document.getElementById("leastLoyalCongressmen");
var tablaMasFieles = document.getElementById("mostLoyalCongressmen");

//La siguiente funcion dibuja las dos tablas que dan cuenta de la fidelidad de los senadores a sus partidos;
function dibujarTablaFidelidad(a) {
  var tabla = "<thead class='thead-dark'><tr>" +
    "<th>Name</th>" +
    "<th>No. Party Votes</th>" +
    "<th>% Party Votes</th>" +
    "</tr>" +
    "</thead>";

  for (i = 0; i < cantidadBuscadaDeCongresistas; i++) {
    elemento = a[i]
    tabla += "<tr>";
    if (elemento.last_name != null && elemento.first_name != null && elemento.middle_name != null) {
      tabla += "<td><a href='" + elemento.url + "'>" + elemento.last_name + " " + elemento.first_name + " " + elemento.middle_name + "</a></td>";
    } else if (elemento.middle_name == null) {
      tabla += "<td><a href='" + elemento.url + "'>" + elemento.last_name + " " + elemento.first_name + "</a></td>";
    }

    tabla += "<td>" + elemento.total_votes + "</td>";
    tabla += "<td>" + elemento.votes_with_party_pct + "% </td></tr>";
  }
  return tabla;
}

//Las siguientes lineas permiten mostrar la tabla obtenida en la función en el HTML, tomando como parámetro los senadores menos fieles y los senadores más fieles, según sea necesario;
tablaMenosFieles.innerHTML = dibujarTablaFidelidad(estadisticas.congresistasMenosFieles);
tablaMasFieles.innerHTML = dibujarTablaFidelidad(estadisticas.congresistasMasFieles);
*/
