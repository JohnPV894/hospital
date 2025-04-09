"use strict";
/**Funcionalidades:
 * conectar bd
 * recuperar documentos [pacientes y personal]
 * mostrar interfaz en terminal
 * 
 * Funciones Administrativo:
 * - crear paciente
 * - ver Historial pacientes
 * - Asignar citas a pacientes
 * - ver citas por :dia, mes, semana, paciente
 * - ver en un rango de fechas pacientes que asistieron o que no asistieron
 * 
 * Funciones administrador:
 * - crear especialistas
 * fin 
 */

//Dependencias
const {MongoClient} = require('mongodb');
const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
});
//conectar a BD
const mongo_uri = "mongodb+srv://santiago894:P5wIGtXue8HvPvli@cluster0.6xkz1.mongodb.net/";
const mongo_cliente = new MongoClient(mongo_uri);

async function run() {
      try {
            await mongo_cliente.connect();
            console.log("se pudo conectar a la base de datos");
            let documentoPacientes = mongo_cliente.db("hospital").collection("pacientes");
            let consulta =await documentoPacientes.findOne({});
            console.log(consulta);
      } catch (err) {
            //console.log(err.stack);
            console.log("no se pudo conectar a la base de datos");
      }
      finally {
            await mongo_cliente.close();
      }
}
run().catch(console.dir);

function hacerPregunta(question) {
      return new Promise((resolve, reject) => {
          readline.question(question, (answer) => {
              resolve(answer);
          });
      });
};

async function primerMenu() {
      let mantenerMenu = true;
      while (mantenerMenu) {
            console.log(
            `
            Opciones:
            1) Iniciar sesion
            2) Salir
            `);
            let respuesta = await hacerPregunta("Ingrese una opcion :");
            switch (respuesta) {
                  case "1":

                        let usuario = await hacerPregunta(`Ingrese Su usuario: `);
                        let contraseña = await hacerPregunta(`Ingrese Su contraseña: `);

                        break;
                  case "2":
                        console.log("Adios");
                        mantenerMenu = false;
                        break;
                  default:
                        console.log("Opcion no valida, intente nuevamente.");
            }
            
      }
}
//Comprobar Credenciales de inicio de sesion
async function validarLogin(objetoCredenciales){
      await mongo_cliente.connect();
      let objetoRespuesta={"esAdmin":null,"logeado":null}
      let documentoSesiones = mongo_cliente.db("hospital").collection("sesiones");
      let consulta = await documentoSesiones.findOne({
            "usuario": objetoCredenciales.usuario,
            "contraseña": objetoCredenciales.contraseña
      }) 
      if(consulta!==null){
            objetoRespuesta.logeado = true;
            objetoRespuesta.esAdmin = consulta.esAdmin;
      }else {
            objetoRespuesta.logeado = false;
            objetoRespuesta.esAdmin = false;
      }
} 
