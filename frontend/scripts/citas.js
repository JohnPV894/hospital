"use strict";

$(document).ready(async function(){

      await generarTarjetas();

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
                              nombrePaciente=colecciones.pacientes[index].nombre+" "+colecciones.pacientes[index].apellido;
                        }
                  }
                  //con la id recuperamos los datos de especialista
                  for (let index = 0; index < colecciones.especialistas.length; index++) {
      
                        if (citaObj.especialistaID===colecciones.especialistas[index]._id) {
                              nombreEspecialista=colecciones.especialistas[index].nombre+" "+colecciones.especialistas[index].apellido;
                        }
                  }
                  //console.log(nombrePaciente,nombrePaciente,fechaFormateada);

                  $(".contenedor-tarjetas").append(
                        `<div class="tarjeta" data-id=${citaObj._id}>
                          <div class="info-doctor">
                            <img src="../img/citasIcon.png" alt="Foto" class="avatar">
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
      
      function vaciarContenedorTarjetas() {
            $(".contenedor-tarjetas").empty();
      }

      $("#crearCita").click(async function(e){

            if ($("#fechaCita").val()!=="" && $("#especialista").val()!=="" && $("#paciente").val()!=="" ) {
                  e.preventDefault();
                  vaciarContenedorTarjetas();
                  await generarTarjetas();   
            } 

      })

      $("#desplegarModalFecha").click(function (e) { 
            e.preventDefault();
            $("#modalFechas").fadeIn();
      });
      $("#desplegarModalRangos").click(function (e) { 
            e.preventDefault();
            $("#modalRangos").fadeIn();
      });
      
      $("#enviarModalRangos").click(function (e) { 
            e.preventDefault();
            if ( $("#fechaInicial").val() !== "" && $("#fechaFinal").val() !== "" && $("#asistenciaOpcion").val() !== "") {
                  let datos ={
                        "fechaInicio":$("#fechaInicial").val(),
                        "fechaFinal": $("#fechaFinal").val(),
                        "filtroAsistencia":null
                  }
                  if ($("#asistenciaOpcion").val()==="Si") {
                        datos.filtroAsistencia=true;
                  }else if($("#asistenciaOpcion").val()==="No"){
                        datos.filtroAsistencia=false;
                  }else if($("#asistenciaOpcion").val()==="Ver Todos"){
                        datos.filtroAsistencia=null;
                  }

                  console.log(datos);
                  
                  $.ajax({
                        type: "post",
                        url: "http://localhost:5000/citas/filtrar/rango",
                        data: JSON.stringify(datos),
                        dataType: "json",
                        contentType: "application/json",
                        success: async function (response) {
                              vaciarContenedorTarjetas();
                              let colecciones = await recuperarColecciones();
                              response.respuesta.forEach(citaObj => {
                                            
                                    let nombrePaciente;
                                    let nombreEspecialista;
                                    let fechaFormateada=citaObj.fecha; // Tue, 12 May 2020 23:50:21 GMT;
                                    //Con la id recuperamos los datos de paciente      
                                    for (let index = 0; index < colecciones.pacientes.length; index++) {
                                    
                                          if (citaObj.pacienteID===colecciones.pacientes[index]._id) {
                                                nombrePaciente=colecciones.pacientes[index].nombre+" "+colecciones.pacientes[index].apellido;
                                          }
                                    }
                                    //con la id recuperamos los datos de especialista
                                    for (let index = 0; index < colecciones.especialistas.length; index++) {
                                    
                                          if (citaObj.especialistaID===colecciones.especialistas[index]._id) {
                                                nombreEspecialista=colecciones.especialistas[index].nombre+" "+colecciones.especialistas[index].apellido;
                                          }
                                    }

                                    $(".contenedor-tarjetas").append(
                                          `<div class="tarjeta" data-id=${citaObj._id}>
                                            <div class="info-doctor">
                                              <img src="../img/citasIcon.png" alt="Foto" class="avatar">
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
                              $("#modalRangos").fadeOut();
                        }
                  });
            }

      });
      $("#esconderModalRangos").click(function (e) { 
            e.preventDefault();
            $("#modalRangos").fadeOut();
      });
})