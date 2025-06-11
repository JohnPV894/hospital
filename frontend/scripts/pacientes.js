"use strict";

$(document).ready(async function(){
      let coleccionCitas;
      //Traer coleccion y hacer tarjetas
      await generarTarjetas();


      //Enviar formulario Crear paciente
      $("#enviarCrearPaciente").click(async function (e) { 
            let nombre = $("#nombre").val();
            let apellido = $("#apellido").val();
            let dni = $("#dni").val();
            let telefono = $("#telefono").val();
            let fechaNacimiento = $("#fechaNacimiento").val();
            if (nombre !== null && apellido !== null && dni !== null && telefono !== null && fechaNacimiento !== null ) {
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
                  });
                  vaciarContenedorTarjetas();
                  await generarTarjetas();
            }
            console.log("Crear paciente");
      });

      $("#desplegarCrearPaciente").click(function (e) { 
            e.preventDefault();
            $("#contenedorFormPaciente").fadeIn();
            console.log("mostrar");
      });
      $("#cancelarCrearPaciente").click(function (e) { 
            e.preventDefault();
            $("#contenedorFormPaciente").fadeOut();
            console.log("ocultar");
      });

      $(".contenedor-tarjetas").on("click","#borrar",async function (e) {
            e.preventDefault();
            let tarjeta = $(this).closest(".tarjeta");
            let id = tarjeta.data("id")
            console.log(id);
            
            $.ajax({
                  type: "delete",
                  url: "http://localhost:5000/pacientes/eliminar",
                  data: JSON.stringify({id}),
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                        if(response!=null){
                              alert(response.mensaje);
                        }
                  }
            });
            vaciarContenedorTarjetas();
            await generarTarjetas();

      });

      async function recuperarPacientes (){
            let pacientes;
            await $.ajax({
                  type: "get",
                  url: "http://localhost:5000/pacientes",
                  data: "data",
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                        pacientes = response;
                  }
            });
            return pacientes;

      }
      async function generarTarjetas() {
            let coleccion = await recuperarPacientes()
            coleccion.forEach(cadaElemento => {
                  $(".contenedor-tarjetas").append(
                        `<div class="tarjeta" data-id=${cadaElemento._id}>
                          <div class="info-doctor">
                            <img src="../img/perfilIcon.png" alt="Foto" class="avatar">
                            <div class="texto">
                              <strong>${cadaElemento.nombre}</strong><br>
                              <var> ${cadaElemento.apellido}<var/><br><br>
                              <strong>Telefono:</strong>${cadaElemento.telefono}<br>
                              <strong>Nacimiento:</strong> ${cadaElemento.fechaNacimiento}<br>
                              <strong>DNI:</strong> ${cadaElemento.dni} <br>
                              <span> 
                                    <input  type="button" value="Borrar" id="borrar"/>
                                    <input  type="button" value="Editar" id="editar"/>  
                              <span/>
                            </div>
                          </div>
                        </div>`
                  );
                  });
      }
      function vaciarContenedorTarjetas() {
            $(".contenedor-tarjetas").empty();
      }
      
})