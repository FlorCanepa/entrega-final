let seccionMuestra = document.getElementById("sectionMuestra");
let seccionCrear = document.getElementById("sectionCrear");
let seccionEliminar = document.getElementById("sectionEliminar");

function iniciarWeb() {
  let botonVerTurnos = document.getElementById("botonVerTurnos");
  botonVerTurnos.addEventListener("click", mostrarTurnos);
  let botonCrearTurno = document.getElementById("botonCrearTurno");
  botonCrearTurno.addEventListener("click", mostrarFormulario);
  let botonEliminarTurno = document.getElementById("botonEliminarTurno");
  botonEliminarTurno.addEventListener("click", mostrarEliminarTurno);
}

function mostrarFormulario() {
  seccionMuestra.style.display = "none";
  seccionEliminar.style.display = "none";
  seccionCrear.style.display = "block";
}

function mostrarTurnos() {
  seccionCrear.style.display = "none";
  seccionEliminar.style.display = "none";
  seccionMuestra.style.display = "block";
  seccionMuestra.innerHTML = "";

  fetch("../data/turnosPacientes.json")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.Turnos && Array.isArray(data.Turnos)) {
        data.Turnos.forEach((turno) => {
          const turnoElement = document.createElement("div");
          turnoElement.classList.add("turno");

          const nombrePaciente = document.createElement("p");
          nombrePaciente.textContent = "Nombre del paciente: " + turno.nombrePaciente;
          turnoElement.appendChild(nombrePaciente);

          const nombreMedico = document.createElement("p");
          nombreMedico.textContent = "Nombre del médico: " + turno.nombreMedico;
          turnoElement.appendChild(nombreMedico);

          const fechaHora = document.createElement("p");
          fechaHora.textContent = "Fecha y hora: " + turno.fechaHora;
          turnoElement.appendChild(fechaHora);

          const formaPago = document.createElement("p");
          formaPago.textContent = "Forma de pago: " + turno.formaPago;
          turnoElement.appendChild(formaPago);

          const sucursal = document.createElement("p");
          sucursal.textContent = "Sucursal: " + turno.sucursal;
          turnoElement.appendChild(sucursal);

          seccionMuestra.appendChild(turnoElement);
        });
      } else {
        console.error("JSON Error");
      }
    })
    .catch((error) => {
      console.error("Error al cargar los turnos", error);
    });
}

function mostrarEliminarTurno() {
  seccionCrear.style.display = "none";
  seccionMuestra.style.display = "none";
  seccionEliminar.style.display = "block";
  seccionEliminar.innerHTML = "";

  mostrarTurnosDeLS(true);
}

let formulario = document.getElementById("formularioTurnoNuevo");
formulario.addEventListener("submit", guardarTurnoNuevoEnLocal);

function guardarTurnoNuevoEnLocal(event) {
  event.preventDefault();

  let nombrePaciente = document.getElementById("nombreDelPaciente").value;
  let nombreMedico = document.getElementById("nombreDelMedico").value;
  let fechaHora = document.getElementById("fechaHora").value;
  let formaPago = document.getElementById("formaDePago").value;
  let sucursal = document.getElementById("sucursal").value;

  let nuevoTurno = {
    nombrePaciente: nombrePaciente,
    nombreMedico: nombreMedico,
    fechaHora: fechaHora,
    formaPago: formaPago,
    sucursal: sucursal,
  };

  let turnosEnLocalStorage = JSON.parse(localStorage.getItem("Turnos")) || [];
  turnosEnLocalStorage.push(nuevoTurno);
  localStorage.setItem("Turnos", JSON.stringify(turnosEnLocalStorage));

  mostrarTurnosDeLS(false);
  formulario.reset();
  Swal.fire({
    title: '¡Bien!',
    text: 'Turno agregado al Local Storage correctamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}

function mostrarTurnosDeLS(isDeleting) {
  let turnosEnLocalStorage = JSON.parse(localStorage.getItem("Turnos"));

  if (turnosEnLocalStorage && Array.isArray(turnosEnLocalStorage)) {
    seccionEliminar.innerHTML = ""; // Limpiar contenido anterior

    turnosEnLocalStorage.forEach((turno, index) => {
      const turnoElement = document.createElement("div");
      turnoElement.classList.add("turno");

      const nombrePaciente = document.createElement("p");
      nombrePaciente.textContent = "Nombre del paciente: " + turno.nombrePaciente;
      turnoElement.appendChild(nombrePaciente);

      const nombreMedico = document.createElement("p");
      nombreMedico.textContent = "Nombre del médico: " + turno.nombreMedico;
      turnoElement.appendChild(nombreMedico);

      const fechaHora = document.createElement("p");
      fechaHora.textContent = "Fecha y hora: " + turno.fechaHora;
      turnoElement.appendChild(fechaHora);

      const formaPago = document.createElement("p");
      formaPago.textContent = "Forma de pago: " + turno.formaPago;
      turnoElement.appendChild(formaPago);

      const sucursal = document.createElement("p");
      sucursal.textContent = "Sucursal: " + turno.sucursal;
      turnoElement.appendChild(sucursal);

      if (isDeleting) {
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => eliminarTurno(index));
        turnoElement.appendChild(botonEliminar);
      }

      seccionEliminar.appendChild(turnoElement);
    });
  } else {
    console.error("No hay turnos en el almacenamiento local");
  }
}

function eliminarTurno(index) {
  let turnosEnLocalStorage = JSON.parse(localStorage.getItem("Turnos"));

  if (turnosEnLocalStorage && Array.isArray(turnosEnLocalStorage)) {
    turnosEnLocalStorage.splice(index, 1);
    localStorage.setItem("Turnos", JSON.stringify(turnosEnLocalStorage));

    Swal.fire({
      title: '¡Listo!',
      text: 'Turno eliminado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    mostrarTurnosDeLS(true);
  }
}

iniciarWeb();
