"use strict";

$(document).ready(function(){
      let coleccionCitas;
      //Traer coleccion y hacer tarjetas
      $.ajax({
            type: "get",
            url: "http://localhost:5000/citas",
            data: "data",
            dataType: "json",
            contentType: "application/json",
            success: async function ( response) {
                  response.forEach(element => {
                  $(".contenedor-cuadros").append(
                        `<div class="tarjeta" data-id=${element._id}>
                          <div class="info-doctor">
                            <img src="../img/perfilIcon.png" alt="Foto" class="avatar">
                            <div class="texto">
                              <strong>${element.nombre}</strong><br>
                              Apellido ${element.apellido}<br><br>
                              Nacimiento: ${element.fechaNacimiento}<br>
                              DNI: ${element.dni}
                              <span> 
                                    <input  type="button" value="Borrar" id="borrar"/>
                                    <input  type="button" value="Editar" id="editar"/>  
                              <span/>
                            </div>
                          </div>
                        </div>`
                  );
                  });
            },
            error: function(xhr, status, error) {
                  alert("Fallo al recuperar Tarjetas");
                  alert("vuelva a intentarlo en unos minutos")
                  console.error(error);
            }
            
      });


      //Enviar formulario Crear paciente
      $("#enviarCrearPaciente").click(function (e) { 
            let nombre = $("#nombre").val();
            let apellido = $("#apellido").val();
            let dni = $("#dni").val();
            let telefono = $("#telefono").val();
            let fechaNacimiento = $("#fechaNacimiento").val();
            let datos = {
                        "dni":dni,
                        "nombre":nombre,
                        "apellido":apellido,
                        "telefono":telefono,
                        "fechaNacimiento":fechaNacimiento
                  };
            
            $.ajax({
                  type: "post",
                  url: "http://localhost:5000/pacientes/crear",
                  data: JSON.stringify(datos),
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                        console.log(response);
                        
                  },
                  error:alert("error al crear Paciente")
            });
            console.log("Crear paciente");
            
            
      });

      $("#desplegarCrearPaciente").click(function (e) { 
            e.preventDefault();
            $("#contenedorFormPaciente").fadeIn();
            console.log("mostrar");
            console.log(coleccionCitas);
            
      });
      $("#cancelarCrearPaciente").click(function (e) { 
            e.preventDefault();
            $("#contenedorFormPaciente").fadeOut();
            console.log("ocultar");
      });

      $("#desplegarCrearCita").click(function (e) { 
            e.preventDefault();
            $("#contenedorFormPaciente").fadeIn();
            console.log("mostrar");
            
      });
      $("#cancelarCrearCita").click(function (e) { 
            e.preventDefault();
            $("#contenedorFormPaciente").fadeOut();
            console.log("ocultar");
      });
      $(".contenedor-cuadros").on("click","#borrar", function (e) {
            e.preventDefault();
            let tarjeta = $(this).closest(".tarjeta");
            let id = tarjeta.data("id")
            console.log(id);
            
            $.ajax({
                  type: "delete",
                  url: "http://localhost:5000/citas/eliminar",
                  data: JSON.stringify({id}),
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                        if(response!=null){
                              alert(response.mensaje);
                        }
                  }
            });
      });
      
})