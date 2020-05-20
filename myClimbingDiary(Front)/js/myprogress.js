
//Jala el token para futuras acciones
var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

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


var entries = [];

var rutas = [];
var pegues = [];

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
      console.log(data)

      // datos para las chart 1
      // nombres de las rutas y número de pegues
      for(i = 0; i < entries.length; i++) {
        rutas.push(entries[i].nombre);
        pegues.push(parseInt(entries[i].pegues[0].numeroPegues));
      }
     
      dataChart1()
    },
    error: function(error_msg){
      console.error(error_msg)
    }
  });
}
getEntries();

var data 

function dataChart1() {
  data = {
    labels: rutas,
    series: [pegues]
  };
  console.log(data)

  new Chartist.Bar('#chart1', data);
}



