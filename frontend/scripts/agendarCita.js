
$(document).ready(function(){
      let coleccionCitas;
      let coleccionPacientes;
      //Traer coleccion y hacer tarjetas
      $.ajax({
            type: "get",
            url: "http://localhost:5000/especialistas",
            data: "data",
            dataType: "json",
            contentType: "application/json",
            success: async function ( response) {
                  coleccionCitas=await response;
            },
            error: function(xhr, status, error) {
                  alert("Fallo al recuperar Tarjetas");
                  alert("vuelva a intentarlo en unos minutos")
                  console.error(error);
            }
            
      });
      $.ajax({
      type: "get",
      url: "http://localhost:5000/pacientes",
      data: "data",
      dataType: "json",
      contentType: "application/json",
            success: async function ( response) {
                  coleccionPacientes=await response
            },
            error: function(xhr, status, error) {
                  alert("Fallo al recuperar Tarjetas");
                  alert("vuelva a intentarlo en unos minutos")
                  console.error(error);
            }
            
      });
      $("#contenedorFormCitas").click(function (e) { 
            console.log("click");
            
            e.preventDefault();
            console.log(coleccionCitas);
            console.log("/");
            console.log(coleccionPacientes);
            
            
      });
});