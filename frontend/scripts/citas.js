"use strict";

$(document).ready(async function(){
      async function recuperarColecciones (){
            let citas;
            let pacientes;
            let especialistas;
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
            await $.ajax({
                  type: "get",
                  url: "http://localhost:5000/especialistas",
                  data: "data",
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                         especialistas = response;
                  }
            });
            await $.ajax({
                  type: "get",
                  url: "http://localhost:5000/citas",
                  data: "data",
                  dataType: "json",
                  contentType: "application/json",
                  success: function (response) {
                         citas = response;
                  }
            });
            return {"citas": citas,"especialistas":especialistas,"pacientes":pacientes}

      }
      async function generarTarjetas (){
            let colecciones = await recuperarColecciones();
            colecciones.citas.forEach(citaObj => {
                  
                        
                  let nombrePaciente;
                  let nombreEspecialista;
                  let fechaFormateada=citaObj.fecha; // Tue, 12 May 2020 23:50:21 GMT;
                  //Con la id recuperamos los datos de paciente      
                  for (let index = 0; index < colecciones.pacientes.length; index++) {
      
                        if (citaObj.pacienteID===colecciones.pacientes[index]._id) {
                              nombrePaciente=colecciones.pacientes[index].nombre+colecciones.pacientes[index].apellido;
                        }
                  }
                  //con la id recuperamos los datos de especialista
                  for (let index = 0; index < colecciones.especialistas.length; index++) {
      
                        if (citaObj.especialistaID===colecciones.especialistas[index]._id) {
                              nombreEspecialista=colecciones.especialistas[index].nombre+colecciones.especialistas[index].apellido;
                        }
                  }
                  console.log(nombrePaciente,nombrePaciente,fechaFormateada);
                  
                  $(".contenedor-cuadros").append(
                        `<div class="tarjeta" data-id=${citaObj._id}>
                          <div class="info-doctor">
                            <img src="../img/perfilIcon.png" alt="Foto" class="avatar">
                            <div class="texto">
                              Paciente: ${nombrePaciente} <br>
                              Especialista: ${nombreEspecialista} <br>
                              Fecha: ${fechaFormateada}
                              <span> 
                                    <input  type="button" value="Borrar" id="borrar"/>
                                    <input  type="button" value="Editar" id="editar"/>  
                              <span/>
                            </div>
                          </div>
                        </div>`
                  )
      
            });
      }

      await generarTarjetas();

      //$("#desplegarCrearPaciente").click(function (e) { 
      //      e.preventDefault();
      //      $("#contenedorFormPaciente").fadeIn();
      //      console.log("mostrar");
      //      console.log(coleccionCitas);
      //      
      //});
      //$("#cancelarCrearPaciente").click(function (e) { 
      //      e.preventDefault();
      //      $("#contenedorFormPaciente").fadeOut();
      //      console.log("ocultar");
      //});
//
      //$("#desplegarCrearCita").click(function (e) { 
      //      e.preventDefault();
      //      $("#contenedorFormPaciente").fadeIn();
      //      console.log("mostrar");
      //      
      //});
      //$("#cancelarCrearCita").click(function (e) { 
      //      e.preventDefault();
      //      $("#contenedorFormPaciente").fadeOut();
      //      console.log("ocultar");
      //});
      //$(".contenedor-cuadros").on("click","#borrar", function (e) {
      //      e.preventDefault();
      //      let tarjeta = $(this).closest(".tarjeta");
      //      let id = tarjeta.data("id")
      //      console.log(id);
      //      
      //      $.ajax({
      //            type: "delete",
      //            url: "http://localhost:5000/citas/eliminar",
      //            data: JSON.stringify({id}),
      //            dataType: "json",
      //            contentType: "application/json",
      //            success: function (response) {
      //                  if(response!=null){
      //                        alert(response.mensaje);
      //                  }
      //            }
      //      });
      //});
      
})