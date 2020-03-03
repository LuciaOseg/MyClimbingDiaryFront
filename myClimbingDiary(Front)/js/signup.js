
$('#signup_button').on('click', function(){
  // cargar los valores de password, email, name, age
  json_to_send = {
    "password" : $("#password").val(),
    "email": $("#email").val(),
    "name": $("#name").val(),
    "age": $("#age").val()
  };
  console.log("entra")
if($("#password").val()!= "" & $("#email").val()!= "" & $("#name").val()!= "" &$("#age").val()!="")
{
  json_to_send = JSON.stringify(json_to_send);

  $.ajax({
    //url: 'http://localhost:3000/users',
    url: 'https://myclimbingdiary.herokuapp.com/users',
    headers: {
        'Content-Type':'application/json'
    },
    method: 'POST',
    dataType: 'json',
    data: json_to_send,
    success: function(data){
      alert("Usuario creado con exito");
      console.log('success: '+ data);
      window.location = 'index.html'
    },
    error: function(error_msg) {
      alert((error_msg['responseText']));
    }
  });
} else {
  alert("Te falta llenar los campos");
}

});
