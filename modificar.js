const id = new URLSearchParams(window.location.search).get("id");

async function cargarDatos() {
  const res = await fetch(`/peliculas/${id}`);
  const data = await res.json();

  document.getElementById("nombre").value = data.nombre;
  document.getElementById("anio").value = data.anio;
  document.getElementById("director").value = data.director;
  document.getElementById("actores").value = data.actores;
  document.getElementById("imagen").value = data.imagen;
}

document.getElementById("form-modificar").addEventListener("submit", async function (e) {
  e.preventDefault();
  const token = localStorage.getItem("token");

  const body = {
    Titulo: document.getElementById("Titulo").value,
    Año: document.getElementById("año").value,
    Actores: document.getElementById("Actores").value,
    Categoria: document.getElementById("Categoria").value,
    Sipnopsis: document.getElementById("Sipnopsis").value,
   Imagen: document.getElementById("imagen").value,
   Director: document.getElementById("director").value
    
  };

  const res = await fetch(`/peliculas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (res.ok) {
    alert("Película actualizada");
    window.location.href = "index.html";
  } else {
    alert("Error al actualizar: " + data.message);
  }
});

cargarDatos();