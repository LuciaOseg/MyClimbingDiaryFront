
//Jala la fecha
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

//Jala el token para futuras acciones
var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

//Set the date for today
$(document).ready( function() {
    $('#date').val(new Date().toDateInputValue());
});

//Cambia formato de la fecha
function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
}

//Muestra seccion Añadir
$('#btn_add').on('click', function(){
  console.log("ADD");
  $('#display_entries').addClass('hidden')
  $('#add_entry').removeClass('hidden')
})

var rutas = []

///Carga el nombre de las rutas en el select
function getFields(){
  $("#selectRuta").children("option").remove();
  $("#nombre_rutas").children("option").remove();
  $.ajax({
    url: "https://myclimbingdiary.herokuapp.com/rutas",
    method: "GET",
    dataType: "json",

    success: function(data){
      rutas = data;
      //entries = data;
      //let zonas = data;
      //let zonasUnicas = Array.from(new Set(zonas.map(a => a.zona)));
      // let gradosUnicos = Array.from(new Set(zonas.map(a => a.grado)));
      //console.log(entries);
      // Llenar select de zonas 
      let nuevo_html = " ";
      nuevo_html += `<option id="nulo"></option>`;
      for (var i = 0; i < data.length; i++) {
        fields = data
        nuevo_html += `
        <option value="${data[i].nombre}">
          ${data[i].nombre}
        </option>
        `
      }
      $("#selectRuta").append(nuevo_html);
      $("#nombre_rutas").append(nuevo_html);
    },
    error: function(error_msg){
      console.error(error_msg)
    }
  });
}
getFields();

var entries = [];

function getEntries(){
  //$("#nombre_rutas").children("option").remove();
  $.ajax({
    url: "https://myclimbingdiary.herokuapp.com/proyectos",
    headers: {
       'Content-Type':'application/json',
       'Authorization': 'Bearer ' + token
   },
    method: "GET",
    dataType: "json",


    success: function(data){
      entries = data;
    },
    error: function(error_msg){
      console.error(error_msg)
    }
  });
}
getEntries();

// Search
$('#btn-search').on('click', function(){
  $("#diaryEntries").empty();
  let nombre = $('#selectRuta').children('option:selected').val();
  // let grado = $('#selectGrado').children('option:selected').val();


  $("#diaryEntries").innerHTML = "";
  let nuevo_html = " ";
  for (var i = 0; i < entries.length; i++) {
    // Si hay zona y grado
    if (nombre != '') {
      if(entries[i].nombre == nombre) {
        nuevo_html += `
        <div class="col-sm-4">
          <div class="card bg-light">
            <div class="card-header">
              <h5 id="entry_name">${entries[i].nombre}</h5>
            </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Zona:</strong> ${entries[i].zona}
                </p>
                <p class="card-text">
                  <strong>Grado:</strong> ${entries[i].grado}
                </p>
                <p class="card-text">
                  <strong>Fecha:</strong> ${entries[i].pegues[0].fecha}
                </p>
                <p class="card-text">
                  <strong>Pegues:</strong> ${entries[i].pegues[0].numeroPegues}
                </p>
                <p class="card-text">
                  ${entries[i].pegues[0].comentario}
                </p>
                <button type="button" class="btn btn-danger">
                  Delete
                </button>
                <button type="button" class="btn btn-primary">
                  Edit
                </button>
              </div>
          </div>
          <br>
        </div>
        `
      }
    } else {
      nuevo_html += `
        <div class="col-sm-4">
          <div class="card bg-light">
            <div class="card-header">
              <h5 id="entry_name">${entries[i].nombre}</h5>
            </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Zona:</strong> ${entries[i].zona}
                </p>
                <p class="card-text">
                  <strong>Grado:</strong> ${entries[i].grado}
                </p>
                <p class="card-text">
                  <strong>Fecha:</strong> ${entries[i].pegues[0].fecha}
                </p>
                <p class="card-text">
                  <strong>Pegues:</strong> ${entries[i].pegues[0].numeroPegues}
                </p>
                <p class="card-text">
                  ${entries[i].pegues[0].comentario}
                </p>
                <button type="button" class="btn btn-danger">
                  Delete
                </button>
                <button type="button" class="btn btn-primary">
                  Edit
                </button>
              </div>
          </div>
          <br>
        </div>
        `
    } 
   

    }
    $("#diaryEntries").append(nuevo_html);
})

