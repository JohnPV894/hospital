"use strict";
/**Funcionalidades:
 * conectar bd
 * recuperar documentos [pacientes y personal]
 * mostrar interfaz en terminal
 * 
 * Funciones Administrativo:
 * - crear paciente
 * - editar paciente
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
const {MongoClient,ObjectId} = require('mongodb');
const { DateTime,Interval } = require("luxon");
const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
});
//conectar a BD
const mongo_uri = "mongodb+srv://santiago894:P5wIGtXue8HvPvli@cluster0.6xkz1.mongodb.net/";
const mongo_cliente = new MongoClient(mongo_uri);



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
            let respuesta = await hacerPregunta("Ingrese el numero una opcion :");
            switch (respuesta) {
                  case "1":

                        let usuario = await hacerPregunta(`\tIngrese Su usuario : `);
                        let contraseña = await hacerPregunta(`\tIngrese Su contraseña : `);
                        let credenciales = {
                              "usuario": usuario,
                              "contraseña": contraseña
                        }
                        let validacion = await validarLogin(credenciales);
                        if (validacion.esAdmin && validacion.logeado) {
                             
                              await menuAdministrador();// console.log("Administrador");
                        }else if(validacion.logeado){
                              
                              await menuAdministrativo();//console.log("Administrativo");
                        }else{
                              console.clear();
                              console.log("\nError: Credenciales Incorrectas \n");
                              
                        }
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
async function menuAdministrador(params) {
      console.clear();
      let mantenerMenu = true;
      while (mantenerMenu) {
            console.log(`
                  Opciones:
            1) Crear Especialista
            2) Salir
            `);
            let respuesta = await hacerPregunta("Ingrese una opcion :");

            if (respuesta=="1") {
                  console.log("\nIngrese los datos solicitados a continuacion\n");
                  
                  let nombre = await hacerPregunta("Nombre :");
                  let dni = await hacerPregunta("DNI :");    
                  let rama = await hacerPregunta("Rama :");
                  let datosEspecialista = {
                        "nombre": nombre,
                        "dni": dni,
                        "rama": rama
                  }
                  let estadoOperacion=await creaEspecialista(datosEspecialista);
                  console.clear();
                  if(estadoOperacion){
                        console.log("\ncreaacion especialista exitosa\n");
                  }else{
                        console.log("\nError al crear especialista\n");
                  }
            }
            else if (respuesta=="2") {
                  console.log("Adios");
                  mantenerMenu = false;
            }
      }
}
async function menuAdministrativo(params) {
      console.clear();
      let mantenerMenu = true;
      while (mantenerMenu) {

            console.log(`
                  Opciones:
                  1) Crear Paciente
                  2) ver todas las citas
                  3) Ver Historial Paciente
                  4) Asignar Citas a Pacientes
                  5) Ver citas por :dia, mes, semana, paciente
                  6) Ver en un rango de fechas pacientes que asistieron o que no asistieron
                  7) Salir
                  `);
            let respuesta = await hacerPregunta("Ingrese una opcion :");
            switch (respuesta) {
                  case "1":
                        console.log("\nIngrese los datos del paciente solicitados a continuacion\n");
                  
                        let nombre = await hacerPregunta("Nombre :");
                        let dni = await hacerPregunta("DNI :"); 
                        let diaNacimiento = await hacerPregunta("Dia Nacimiento :");
                        let mesNacimiento = await hacerPregunta("Mes Nacimiento :");
                        let añoNacimiento = await hacerPregunta("Año Nacimiento :");
                           
                        let fechaNacimiento = DateTime.fromObject({
                              day: parseInt(diaNacimiento),
                              month: parseInt(mesNacimiento),
                              year: parseInt(añoNacimiento)
                        });
                        let datosPaciente = {
                              "nombre": nombre,
                              "dni": dni,
                              "fechaNacimiento": fechaNacimiento.toFormat("dd/MM/yyyy"),
                        };
                        let estadoOperacion=await crearPaciente(datosPaciente);
                        console.clear();
                        if (estadoOperacion) {
                              console.log("\nCreacion paciente exitosa\n");
                              
                        }else{
                              console.log("\nError al crear paciente\n");
                        }
                        
                        break;
                  case "2":
                        console.clear();
                        verCitas();
                        break;
                  case "3":
                        console.clear();
                        console.log("\nIngrese el Index del paciente : ");
                        let listaPacientesHistorial = await verPacientesIndex();
                        let indexPacienteHistorial = await hacerPregunta("Index : ");
                        verHistorialPaciente(listaPacientesHistorial[indexPacienteHistorial]._id);

                        break;
                  case "4":
                        console.clear();
                        console.log("\nIngrese el Index del paciente : ");
                        let listaPacientesCita = await verPacientesIndex();
                        let indexPacienteCita = await hacerPregunta("Index : ");

                        let diaCita = await hacerPregunta("Dia Cita :");
                        let mesCita = await hacerPregunta("Mes Cita :");
                        let añoCita = await hacerPregunta("Año Cita :");
                           
                        let fechaCita = DateTime.fromObject({
                              day: parseInt(diaCita),
                              month: parseInt(mesCita),
                              year: parseInt(añoCita)
                        });
                        console.clear();
                        console.log("\nIngrese el Index del especialista : ");
                        let listaEspecialistasCita = await verEspecialistasIndex();
                        let indexEspecialistaCita = await hacerPregunta("Index Especialista : ");
                        console.clear();
                        console.log("\nIngrese 1 si el paciente asistio y 2 si no asistio\n");
                        
                        let asistio = await hacerPregunta("asistio opcion : ");
                        let datosCita = {
                              "pacienteID": listaPacientesCita[indexPacienteCita]._id,
                              "fecha": fechaCita.toFormat("dd/MM/yyyy"),
                              "asistio": asistio =="1" ?true : false,
                              "especialistaID": listaEspecialistasCita[indexEspecialistaCita]._id,
                        }
                        let resultadoCita = crearCita(datosCita);
                        console.clear();
                        if (resultadoCita) {
                              console.log("\nCreacion cita exitosa\n");}
                        else {
                              console.log("\nError al crear cita\n");
                        }
                        break;
                  case "5":
                        console.log("\nIngrese el filtro que desea utilizar");
                        let pregunta = hacerPregunta(`
                              1) Por dia
                              2) Por Mes
                              3) Por Semana
                              `);
                        break;
                  case "6":
                              let asistenciaFiltro = await hacerPregunta(`
                              Ver los que asistieron o no asistieron
                              1) Asistieron 
                              2) No asistieron
                              numero :`);
                              if (asistenciaFiltro == "1") {
                                    asistenciaFiltro = true;
                              }else{
                                    asistenciaFiltro = false;}
                              let mantenerBucle = true;
                              while (mantenerBucle) {
                                    let fechaInicialDia = await hacerPregunta("Dia Inicial :");
                                    let fechaInicialMes = await hacerPregunta("Mes Inicial :");
                                    let fechaInicialAño = await hacerPregunta("Año Inicial :");
                                    let fechaFinalDia = await hacerPregunta("Dia Final :");
                                    let fechaFinalMes = await hacerPregunta("Mes Final :");
                                    let fechaFinalAño = await hacerPregunta("Año Final :");
                                    let fechaInicial = DateTime.fromObject({
                                          day: parseInt(fechaInicialDia),
                                          month: parseInt(fechaInicialMes),
                                          year: parseInt(fechaInicialAño)
                                    });
                                    let fechaFinal = DateTime.fromObject({
                                          day: parseInt(fechaFinalDia),
                                          month: parseInt(fechaFinalMes),
                                          year: parseInt(fechaFinalAño)
                                    });
                                    if (fechaInicial.isValid && fechaFinal.isValid) {
                                         mantenerBucle = false;
                                          
                                    }
                                    let datosRangoFechas = {
                                          "fechaInicial": fechaInicial.toFormat("dd/MM/yyyy"),
                                          "fechaFinal": fechaFinal.toFormat("dd/MM/yyyy"),
                                          "filtroAsistencia": asistenciaFiltro
                                    }
                                    let lista = await citasEntreFechas(datosRangoFechas);
                                    console.log("\nCitas encontradas \n");
                                    console.table(lista);
                              }

                              //console.clear();
                              //if (lista == null) {
                              //      console.log("\nNo se encontraron citas en el rango de fechas\n");
                              //      
                              //}else{
//
                              //}
                        break;
                  case "7":
                        console.log("Adios");
                        mantenerMenu = false;
                        break;
                  default:
                        console.log("Opcion no valida, intente nuevamente.");
                        break;
            }
      }
}

//
//Comprobar Credenciales de inicio de sesion
async function validarLogin(objetoCredenciales){
      console.log(objetoCredenciales);
      
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
      return objetoRespuesta;
} 
//Funciones de "Administrativos"
//Ver todas las citas
async function verCitas() {
      await mongo_cliente.connect();
      let documentoCitas = mongo_cliente.db("hospital").collection("citas");
      let todasLasCitas = await documentoCitas.find().toArray();
      console.table("\n",todasLasCitas);
}
//Ver todas las pacientes de un paciente 
//@params "id paciente"
async function verCitas_paciente(idPaciente) {
      await mongo_cliente.connect();
      let id_formatoBson = new ObjectId(idPaciente);
      let documentoCitas = mongo_cliente.db("hospital").collection("citas");
      let todasLasCitas = await documentoCitas.find({"_id":id_formatoBson}).toArray();
      console.table(todasLasCitas);
}
//Ver todas las citas dentro de un rango de fechas y elegir si quiero ver: todas, asistieron, no asistieron
//@params fecha inicial, fecha final
async function citasEntreFechas(datosCita) {
      console.log(datosCita);
      
      await mongo_cliente.connect();
      let documentoCitas = mongo_cliente.db("hospital").collection("citas");
      let todasLasCitas = await documentoCitas.find({"asistieron":datosCita.filtroAsistencia}).toArray();
      if(datosCita.fechaInicial != null && datosCita.fechaFinal != null && datosCita.filtroAsistencia != null){
            const fechaInicial = DateTime.fromISO(datosCita.fechaInicial);
            const fechaFinal = DateTime.fromISO(datosCita.fechaFinal);
            let intervalo = Interval.fromDateTimes( fechaFinal,fechaInicial);
            let listaFiltrada=[];
            for (let index = 0; index < todasLasCitas.length; index++) {
                  
                  if (intervalo.contains(DateTime.fromISO(todasLasCitas[index].fecha))) {
                        listaFiltrada.push(todasLasCitas[index]);
                  }
            }
            return listaFiltrada;
      }
}
//Ver todas las citas de un/a: dia, semana, mes 
//@params elegir filtro D o M o S y la fecha

//asignar cita a paciente
//@params "id paciente" "fecha" "asistio" "id especialista"
async function crearCita(datosCita) {
      await mongo_cliente.connect();
      let documentoCitas = mongo_cliente.db("hospital").collection("citas");
      if(datosCita.pacienteID != null && datosCita.fecha.trim() != null &&  typeof datosCita.asistio === "boolean" && datosCita.especialistaID != null){
            let resultadoCreacionCita = await documentoCitas.insertOne(datosCita)
            return resultadoCreacionCita.acknowledged;
      }else{
            return false;
      }
}
//Crear paciente
//@params "Nombre" "DNI" "Fecha Nacimiento" listCitas[cita{fecha, asistio, idPaciente, IdEspecialista, consultorio }]
async function crearPaciente(datosPaciente) {
      await mongo_cliente.connect();
      let documentoPacientes = mongo_cliente.db("hospital").collection("pacientes");
      if(datosPaciente.nombre.trim() != null && datosPaciente.dni.trim() != null && datosPaciente.fechaNacimiento.trim() != null){
            let resultadoCreacionPaciente = await documentoPacientes.insertOne(datosPaciente)
            return resultadoCreacionPaciente.acknowledged;
      }else{
            return false;
            
      }

}
//Ver historial de un paciente
//@params "id paciente"
async function verHistorialPaciente(idPaciente) {
      await mongo_cliente.connect();
      let id_formatoBson = new ObjectId(idPaciente);
      let documentoPacientes = mongo_cliente.db("hospital").collection("pacientes");
      let documentoCitas = mongo_cliente.db("hospital").collection("citas");
      let paciente = await documentoPacientes.findOne({"_id":id_formatoBson});
      paciente._id = paciente._id.toString();
      let citasDelPaciente = await documentoCitas.find({"pacienteID":id_formatoBson}).toArray();
      console.log("\nDatos del Paciente\n");
      console.table(paciente);
      console.log("\nCitas del Paciente\n");
      console.table(citasDelPaciente);
}
//Mostrar index , nombre de cada paciente 
async function verPacientesIndex() {
      await mongo_cliente.connect();
      let documentoPacientes = mongo_cliente.db("hospital").collection("pacientes");
      let listaPacientes = await documentoPacientes.find().toArray();
      let listaConTodo=listaPacientes;
      for (let index = 0; index < listaPacientes.length; index++) {
            delete listaPacientes[index].fechaNacimiento;
            delete listaPacientes[index].dni;
      }
      console.log("\nPacientes\n");
      console.table(listaPacientes);
      return listaPacientes;
}
//Mostrar index , nombre de cada especialista 
async function verEspecialistasIndex() {
      await mongo_cliente.connect();
      let documentoPacientes = mongo_cliente.db("hospital").collection("especialistas");
      let listaEspecialistas = await documentoPacientes.find().toArray();
      let listaConTodo=listaEspecialistas;
      console.log("\especialistas\n");
      console.table(listaEspecialistas);
      return listaEspecialistas;
}

//Funciones de "Administradores"
//Crear Especialidadez
//@params "nombre"  
async function creaEspecialista(objetoDatos) {
      
      await mongo_cliente.connect();
      let documentoEspecialistas = mongo_cliente.db("hospital").collection("especialistas");
      if(objetoDatos.nombre.trim() != null && objetoDatos.rama.trim() != null && objetoDatos.dni.trim() != null){
            let resultadoCreacionEspecialista = await documentoEspecialistas.insertOne(objetoDatos)
            return resultadoCreacionEspecialista.acknowledged;
            
      }else{
            return false;
            
      }
      
}
//creaEspecialista({nombre:"Orto Souto",rama:"Cirugia Plastica",dni:"90333355B"});
//verPacientesIndex();
//menuAdministrativo()
//verEspecialistasIndex();
export{validarLogin};