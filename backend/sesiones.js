"use strict";
//import { validarLogin } from "./main";
$(document).ready(function(){
      $("#confirmar").click(async function (e) { 
            let contraseña =  $(".inputContraseña").text();
            let usuario = $(".inputUsuario").text();
            console.log("Validar");
            if (contraseña.trim()!=="" && usuario.trim()!=="") {
                  let credenciales = {
                        "usuario": usuario,
                        "contraseña": contraseña
                  }
                  console.log("Validar");
                  console.log(await validarLogin(credenciales));
                  
            }           
      });
      
});