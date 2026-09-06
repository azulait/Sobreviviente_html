document.addEventListener('DOMContentLoaded', () => {
  const regionesYComunas = [
    {
      region: "Región Metropolitana de Santiago",
      comunas: ["Santiago", "Providencia", "Las Condes", "Puente Alto", "La Florida", "Maipú"]
    },
    {
      region: "Valparaíso",
      comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"]
    },
    {
      region: "Biobío",
      comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Coronel"]
    }
  ];

  const regionSelect = document.getElementById('region');
  const comunaSelect = document.getElementById('comuna');
  const form = document.getElementById('registroBunkerForm');

  regionesYComunas.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = item.region;
    regionSelect.appendChild(option);
  });

  regionSelect.addEventListener('change', (e) => {
    const selectedIndex = e.target.value;
    comunaSelect.innerHTML = '<option value="">-- Selecciona una comuna --</option>';

    if (selectedIndex !== "") {
      comunaSelect.disabled = false;
      const comunas = regionesYComunas[selectedIndex].comunas;
      comunas.forEach((comuna) => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
    } else {
      comunaSelect.disabled = true;
    }
  });

  const validarRun = (run) => /^[0-9]{7,8}[0-9kK]{1}$/.test(run);
  
  const validarEmail = (correo) => {
    if (correo.length > 100) return false;
    return /^[a-zA-Z0-9._%+-]+@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const validarCampo = (inputId, errorId, condicion) => {
      const input = document.getElementById(inputId);
      const errorMsg = document.getElementById(errorId);

      if (!input || !errorMsg) return;

      if (condicion) {
        errorMsg.classList.add('d-none');
        input.classList.remove('is-invalid');
      } else {
        errorMsg.classList.remove('d-none');
        input.classList.add('is-invalid');
        isValid = false;
      }
    };

    validarCampo('run', 'errorRun', validarRun(document.getElementById('run').value.trim()));
    validarCampo('nombre', 'errorNombre', document.getElementById('nombre').value.trim() !== '');
    validarCampo('apellidos', 'errorApellidos', document.getElementById('apellidos').value.trim() !== '');
    validarCampo('email', 'errorEmail', validarEmail(document.getElementById('email').value.trim()));
    
    const pass = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    validarCampo('password', 'errorPassword', pass.length >= 6);
    validarCampo('confirmPassword', 'errorConfirmPassword', pass !== '' && pass === confirmPass);
    
    validarCampo('fechaNacimiento', 'errorFechaNacimiento', document.getElementById('fechaNacimiento').value !== '');
    validarCampo('region', 'errorRegion', regionSelect.value !== '');
    validarCampo('comuna', 'errorComuna', comunaSelect.value !== '');
    validarCampo('direccion', 'errorDireccion', document.getElementById('direccion').value.trim() !== '');

    if (isValid) {
      const usuarioNuevo = {
        run: document.getElementById('run').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: pass, // <-- ¡CLAVE GUARDADA CORRECTAMENTE!
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        region: regionSelect.options[regionSelect.selectedIndex].text,
        comuna: comunaSelect.value,
        direccion: document.getElementById('direccion').value.trim(),
        telefono: document.getElementById('telefono').value.trim() || "No especificado"
      };

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      usuarios.push(usuarioNuevo);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      form.reset();
      comunaSelect.disabled = true;
      comunaSelect.innerHTML = '<option value="">-- Selecciona primero una región --</option>';

      const modalConfirmacion = new bootstrap.Modal(document.getElementById('confirmacionModal'));
      modalConfirmacion.show();
    }
  });
});