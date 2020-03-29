
//Jala el token para futuras acciones
var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

// Search
$('#btn-search').on('click', function(){
  console.log("search");

  let zona = $('#selectZona').children('option:selected').val();
  let grado = $('#selectGrado').children('option:selected').val();

  console.log(zona, grado);

  $("#resultados_busqueda").innerHTML = "";

  $.ajax({
  url: "https://myclimbingdiary.herokuapp.com/rutas",
  method: "GET",
  dataType: "json",

  success: function(data){
    let nuevo_html = " ";
    // nuevo_html += `<option id="nulo">Selecciona una ruta</option>`;
    for (var i = 0; i < data.length; i++) {
      if(data[i].zona == zona && data[i].grado == grado) {
        nuevo_html += `
        <div class="col-sm-3">
          <div class="card bg-light">
            <div class="card-header">
              <h5>${data[i].zona}</h5>
            </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Ruta:</strong> ${data[i].nombre}
                </p>
                <p class="card-text">
                  <strong>Grado:</strong> ${data[i].grado}
                </p>
                <button type="button" class="btn btn-primary">
                  Add
                </button>
              </div>
          </div>
          <br>
        </div>
        `
      }
    }
    if(nuevo_html == ""){
      alert("No se encontraron rutas");
    } else {
      $("#resultados_busqueda").append(nuevo_html);
    }
  },
  error: function(error_msg){
    console.error(error_msg)
  }
});
})


//Logout
$('#btn_logout').on('click', function(){
    console.log("Logout");

  $.ajax({
    //url: 'http://localhost:3000/users',
    url: 'https://myclimbingdiary.herokuapp.com/logout',
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
    method: 'POST',
    success: function(){
      alert("Bye Bye");
      console.log('success: ');
      window.location = 'index2.html'
    },
    error: function(error_msg) {
        alert((error_msg['responseText']));
    }
  });

})
