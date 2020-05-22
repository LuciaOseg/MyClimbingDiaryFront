
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

//Muestra seccion search
// $('#btn-search').on('click', function(){
//   console.log("ADD");
//   $('#display_entries').addClass('hidden')
//   $('#add_entry').removeClass('hidden')
// })

var date

var rutas = []

var misrutas = []

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

///Carga el nombre de las rutas en el select
function getmyFields(){
  // $("#selectRuta").children("option").remove();
  // $("#nombre_rutas").children("option").remove();
  $.ajax({
    url: "https://myclimbingdiary.herokuapp.com/misrutas",
    headers: {
       'Content-Type':'application/json',
       'Authorization': 'Bearer ' + token
   },
    method: "GET",
    dataType: "json",
    success: function(data){
      misrutas = data;
      //entries = data;
      //let zonas = data;
      //let zonasUnicas = Array.from(new Set(zonas.map(a => a.zona)));
      // let gradosUnicos = Array.from(new Set(zonas.map(a => a.grado)));
      //console.log(entries);
      // Llenar select de zonas 
      let nuevo_html = " ";
      // nuevo_html += `<option id="nulo"></option>`;
      for (var i = 0; i < data.length; i++) {
        misrutas = data
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
getmyFields();

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
  $("#diaryEntries").removeAttr("hidden");
  $("#diaryEntries").empty();
  let nombre = $('#selectRuta').children('option:selected').val();
  // let grado = $('#selectGrado').children('option:selected').val();


  $("#diaryEntries").innerHTML = "";
  let nuevo_html = " ";
  for (var i = 0; i < entries.length; i++) {
    // Si hay zona y grado
    if (nombre != '') {
      if(entries[i].nombre == nombre) {
        var d = new Date(entries[i].pegues[0].fecha);
        date = getFormattedDate(d)
  
        nuevo_html += `
        <div class="col-sm-4">
          <div class="card bg-light">
            <div class="card-header">
              <h5 id="entry_name">${entries[i].nombre}</h5>
            </div>
              <div" class="card-body">
                <p id="entry_zona" class="card-text">
                  <strong>Zona:</strong> ${entries[i].zona}
                </p>
                <p id="entry_grados" class="card-text">
                  <strong>Grado:</strong> ${entries[i].grado}
                </p>
                <p id="entry_date" class="card-text">
                  <strong>Fecha:</strong> ${date}
                </p>
                <p id="entry_pegues" class="card-text">
                  <strong>Pegues:</strong> ${entries[i].pegues[0].numeroPegues}
                </p>
                <p id=acomment class="card-text">
                  ${entries[i].pegues[0].comentario}
                </p>
                <button id="btn_delete" type="button" class="btn btn-danger" value="${entries[i]._id}">
                  Delete
                </button>
                <button id="btn_cancel" type="button" class="btn btn-danger" style="display: none">
                Cancel
                </button>
                <button id="btn_edit" type="button" class="btn btn-primary">
                  Edit
                </button>
                <button id="btn_patch" type="button" class="btn btn-primary" value="${entries[i]._id}" style="display: none">
                Save
                </button>
            </div>
          </div>
          <br>
        </div>
        `
       
      }
    } else {
      var d = new Date(entries[i].pegues[0].fecha);
      date = getFormattedDate(d)
      //Aqui muestra todas las entradas si seleccionas el campo vacio
      nuevo_html += `
        <div class="col-sm-4">
          <div class="card bg-light">
            <div class="card-header">
              <h5 id="entry_name">${entries[i].nombre}</h5>
            </div>
              <div class="card-body">
                <p id="entry_zona" class="card-text">
                  <strong>Zona:</strong> ${entries[i].zona}
                </p>
                <p id="entry_grados" class="card-text">
                  <strong>Grado:</strong> ${entries[i].grado}
                </p>
                <p id="entry_date" class="card-text">
                  <strong>Fecha:</strong> ${date}
                </p>
                <p id="entry_pegues" class="card-text">
                  <strong>Pegues:</strong> ${entries[i].pegues[0].numeroPegues}
                </p>
                <p id=acomment  class="card-text">
                  ${entries[i].pegues[0].comentario}
                </p>
                <button id="btn_delete" type="button" class="btn btn-danger" value="${entries[i]._id}">
                  Delete
                </button>
                <button id="btn_cancel" type="button" class="btn btn-danger" style="display: none">
                Cancel
                </button>
                <button id="btn_edit" type="button" class="btn btn-primary btn_edit" data-toggle="modal" >
                  Edit
                </button>
                <button id="btn_patch" type="button" class="btn btn-primary" value="${entries[i]._id}" style="display: none">
                Save
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

// modal Diary Nuevo Registro
$('#nombre_rutas').on('change', function(){
  $('#answer_grados').empty();
  $('#answer_zona').empty();
  let nombre = $(this).val();
  // let grado = $('#selectGrado').children('option:selected').val();


  // $("#diaryEntries").innerHTML = "";
  let nuevo_html = "";
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
  if(nuevo_html == ""){
    for (var i = 0; i < misrutas.length; i++) {
    // Si hay zona y grado
    if (nombre != '') {
      if(misrutas[i].nombre == nombre) {
        nuevo_html += `${misrutas[i].grado}`
        $('#answer_grados').append(nuevo_html)

        nuevo_html = ""
        nuevo_html += `${misrutas[i].zona}`
        $('#answer_zona').append(nuevo_html)
      }
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
            window.location = 'climbingDiary4.html'
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


//Si le pica a editar, cambia botones y comentario se puede modificar
$('#diaryEntries').on('click', "#btn_edit", function() {

  //Si le pica editar, el comentario se puede editar
  $(this).siblings('#acomment').attr('contenteditable', 'true');
  

  //Si le epica editar, esconde boton de editar y eliminar y muestra gbotones de guardar y cancelar
  $(this).toggle()
  $(this).siblings('#btn_patch').toggle()
  $(this).siblings('#btn_delete').toggle()
  $(this).siblings('#btn_cancel').toggle()

});

//Si le pica a cancela, cambia botones, y ya no es editable el campo de comentario
$('#diaryEntries').on('click',"#btn_cancel", function(){

  //Si le pica cancelar, el comentario ya no es editable
  $(this).siblings('#acomment').attr('contenteditable', 'false');

  //Si le epica cancelar, esconde boton de cancelar y guardar y muestra botones de editar y borrar
  $(this).toggle()
  $(this).siblings('#btn_patch').toggle()
  $(this).siblings('#btn_edit').toggle()
  $(this).siblings('#btn_delete').toggle()
  
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
      window.location = 'climbingDiary4.html'
    },
    error: function(error_msg) {
        alert((error_msg['responseText']));
    }
  });
})

$(document).on('click','#btn_patch', function(event){
    event.preventDefault();

    //Este nombre solo se puede sacar cuando selecionas el nombre de la ruta en el select
    //let nombre = $('#selectRuta').children('option:selected').val()

    let cardNombre= $(this).parent().parent()
    let cardNombre2= cardNombre.children(".card-header")
    let nombre= cardNombre2.children().text()


    //Saca el id del registro
    const id = $(this).attr('value')


    //Guarda los textos de los campos de la forma en donde se le hizo click, para enviarlos
    //let nombre = $(this).siblings("entry_name").text()
    let grado= $(this).siblings('#entry_grados').text().replace('Grado: ','').replace(/\n/ig,'').trim()
    let zona= $(this).siblings('#entry_zona').text().replace('Zona:','').replace(/\n/ig,'').trim()
    let fecha= $(this).siblings('#entry_date').text().replace('Fecha: ','').replace(/\n/ig,'').trim()
    let pegues= $(this).siblings('#entry_pegues').text().replace('Pegues: ','').replace(/\n/ig,'').trim()
    let comentario= $(this).siblings('#acomment').text().replace(/\n/ig,'').trim()

    json_to_send = {
      "nombre": nombre,
      "grado": grado,
      "zona": zona,
      "pegues": [{
        "fecha": fecha,
        "numeroPegues": pegues,
        "comentario": comentario
      }]
    };


    //checa si se llenaron los campos
    if(comentario!= ""){
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
            window.location = 'climbingDiary4.html'
          },
          error: function(error_msg) {
            console.log(json_to_send);
              alert((error_msg['responseText']));
          }
        });

      }
      else{
        alert("Te falta llenar el comentario");
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
