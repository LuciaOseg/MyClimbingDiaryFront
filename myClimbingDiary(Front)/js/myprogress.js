
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

var rutasCompletas = [];
var zonas = [];
var rutasPorZona = [];

var grados = []
var rutasPorGrado = [];

var entradasPorZona = [];

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
        if($.inArray(entries[i].nombre, rutas) >= 0) {
          // console.log('entry already exists')
          let index = rutas.indexOf(entries[i].nombre)
          pegues[index] = pegues[index] + parseInt(entries[i].pegues[0].numeroPegues)
        }
        else {
          rutas.push(entries[i].nombre);
          pegues.push(parseInt(entries[i].pegues[0].numeroPegues));
          // Incluir en rutasCompletas la entrada completa porque sirve para la segunda gráfica
          rutasCompletas.push(entries[i]);
        }
      }
      //console.log(rutas)
      //console.log(pegues)

      dataChart1()

      // datos para la chart 2 y 4 - Número de rutas por zonas, y número de pegues por zona
      for (i = 0; i < rutasCompletas.length; i++) {
        console.log(rutasCompletas[i]);
        if($.inArray(rutasCompletas[i].zona, zonas) >= 0) {
          let index = zonas.indexOf(rutasCompletas[i].zona);
          //console.log(rutasCompletas[i].zona);
          rutasPorZona[index] = rutasPorZona[index] + 1;
          //console.log(index);
          entradasPorZona[index] = entradasPorZona[index] + parseInt(pegues[i]);
        }
        else {
          zonas.push(rutasCompletas[i].zona);
          let index = zonas.indexOf(rutasCompletas[i].zona);
          rutasPorZona[index] = 1;
          entradasPorZona[index] = pegues[i];
        }
      }
      //console.log(rutasCompletas);
      //console.log(entradasPorZona);
      //console.log(zonas)
      //console.log(rutasPorZona)
      dataChart2();
      dataChart4();

      // datos para la chart 3 - Número de rutas por grado
      for (i = 0; i < rutasCompletas.length; i++) {
        if($.inArray(rutasCompletas[i].grado, grados) >= 0) {
          let index = grados.indexOf(rutasCompletas[i].grado);
          rutasPorGrado[index] = rutasPorGrado[index] + 1;
        }
        else {
          grados.push(rutasCompletas[i].grado);
          let index = grados.indexOf(rutasCompletas[i].grado);
          rutasPorGrado[index] = 1;
        }
      }
      //console.log("rutas completas: ",rutasCompletas)
      //console.log("grados: ",grados)
      //console.log("rutas por grado: ", rutasPorGrado)
      dataChart3();


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
  // console.log(data)

  new Chartist.Bar('#chart1', data);
}

function dataChart2() {
  data = {
    labels: zonas,
    series: [rutasPorZona]
  };
  // console.log(data)

  new Chartist.Bar('#chart2', data);
}

function dataChart3() {
  data = {
    labels: grados,
    series: [rutasPorGrado]
  };
  // console.log(data)

  new Chartist.Bar('#chart3', data);
}
function dataChart4() {
  data = {
    labels: zonas,
    series: [entradasPorZona]
  };
  // console.log(data)

  new Chartist.Bar('#chart4', data);
}
