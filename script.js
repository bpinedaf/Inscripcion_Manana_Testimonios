document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // ⛔ Prevenir que el formulario se envíe por defecto

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const como = document.getElementById("como").value.trim();
  const comprobanteFile = document.getElementById("comprobante").files[0];

  const submitBtn = document.querySelector("button[type='submit']");
  const loading = document.getElementById("loading");

  // Mostrar mensaje de espera y desactivar botón
  loading.style.display = "block";
  submitBtn.disabled = true;

  let comprobanteBase64 = "";
  let filename = "";
  let mimetype = "";

  try {
    if (comprobanteFile) {
      comprobanteBase64 = await toBase64(comprobanteFile);
      filename = comprobanteFile.name;
      mimetype = comprobanteFile.type;
    }

    const data = new URLSearchParams({
      nombre,
      telefono,
      correo,
      como,
      comprobante: comprobanteBase64,
      filename,
      mimetype,
    });

    const response = await fetch("https://script.google.com/macros/s/AKfycbzxKoyY19TYXNl1uQ5QB_8Oh-xcr6S2HFFBu0Y2obGNVyxqhUvN2lN8HKSI-O7dvfFZfg/exec", {
      method: "POST",
      body: data,
    });

    const text = await response.text();
    mostrarMensaje(text, true);

    // Limpiar formulario después del envío exitoso
    document.querySelector("form").reset();
  } catch (err) {
    mostrarMensaje("❌ Error al enviar el formulario: " + err.message, false);
  } finally {
    loading.style.display = "none";
    submitBtn.disabled = false;
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function mostrarMensaje(texto, exito = true) {
  const mensaje = document.getElementById("mensaje");
  mensaje.style.display = "block";
  mensaje.style.backgroundColor = exito ? "#d4edda" : "#f8d7da";
  mensaje.style.color = exito ? "#155724" : "#721c24";
  mensaje.style.border = exito ? "1px solid #c3e6cb" : "1px solid #f5c6cb";
  mensaje.innerText = texto;

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 10000);
}
