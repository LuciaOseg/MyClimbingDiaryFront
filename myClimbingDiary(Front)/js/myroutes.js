//Jala el token para futuras acciones
var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

// Función para llamar de la base de datos todas las rutas de ese usuario
// y desplegarlas en la pantalla
function getRutas(){
  $.ajax({
    url: "https://myclimbingdiary.herokuapp.com/misrutas",
    headers: {
       'Content-Type':'application/json',
       'Authorization': 'Bearer ' + token
   },
    method: "GET",
    dataType: "json",
    success: function(data){
      for (var i = 0; i < data.length; i++) {
          $("#rutas_existentes").append(`<div class="col-sm-4">
                                          <div class="card bg-light">
                                            <div class="card-header">
                                              <h5 id="ruta_name">${data[i].nombre}</h5>
                                            </div>
                                            <div class="card-body">
                                              <p class="card-text">
                                                <strong>Zona:</strong> ${data[i].zona}
                                              </p>
                                              <p class="card-text">
                                                <strong>Grado:</strong> ${data[i].grado}
                                              </p>
                                            </div>
                                          </div>
                                            <br>
                                        </div>`);
      }
    },
    error: function(error_msg){
      console.error(error_msg)
    }
  });

}
getRutas();

//Añade nueva Ruta
$('#btn_save').on('click', function(){
  let nombre = $('#n_ruta').val();
  //checa si se selecciono una ruta
  //if(nombre != ""){
    json_to_send = {
      "nombre": $('#n_ruta').val(),
      "grado": $('#v_grado').val(),
      "zona": $('#n_zona').val(),
    };
  //}
    console.log(json_to_send);

    //checa si se llenaron los campos
    //if($('#v_grado').text()!= "" & $('#n_zona').text()!= ""){
        json_to_send = JSON.stringify(json_to_send);
        $.ajax({
          url: 'https://myclimbingdiary.herokuapp.com/misrutas',
          headers: {
              'Content-Type':'application/json',
              'Authorization': 'Bearer ' + token
          },
          method: 'POST',
          dataType: 'json',
          data: json_to_send,
          success: function(data){
            alert("Ruta agregada correctamente");
            console.log('success: '+ data);
            window.location = 'myroutes.html'
          },
          error: function(error_msg) {
            console.log(json_to_send);
              alert((error_msg['responseText']));
          }
        });

    //}else{
      //alert("Te falta llenar los campos");
    //}
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