// modal Diary
$('#nombre_rutas').on('change', function(){
  $('#answer_grados').empty();
  $('#answer_zona').empty();
  let nombre = $(this).val();
  // let grado = $('#selectGrado').children('option:selected').val();


  // $("#diaryEntries").innerHTML = "";
  let nuevo_html = " ";
  for (var i = 0; i < rutas.length; i++) {
    // Si hay zona y grado
    if (nombre != '') {
      if(rutas[i].nombre == nombre) {
        nuevo_html += `${rutas[i].grado}`
        $('#answer_grados').append(nuevo_html)

        nuevo_html = ""
        nuevo_html += `${rutas[i].zona}`
        $('#answer_zona').append(nuevo_html)
      }
    }
   

  }
})

//Añade nuevo Registro
$('#btn_save').on('click', function(){
  let nombre = $('#nombre_rutas').children('option:selected').val();
  //checa si se selecciono una ruta
  if(nombre != ""){
    json_to_send = {
      "nombre": nombre,
      "grado": $('#answer_grados').text(),
      "zona": $('#answer_zona').text(),
      "pegues": [{
        "fecha": $('#date').val(),
        "numeroPegues": $('#num').val(),
        "comentario": $('#com').val()
      }]
    };
    console.log(json_to_send);

    //checa si se llenaron los campos
    if($('#num').val()!= "" & $('#com').val()!= ""){
        json_to_send = JSON.stringify(json_to_send);

        $.ajax({
          //url: 'http://localhost:3000/users',
          url: 'https://myclimbingdiary.herokuapp.com/proyectos',
          headers: {
              'Content-Type':'application/json',
              'Authorization': 'Bearer ' + token
          },
          method: 'POST',
          dataType: 'json',
          data: json_to_send,
          success: function(data){
            alert("Registro agregado con exito");
            console.log('success: '+ data);
            window.location = 'climbingDiary3.html'
          },
          error: function(error_msg) {
            console.log(json_to_send);
              alert((error_msg['responseText']));
          }
        });

      }
      else{
        alert("Te falta llenar los campos");
      }
    } else {
      alert("No has seleccionado la ruta");
    }


})



//Editar Registros
//Muestra Editar
$(document).on('click',"#btn_edit", function(){
  console.log("EDIT");
  $('#acomment').addClass('hidden')
  $('#ncomment').removeClass('hidden')
  $('#btn_patch').removeClass('hidden')
  $('#btn_patch').addClass('button')
  $(this).removeClass('button')
  $(this).addClass('hidden')
})



//Eliminar Registro
$(document).on('click', '#btn_delete', function(event) {
    event.preventDefault();
    const id = $(this).attr('value');
    console.log(id + "Borrando... ");
   $.ajax({
    //url: 'http://localhost:3000/users',
    url: 'https://myclimbingdiary.herokuapp.com/proyectos/' + id,
    method: 'DELETE',
    success: function(){
      alert("Registro Eliminado");
      console.log('Deleted ');
      window.location = 'climbingDiary3.html'
    },
    error: function(error_msg) {
        alert((error_msg['responseText']));
    }
  });
})

//Editar Registro
/*$(document).on('click', '#btn_edit', function(event) {
    event.preventDefault();
    const id = $(this).attr('value');
    console.log(id + "Editando... ");
    $.ajax({
        url: 'https://myclimbingdiary.herokuapp.com/proyectos/' + id,
        method: 'PATCH'
        }).done(function(res) {
            if (res.success) {
            console.log('id from ajax call is', res);
            window.location = 'climbingDiary.html';
        } else {
            console.log('error...ajax');
            }
});
})*/

$(document).on('click','#btn_patch', function(event){
    event.preventDefault();
    const id = $(this).attr('value');

    json_to_send = {
      "nombre": nomSelec,
      "grado": $('#answer_grados').text(),
      "zona": $('#answer_zona').text(),
      "pegues": [{
        "fecha": $('#date').val(),
        "numeroPegues": $('#num').val(),
        "comentario": $('#ncomment').val()
      }]
    };

    //checa si se llenaron los campos
    if($('#ncomment').val()!= ""){
        json_to_send = JSON.stringify(json_to_send);

        $.ajax({
          //url: 'http://localhost:3000/users',
          url: 'https://myclimbingdiary.herokuapp.com/proyectos/' + id,
          headers: {
              'Content-Type':'application/json',
              'Authorization': 'Bearer ' + token
          },
          method: 'PATCH',
          dataType: 'json',
          data: json_to_send,
          success: function(data){
            alert("Registro editado con exito");
            console.log('Edit: '+ data + "id: "+ id);
            window.location = 'climbingDiary3.html'
          },
          error: function(error_msg) {
            console.log(json_to_send);
              alert((error_msg['responseText']));
          }
        });

      }
      else{
        alert("Te falta llenar los campos");
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
