//Mostrar div de diary
$('#diary').click(function() { 
  document.getElementById("search_form").style.display = "block";
});


//////
$('#body-row .collapse').collapse('hide'); 

// Collapse/Expand icon
$('#collapse-icon').addClass('fa-angle-double-left'); 

// Collapse click
$('[data-toggle=sidebar-colapse]').click(function() {
    SidebarCollapse();
});

function SidebarCollapse () {
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
    
    // Treating d-flex/d-none on separators with title
    var SeparatorTitle = $('.sidebar-separator-title');
    if ( SeparatorTitle.hasClass('d-flex') ) {
        SeparatorTitle.removeClass('d-flex');
    } else {
        SeparatorTitle.addClass('d-flex');
    }
    
    // Collapse/Expand icon
    $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
}





/////////////////


//Jala la fecha
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

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

var date
//Muestra seccion seleccionada
$('#btn_select').on('click', function(){
  $("#form").children("section").remove();
  //checa si selecciono alguna ruta
  if(nomSelec != null){
   $('#add_entry').addClass('hidden')
   $('#display_entries').removeClass('hidden')

   $.ajax({
     url: "https://myclimbingdiary.herokuapp.com/proyectos",
     headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
     method: "GET",
     dataType: "json",

     success: function(data){
        let nuevo_html = " ";
        var count = 0;
        for (var i = 0; i < data.length; i++) {
          if(nomSelec==data[i].nombre){
            count=count+1;
            var d = new Date(data[i].pegues[0].fecha);
            date = getFormattedDate(d)
            fields = data
           nuevo_html += `
           <section id="miniForm" class="group">
           <label id="nombre">${nomSelec}</label>
           <label id="fecha">${date}</label>
           <label id= "pegues"> ${data[i].pegues[0].numeroPegues} pegues</label>

           <div id="comment" >
             <label  id="acomment">${data[i].pegues[0].comentario}</label>
             <input id="ncomment" type="text" name="newcomentario" placeholder="add new comment" class="hidden">
           </div>
           <button id="btn_edit" class="button">Editar</button>
           <button id="btn_patch" value="${data[i]._id}" class="hidden">Actualizar</button>
           <button id="btn_delete" value="${data[i]._id}" class="button">Eliminar</button>
            </section>`
          }
      }
      console.log(count)
      if(count==0){
        nuevo_html += `
        <section id="miniForm" class="group">
        <label id="nombre">No tienes entradas de ${nomSelec}</label>
         </section>`

      }
       $("#form").append(nuevo_html);
       getFields()
     },
     error: function(error_msg){
       console.error(error_msg)
     }
   });



 } else {
   alert("No has seleccionado la ruta");
 }

})
//Muestra seccion Añadir
$('#btn_add').on('click', function(){
  console.log("ADD");
  $('#display_entries').addClass('hidden')
  $('#add_entry').removeClass('hidden')
})


///Carga el nombre de las rutas en el select
function getFields(){
  $("#nombre_rutas").children("option").remove();
$.ajax({
  url: "https://myclimbingdiary.herokuapp.com/rutas",
  method: "GET",
  dataType: "json",

  success: function(data){
    let nuevo_html = " ";
    nuevo_html += `<option id="nulo">Selecciona una ruta</option>`;
    for (var i = 0; i < data.length; i++) {
      fields = data
      nuevo_html += `
      <option value="${data[i]._id}">
        ${data[i].nombre}
      </option>
      `
    }
    $("#nombre_rutas").append(nuevo_html);
  },
  error: function(error_msg){
    console.error(error_msg)
  }
});
}

var fields, nomSelec;
getFields();

//Saca valor zona y grado
function getInfoField(seleccionadoField){
  nomSelec= seleccionadoField.nombre
  console.log(nomSelec)
  if(seleccionadoField.grado != null){
    $('#answer_grados').text(seleccionadoField.grado)
  }
  if(seleccionadoField.zona != null){
    $('#answer_zona').text(seleccionadoField.zona)
  }

}

//Cambia el valor de nombre
$("#nombre_rutas").on('change', function(event){
  let seleccionado = $(this).val();
  if(seleccionado != "nulo"){
    //Remove the "Select the category" option
    $("#nulo").remove();
  }

  //Buscar por el valor seleccionado entre todos los Fields
  for (var i = 0; i < fields.length; i++) {
    if(fields[i]._id == seleccionado){
      getInfoField(fields[i]);
    }
  }
})


//Jala el token para futuras acciones
var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

//Añade nuevo Registro
$('#btn_save').on('click', function(){
  //checa si se selecciono una ruta
  if(nomSelec != null){
    json_to_send = {
      "nombre": nomSelec,
      "grado": $('#answer_grados').text(),
      "zona": $('#answer_zona').text(),
      "pegues": [{
        "fecha": $('#date').val(),
        "numeroPegues": $('#num').val(),
        "comentario": $('#com').val()
      }]
    };

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
            window.location = 'climbingDiary2.html'
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
      window.location = 'climbingDiary2.html'
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
            window.location = 'climbingDiary2.html'
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
      window.location = 'index.html'
    },
    error: function(error_msg) {
        alert((error_msg['responseText']));
    }
  });

})
