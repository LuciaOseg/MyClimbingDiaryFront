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
                                              <button id="btn_delete" type="button" class="btn btn-danger" value="${data[i]._id}">
                                                Delete
                                              </button>
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
    if($('#n_ruta').val()!= "" & $('#v_grado').val()!= "" & $('#n_zona').val()!= ""){
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

    }else{
      alert("Te falta llenar los campos");
    }
})

//Eliminar Registro
$(document).on('click', '#btn_delete', function(event) {
  event.preventDefault();
  const id = $(this).attr('value');
  console.log(id + "Borrando... ");
 $.ajax({
  //url: 'http://localhost:3000/users',
  url: 'https://myclimbingdiary.herokuapp.com/misrutas/' + id,
  method: 'DELETE',
  success: function(){
    alert("Registro Eliminado");
    console.log('Deleted ');
    window.location = 'myRoutes.html'
  },
  error: function(error_msg) {
      alert((error_msg['responseText']));
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
      window.location = 'index.html'
    },
    error: function(error_msg) {
        alert((error_msg['responseText']));
    }
  });

})
