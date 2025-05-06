async function cargarPeliculas() {
  try {
    const res = await fetch('/api/peliculas');
    const peliculas = await res.json();

    /*const token = localStorage.getItem("token");
    const estaLogueado = !!token;*/


    /*/ Verificar si el usuario está logueado y agregar el botón de Agregar
    const contenedor = document.getElementById('peliculas-container');
    contenedor.innerHTML = ""; // Limpiar antes de cargar

    // Mostrar botón de agregar solo si el usuario está logueado
    if (estaLogueado) {
      const btnAgregar = document.getElementById("btn-agregar");
      btnAgregar.style.display = "block"; // Mostrar el botón de agregar
    }*/

    peliculas.forEach(pelicula => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';

      let botones = '';
      if (estaLogueado) { 
        botones = `
          <div class="mt-auto d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-pink" onclick="editarPelicula('${pelicula._id}')">Editar</button>
            <button class="btn btn-sm btn-outline-light" onclick="eliminarPelicula('${pelicula._id}')">Eliminar</button>
          </div>
        `;
      }

      col.innerHTML = `
        <div class="card h-100 shadow">
          <img src="${pelicula.Imagen}" class="card-img-top" alt="${pelicula.Titulo}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${pelicula.Titulo} (${pelicula.Año})</h5>
            <p class="card-text"><strong>Director:</strong> ${pelicula.Director || 'No especificado'}</p>
            <p class="card-text"><strong>Actores:</strong> ${pelicula.Actores}</p>
            <p class="card-text"><strong>Categoría:</strong> ${pelicula.Categoria}</p>
            <p class="card-text">${pelicula.Sipnosis}</p>
            ${botones}
          </div>
        </div>
      `;

      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error("Error al cargar películas:", error);
  }
}

async function eliminarPelicula(id) {
  const confirmar = confirm("¿Estás seguro de eliminar esta película?");
  if (!confirmar) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`/api/peliculas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert("Película eliminada correctamente");
      location.reload();
    } else {
      alert("❌ No se pudo eliminar: " + data.mensaje);
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
    alert("Error de red o token inválido");
  }
}

function editarPelicula(id) {
  // Redirige a una futura página de edición
  window.location.href = `editar.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .btn-outline-pink {
      border-color: #ff69b4;
      color: #ff69b4;
    }
    .btn-outline-pink:hover {
      background-color: #ff69b4;
      color: #1e1e1e;
    }
  `;
  document.head.appendChild(style);
  cargarPeliculas();
});