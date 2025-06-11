"use strict";

$(document).ready(function(){
      let coleccionEspecialistas;
      //Traer coleccion y hacer tarjetas
      $.ajax({
            type: "get",
            url: "http://localhost:5000/especialistas",
            data: "data",
            dataType: "json",
            contentType: "application/json",
            success: async function ( response) {
                  coleccionEspecialistas=response;
                  response.forEach(element => {
                  $(".contenedor-tarjetas").append(
                        `<div class="tarjeta" data-id=${element._id}>
                          <div class="info-doctor">
                            <img src="../img/perfilIcon.png" alt="Foto" class="avatar">
                            <div class="texto">
                              <strong>${element.nombre}</strong><br>
                              ${element.apellido}<br><br>
                              Rama: ${element.rama}<br>
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
      

      //Enviar formulario Crear Especialisa
      $("#enviarCrearPaciente").click(function (e) { 
            let nombre = $("#nombre").val();
            let apellido = $("#apellido").val();
            let dni = $("#dni").val();
            let rama = $("#rama").val();
            let fechaNacimiento = $("#fechaNacimiento").val();
            let datos = {
                        "nombre":nombre,
                        "apellido":apellido,
                        "dni":dni,
                        "rama":rama,
                        "fechaNacimiento":fechaNacimiento
                  };
            $.ajax({
                  type: "post",
                  url: "http://localhost:5000/especialistas/crear",
                  data: JSON.stringify(datos),
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                        if (response.id==null || response==null) {
                              alert("Especialista "+datos.nombre+" no pudo ser Creado")
                        }else{
                              alert("Especialista "+datos.nombre+" Creado Correctamente")
                        }
                        
                  },
                  
            });
            location.reload();
            
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

      $(".contenedor-tarjetas").on("click","#borrar", function (e) {
            e.preventDefault();
            let tarjeta = $(this).closest(".tarjeta");
            let id = tarjeta.data("id")
            console.log(id);
            
            $.ajax({
                  type: "delete",
                  url: "http://localhost:5000/especialistas/eliminar",
                  data: JSON.stringify({id}),
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                        if(response!=null){
                              alert(response.mensaje);
                        }
                  }
            });
            location.reload();
      });
      




})