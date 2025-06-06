"use strict";

$(document).ready(function(){
      $("#confirmar").click(async function (e) { 
            e.preventDefault();
            let contraseña =  $("#inputContraseña").val();
            let usuario = $("#inputUsuario").val();
            if (contraseña.trim()!=="" && usuario.trim()!=="") {
                  let credenciales = {
                        "usuario": usuario,
                        "contraseña": contraseña
                  }
                  $.ajax({
                        type: "post",
                        url: "http://localhost:5000/sesiones/validar",
                        data: JSON.stringify(credenciales),
                        contentType: "application/json",
                        dataType: "json",
                        success: async function (response) {
                              if (response.esAdmin) {
                                    window.location.href = "especialistas.html";
                              }
                              else if(response.logeado){
                                    window.location.href = "pacientes.html"
                              }
                              else{
                                    console.log("No esta logeado");
                                    
                              }
                        }
                  });
            }           
      });
      
});