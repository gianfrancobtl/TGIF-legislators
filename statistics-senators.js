//Lo siguiente es el JSON que contiene los datos a utilizar en las tablas de los HTML de Party Loyalty y Attendance (Senators);

fetch('https://api.propublica.org/congress/v1/113/senate/members.json', {
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
  "totalSenators": 0,

  "promedioDeVotosDemocrats": 0,
  "promedioDeVotosRepublicans": 0,
  "promedioDeVotosIndependents": 0,
  "promedioDeVotosTotal": 0,

  "senadoresMenosFieles": [],
  "senadoresMasFieles": [],
  "senadoresMasComprometidos": [],
  "senadoresMenosComprometidos": []
}

function vue(valor) {
  //Lo siguiente convierte el JSON de todos los senadores en un array reccorrible llamado "members";
  var str = JSON.stringify(data, null, 2);
  var valor = JSON.parse(str);
  var members = valor.results[0].members;

  ///////////VARIABLES GLOBALES\\\\\\\\\\\\\\\\

  var democratObj = [];
  var republicanObj = [];
  var independentObj = [];

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  statistics.totalSenators = democratObj.length + republicanObj.length + independentObj.length;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //La siguiente función realiza el promedio de los votos para cada partido en función del parámetro "a", que será diferente según el partido que se quiera tomar;
  function promedioDeVotos(a) {
    let sumaVotos = 0;
    for (i = 0; i < a.length; i++) {
      elemento = a[i];
      sumaVotos += elemento.votes_with_party_pct;
    }
    return (sumaVotos / a.length); //La function devuelve el valor de la suma de los votos dividido el total de los mismos (así se calculan los promedios);
  }

  //Las siguientes cuatro lineas otorgan los valores obtenidos (con solamente dos decimales) a los elementos del JSON creado;
  statistics.promedioDeVotosDemocrats = promedioDeVotos(democratObj).toFixed(2);
  statistics.promedioDeVotosRepublicans = promedioDeVotos(republicanObj).toFixed(2);
  statistics.promedioDeVotosIndependents = promedioDeVotos(independentObj).toFixed(2);
  statistics.promedioDeVotosTotal = promedioDeVotos(members).toFixed(2);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  //La siguiente variable guarda el valor de senadores buscado (el 10%);
  var cantidadBuscadaDeSenadores = Math.floor(members.length * 10 / 100);

  //La siguiente variable guarda un array con todos los senadores, comenzando del menos fiel y terminando por los que son más;
  var filtradoDeSenadoresMenosFieles = (members.sort(function (a, b) {
    return parseFloat(a.total_votes) - parseFloat(b.total_votes);
  }));

  //El siguiente renglón envía la cantidad de senadores buscada al JSON "statistics". La función slice permite recortar el array;
  statistics.senadoresMenosFieles = filtradoDeSenadoresMenosFieles.slice(0, cantidadBuscadaDeSenadores);

  //Ídem para los senadores más fieles;
  var filtradoDeSenadoresMasFieles = (members.reverse(function (a, b) {
    return parseFloat(a.total_votes) - parseFloat(b.total_votes);
  }));
  statistics.senadoresMasFieles = filtradoDeSenadoresMasFieles.slice(0, cantidadBuscadaDeSenadores);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //La siguiente variable guarda un array con todos los senadores comenzando por el senador más comprometido (menos ausencias) y terminando por el menos comprometido;
  var filtradoDeSenadoresMasComprometidos = (members.sort(function (a, b) {
    return parseFloat(a.missed_votes) - parseFloat(b.missed_votes);
  }));

  statistics.senadoresMasComprometidos = filtradoDeSenadoresMasComprometidos.slice(0, cantidadBuscadaDeSenadores);

  //Ídem con los senadores menos comprometidos;
  var filtradoDeSenadoresMenosComprometidos = (members.reverse(function (a, b) {
    return parseFloat(a.missed_votes) - parseFloat(b.missed_votes);
  }));

  statistics.senadoresMenosComprometidos = filtradoDeSenadoresMenosComprometidos.slice(0, cantidadBuscadaDeSenadores);

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
      senadoresMasFieles: [],
      senadoresMenosFieles: [],
      senadoresMasComprometidos:[],
      senadoresMenosComprometidos:[],
    },
  });

  //Las siguientes líneas otorgan a los elementos de la variable app los resultados obtenidos;
  app.partyInfo[0].numberOfMembers = statistics.numberOfRepublicans;
  app.partyInfo[0].percentajeOfVotes = statistics.promedioDeVotosRepublicans;

  app.partyInfo[1].numberOfMembers = statistics.numberOfDemocrats;
  app.partyInfo[1].percentajeOfVotes = statistics.promedioDeVotosDemocrats;

  app.partyInfo[2].numberOfMembers = statistics.numberOfIndependents;
  app.partyInfo[2].percentajeOfVotes = statistics.promedioDeVotosIndependents;

  app.partyInfo[3].numberOfMembers = statistics.totalSenators;
  app.partyInfo[3].percentajeOfVotes = statistics.promedioDeVotosTotal;

  app.senadoresMasFieles = statistics.senadoresMasFieles;
  app.senadoresMenosFieles = statistics.senadoresMenosFieles;
  app.senadoresMasComprometidos =statistics.senadoresMasComprometidos;
  app.senadoresMenosComprometidos =statistics.senadoresMenosComprometidos;
  
}

/*
var string = JSON.stringify(statistics);
var nuevoValor = JSON.parse(string);
var estadisticas = nuevoValor;

//console.log(estadisticas);

var tablaSenateAtAGlance = document.getElementById("senateAtAGlance");
var tbody = document.createElement("tbody");

//La siguiente función dibuja la tabla de los "senadores en una primera mirada", tomando como parametro el array completo y distribuyendo los datos como es pedido;
function dibujarTablaGeneral() {
  var tabla = "<thead class='thead-dark'><tr>" +
    "<th>Party</th>" +
    "<th>No. of Reps</th>" +
    "<th>%voted with paty</th>" +
    "</tr>" +
    "</thead>";
  tabla += "<tr><td>Democrats</td>" + "<td>" + estadisticas.numberOfDemocrats + "</td><td>" + estadisticas.promedioDeVotosDemocrats + "% </td></tr>";
  tabla += "<tr><td>Republicans</td>" + "<td>" + estadisticas.numberOfRepublicans + "</td><td>" + estadisticas.promedioDeVotosRepublicans + "% </td></tr>";
  tabla += "<tr><td>Independents</td>" + "<td>" + estadisticas.numberOfIndependents + "</td><td>" + estadisticas.promedioDeVotosIndependents + "% </td></tr>";
  tabla += "<tr><td>Total</td>" + "<td>" + estadisticas.totalSenators + "</td><td>" + estadisticas.promedioDeVotosTotal + "% </td></tr>";

  tablaSenateAtAGlance.innerHTML = tabla;
}
dibujarTablaGeneral(estadisticas);
*/
