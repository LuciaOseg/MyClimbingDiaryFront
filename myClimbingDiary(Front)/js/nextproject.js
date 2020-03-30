var rutas = [];
///Carga el nombre de las rutas en el select
function getFields(){
  $("#nombre_rutas").children("option").remove();
$.ajax({
  url: "https://myclimbingdiary.herokuapp.com/rutas",
  method: "GET",
  dataType: "json",

  success: function(data){
    rutas = data;
    let zonas = data;
    let zonasUnicas = Array.from(new Set(zonas.map(a => a.zona)));
    let gradosUnicos = Array.from(new Set(zonas.map(a => a.grado)));
    
    // Llenar select de zonas 
    let nuevo_html = " ";
    nuevo_html += `<option id="nulo"></option>`;
    for (var i = 0; i < zonasUnicas.length; i++) {
      fields = data
      nuevo_html += `
      <option value="${zonasUnicas[i]}">
        ${zonasUnicas[i]}
      </option>
      `
    }
    $("#selectZona").append(nuevo_html);

    // Llenar select de grados
    nuevo_html = " ";
    nuevo_html += `<option id="nulo"></option>`;
    for (var i = 0; i < gradosUnicos.length; i++) {
      fields = data
      nuevo_html += `
      <option value="${gradosUnicos[i]}">
        ${gradosUnicos[i]}
      </option>
      `
    }
    $("#selectGrado").append(nuevo_html);
  },
  error: function(error_msg){
    console.error(error_msg)
  }
});
}
getFields();
//Jala el token para futuras acciones
var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

// Search
$('#btn-search').on('click', function(){
  $("#resultados_busqueda").empty();

  let zona = $('#selectZona').children('option:selected').val();
  let grado = $('#selectGrado').children('option:selected').val();

  

  $("#resultados_busqueda").innerHTML = "";
  let nuevo_html = " ";
  for (var i = 0; i < rutas.length; i++) {
    // Si hay zona y grado
    if (zona != '' && grado != '') {
      if(rutas[i].zona == zona && rutas[i].grado == grado) {
        nuevo_html += `
        <div class="col-sm-3">
          <div class="card bg-light">
            <div class="card-header">
              <h5>${rutas[i].zona}</h5>
            </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Ruta:</strong> ${rutas[i].nombre}
                </p>
                <p class="card-text">
                  <strong>Grado:</strong> ${rutas[i].grado}
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
    // si solo hay zona
    if (zona != '' && grado == '') {
      if (rutas[i].zona == zona) {
        nuevo_html += `
        <div class="col-sm-3">
          <div class="card bg-light">
            <div class="card-header">
              <h5>${rutas[i].zona}</h5>
            </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Ruta:</strong> ${rutas[i].nombre}
                </p>
                <p class="card-text">
                  <strong>Grado:</strong> ${rutas[i].grado}
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
    // si solo hay grado
    if (grado != '' && zona == '') {
      if (rutas[i].grado == grado) {
        nuevo_html += `
        <div class="col-sm-3">
          <div class="card bg-light">
            <div class="card-header">
              <h5>${rutas[i].zona}</h5>
            </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Ruta:</strong> ${rutas[i].nombre}
                </p>
                <p class="card-text">
                  <strong>Grado:</strong> ${rutas[i].grado}
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
    

    }
    
  if(nuevo_html == ""){
    alert("No se encontraron rutas");
  } else {
    $("#resultados_busqueda").append(nuevo_html);
  }
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
