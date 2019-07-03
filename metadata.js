fetch('https://openstates.org/api/v1/metadata/', {
  method: 'GET',
  headers: {
    'X-API-Key': '15d4b628-db0d-4267-98df-ef1cc4654e4d'
  }
}).then((response) => {
  return response.json();
}).then((json) => {
  data = json;
  console.log(data);
}).catch((error) => {
  console.log("error:" + error);
});




function mustache(valor) {

  var str = JSON.stringify(data, null, 2);
  var valor = JSON.parse(str);


  var members = valor;

  data.full_name = function () {
    return getfull_name(this);
  }
  data.party = function () {
    return getparty(this);
  }
  data.chamber = function () {
    return getchamber(this);

  }
  
  
  var template = document.getElementById("member-template").innerHTML;
  var html = Mustache.render(template, data);

}
