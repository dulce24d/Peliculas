document.getElementById("buscador-form").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const query = document.getElementById("q").value.trim();
    const resultadosDiv = document.getElementById("resultados");
  
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores
  
    if (!query) {
      resultadosDiv.innerHTML = "<p class='text-danger'>Escribe algo para buscar.</p>";
      return;
    }
  
    try {
      const res = await fetch(`/api/peliculas?search=${encodeURIComponent(query)}`);
      const peliculas = await res.json();
  
      if (!peliculas.length) {
        resultadosDiv.innerHTML = "<p class='text-warning'>No se encontraron resultados.</p>";
        return;
      }
  
      peliculas.forEach(pelicula => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-4";
        col.innerHTML = `
          <div class="card h-100 shadow">
            <img src="${pelicula.Imagen}" class="card-img-top" alt="${pelicula.Titulo}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${pelicula.Titulo} (${pelicula.Año})</h5>
              <p><strong>Director:</strong> ${pelicula.Director || "No especificado"}</p>
              <p><strong>Actores:</strong> ${pelicula.Actores}</p>
              <p class="card-text">${pelicula.Sipnosis}</p>
            </div>
          </div>
        `;
        resultadosDiv.appendChild(col);
      });
    } catch (error) {
      console.error("Error al buscar:", error);
      resultadosDiv.innerHTML = "<p class='text-danger'>Ocurrió un error al buscar.</p>";
    }
  });
  