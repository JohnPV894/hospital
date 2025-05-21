"use strict";

$(document).ready(function(){
      let coleccionCitas;
      $.ajax({
            type: "get",
            url: "http://localhost:5000/pacientes",
            data: "data",
            dataType: "json",
            contentType: "application/json",
            success: async function ( response) {
                  response.forEach(element => {
                  $(".contenedor-cuadros").append(
                        `<div class="tarjeta doctor">
                          <div class="info-doctor">
                            <img src="../img/perfilIcon.png" alt="Foto" class="avatar">
                            <div class="texto">
                              <strong>${element.nombre}</strong><br>
                              Apellido apellido<br><br>
                              Rama: Neumología<br>
                              Nacimiento: 01/01/1980<br>
                              DNI: 60373355B
                            </div>
                          </div>
                        </div>`
                  );
                  });
            }
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
      
})