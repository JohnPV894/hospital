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
                  let fechaFormateada = new Date(citaObj.fecha);
                  let dia = fechaFormateada.getDay();
                  let mes = fechaFormateada.getMonth();
                  let año = fechaFormateada.getFullYear()
                  fechaFormateada =`${dia}/${mes}/${año}`
                  let asistio = citaObj.Asistio?"Asistio":"No Asistio";
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
                              <strong>Paciente:</strong> ${nombrePaciente} <br>
                              <strong>Especialista:</strong> ${nombreEspecialista} <br>
                              <strong>Fecha:</strong> ${fechaFormateada} <br>
                              <strong>Asistio:</strong>  ${asistio}<br>
                              <span class="botones-tarjeta"> 
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
                              $("#modalRangos").fadeOut();
                              if (await response.respuesta === null) {
                                    $(".contenedor-tarjetas").append("<h1>No se han encontrado Coincidencias</h1>")
                              }else{
                                    response.respuesta.forEach(citaObj => {

                                          let nombrePaciente;
                                          let nombreEspecialista;
                                          let fechaFormateada = new Date(citaObj.fecha);
                                          let dia = fechaFormateada.getDay();
                                          let mes = fechaFormateada.getMonth();
                                          let año = fechaFormateada.getFullYear()
                                          fechaFormateada =`${dia}/${mes}/${año}`;
                                          let asistio = citaObj.Asistio?"Asistio":"No Asistio";
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
                                                      Fecha: ${fechaFormateada}<br>
                                                      Asistio: ${asistio}<br>
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
                              
                              
                        }
                  });
            }

      });
      $("#esconderModalRangos").click(function (e) { 
            e.preventDefault();
            $("#modalRangos").fadeOut();
      });
      
      $("#verTodo").click(async function (e) { 
            e.preventDefault();
            vaciarContenedorTarjetas();
            generarTarjetas();
      });

      $(".contenedor-tarjetas").on("click","#borrar",async function (e) {
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
            vaciarContenedorTarjetas();
            await generarTarjetas();
      });

      $(".contenedor-tarjetas").on("click","#editar",async function (e) {
            e.preventDefault();
            let tarjeta = $(this).closest(".tarjeta");
            let id = tarjeta.data("id")
            let infoTarjeta = await $.ajax({
                  type: "post",
                  url: "http://localhost:5000/citas/buscarID",
                  data: JSON.stringify({cita_id:id}),
                  dataType: "json",
                  contentType: "application/json",
            });

            let colecciones = await recuperarColecciones();
            console.log(colecciones.pacientes);
            console.log(infoTarjeta);
            

            let nombreEspecialista;
            let nombrePaciente;
            for (let index = 0; index < colecciones.pacientes.length; index++) {
            
                  if (infoTarjeta.resultado.pacienteID===colecciones.pacientes[index]._id) {
                        nombrePaciente=colecciones.pacientes[index].nombre+" "+colecciones.pacientes[index].apellido;
                  }
            }
            //con la id recuperamos los datos de especialista
            for (let index = 0; index < colecciones.especialistas.length; index++) {
            
                  if (infoTarjeta.resultado.especialistaID===colecciones.especialistas[index]._id) {
                        nombreEspecialista=colecciones.especialistas[index].nombre+" "+colecciones.especialistas[index].apellido;
                  }
            }
            $("#editarCitaForm").empty();
            $("#editarCitaForm").append(`
                  <br>

                  <h2>PACIENTE</h1>
                  <input type="text" id="paciente" value="${nombrePaciente}" readonly>
                  <br>

                  <h2>ESPECIALISTA</h1>
                  <input type="text"  id="especialista"  value="${nombreEspecialista}" readonly>
                  <br>

                  <h2>SELECCIONE FECHA CITA</h1>
                  <input type="date" name="fechaCita" id="fechaCita" >
                  <br><br>

                  <h2>ASISTENCIA CITA</h1>
                  <input list="" name="fechaCita" id="fechaCita" >
                  <datalist id="opcionesAsistencia">
                    <option value="Si" data-id=""></option>
                    <option value="No" data-id=""></option>
                    <option value="Ver Todos" data-id=""></option>
                  </datalist>
                  <br><br>
                  <span>
                    <input type="button" value="EDITAR" id="editarCita">
                    <input type="button" value="CANCELAR" id="esconderFormEditar">
                  </span>
                  <br>
            `);

            let fechaCita = $("#fechaCita").val();
            
            $("#cont-form-editar").fadeIn();
            

      });

      $("#cont-form-editar").on("click","#esconderFormEditar",async function (e) {
            $("#cont-form-editar").fadeOut();
      });
})