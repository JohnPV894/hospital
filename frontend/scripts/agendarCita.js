
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
            success: async function ( respuesta ) {
                  respuesta.forEach( especialista => {
                        let nombreCompleto =`${especialista.nombre} ${especialista.apellido}`;
                        $("#especialistasList").append(
                              `<option value="${nombreCompleto}" data-id="${especialista._id}">`
                        );
                  });
                  coleccionCitas=await respuesta;

                  
            },
            error: function(xhr, status, error) {
                  alert("Fallo al recuperar especialistas");
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
            success: async function ( respuesta ) {
                  respuesta.forEach( paciente => {
                  let nombreCompleto =`${paciente.nombre} ${paciente.apellido}`;
                  $("#pacientesList").append(
                              
                              `<option value="${nombreCompleto}" data-id="${paciente._id}">`
                        );
                  });
                  coleccionCitas=await respuesta;

            },
            error: function(xhr, status, error) {
                  alert("Fallo al recuperar pacientes");
                  alert("vuelva a intentarlo en unos minutos")
                  console.error(error);
            }
            
      });
      
      $("#contenedorFormCitas").click(function (e) { 
            e.preventDefault();
            $("#contenedorCrearCita").fadeIn();   
      });

      $("#esconderForm").click(function (e) { 
            e.preventDefault();
            $("#contenedorCrearCita").fadeOut();
      });

      //Enviar formulario Crear Cita
      $("#crearCita").click(function (e) { 

            //guardamos el valor de la opcion
            let especialista = $("#especialista").val();
            let paciente = $("#paciente").val();
            let fechaCita = $("#fechaCita").val();
            //buscamos en el html la opcion cuyo valor sea esa y conseguimos la id
            let idPaciente = $(`#pacientesList option[value="${paciente}"]`).attr("data-id");
            let idEspecialista = $(`#especialistasList option[value="${especialista}"]`).attr("data-id");
            
            let datos = 
            {     "especialistaID":idEspecialista,
                  "pacienteID":idPaciente,
                  "fecha":fechaCita};
                  console.log(datos);
                  
            $("#contenedorCrearCita").fadeOut();      
            $.ajax({
                  type: "post",
                  url: "http://localhost:5000/citas/crear",
                  data: JSON.stringify(datos),
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                        if (response.id==null || response==null) {
                              alert("cita no pudo ser Agendada")
                        }else{
                              alert("cita pudo ser Agendada")
                        }
                        
                  },
                  
            });

            
      });
});