fetch('https://openstates.org/api/v1/legislators/', {
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