document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginBunkerForm');
  const mensajeErrorGeneral = document.getElementById('mensajeErrorGeneral');

  const validarEmail = (correo) => {
  return /^[a-zA-Z0-9._%+-]+@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|gmail\.com|bunker\.com)$/i.test(correo);
};

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (mensajeErrorGeneral) {
        mensajeErrorGeneral.classList.add('d-none');
      }

  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passInput = document.getElementById('loginPassword').value.trim();

// VERIFICAR CREDENCIALES DE ADMINISTRADOR
if (emailInput === 'admin@bunker.com' && passInput === 'admin123') {
  window.location.href = 'admin.html';
  return; 
}

      let isValid = true;

      const mostrarError = (inputId, errorId, mensajeTexto) => {
        const input = document.getElementById(inputId);
        const errorMsg = document.getElementById(errorId);

        if (input && errorMsg) {
          errorMsg.textContent = mensajeTexto;
          errorMsg.classList.remove('d-none');
          input.classList.add('is-invalid');
        }
        isValid = false;
      };

      const limpiarError = (inputId, errorId) => {
        const input = document.getElementById(inputId);
        const errorMsg = document.getElementById(errorId);

        if (input && errorMsg) {
          errorMsg.classList.add('d-none');
          input.classList.remove('is-invalid');
        }
      };

      if (emailInput === '') {
        mostrarError('loginEmail', 'errorLoginEmail', 'Falta ingresar el correo electrónico.');
      } else if (!validarEmail(emailInput)) {
        mostrarError('loginEmail', 'errorLoginEmail', 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      } else {
        limpiarError('loginEmail', 'errorLoginEmail');
      }

      if (passInput === '') {
        mostrarError('loginPassword', 'errorLoginPassword', 'Falta ingresar la contraseña.');
      } else if (passInput.length < 6) {
        mostrarError('loginPassword', 'errorLoginPassword', 'La contraseña debe tener al menos 6 caracteres.');
      } else {
        limpiarError('loginPassword', 'errorLoginPassword');
      }

      if (isValid) {
        const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioEncontrado = usuariosGuardados.find(
          (u) => u.email.toLowerCase() === emailInput.toLowerCase() && u.password === passInput
        );

        const esUsuarioPrueba = (emailInput.toLowerCase() === 'superviviente@duoc.cl' && passInput === '123456');

        if (usuarioEncontrado || esUsuarioPrueba) {
          const usuarioSesion = usuarioEncontrado || { nombre: "Superviviente", email: emailInput };
          
          localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSesion));

          window.location.href = 'Inicio.html';
        } else if (mensajeErrorGeneral) {
          mensajeErrorGeneral.classList.remove('d-none');
        }
      }
    });
  }
});