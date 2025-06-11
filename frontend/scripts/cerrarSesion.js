$(document).ready(function () {
      $("#cerrarSesion").click(function (e) { 
            e.preventDefault();
            window.location.href = "login.html"
      });
      $("#irPacientes").click(function (e) { 
            e.preventDefault();
            window.location.href = "pacientes.html"
      });
      $("#irCitas").click(function (e) { 
            e.preventDefault();
            window.location.href = "citas.html"
      });
});