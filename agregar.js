document.getElementById("agregar-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    const body = {
        Titulo: document.getElementById("Titulo").value,
        Año: document.getElementById("año").value,
        Actores: document.getElementById("Actores").value,
        Categoria: document.getElementById("Categoria").value,
        Sipnopsis: document.getElementById("Sipnopsis").value,
       Imagen: document.getElementById("imagen").value,
       Director: document.getElementById("director").value,
        // Agregar el ID del usuario logueado
      usuario_id: userData._id
    };

    const res = await fetch("/peliculas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Película agregada con éxito");
      window.location.href = "index.html";
    } else {
      alert("Error al agregar: " + data.message);
    }
  });