const estanterias = {
    "estanteria-1": [
      { id: 101, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", disponible: true },
      { id: 102, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", disponible: true },
      { id: 103, titulo: "La Odisea", autor: "Homero", disponible: false },
      { id: 104, titulo: "Crimen y castigo", autor: "Fiódor Dostoyevski", disponible: true }
    ],
    "estanteria-2": [
      { id: 201, titulo: "1984", autor: "George Orwell", disponible: true },
      { id: 202, titulo: "Dune", autor: "Frank Herbert", disponible: true },
      { id: 203, titulo: "Neuromante", autor: "William Gibson", disponible: true },
      { id: 204, titulo: "Fundación", autor: "Isaac Asimov", disponible: false }
    ],
    "estanteria-3": [
      { id: 301, titulo: "El Hobbit", autor: "J.R.R. Tolkien", disponible: true },
      { id: 302, titulo: "Harry Potter y la piedra filosofal", autor: "J.K. Rowling", disponible: false },
      { id: 303, titulo: "Juego de Tronos", autor: "George R.R. Martin", disponible: true },
      { id: 304, titulo: "El nombre del viento", autor: "Patrick Rothfuss", disponible: true }
    ]
  };

  // Elementos del DOM - Formulario de Préstamo
  const selectorEstanteria = document.getElementById('estanteria');
  const selectorLibro = document.getElementById('libro');
  const campoNombre = document.getElementById('nombre');
  const botonEnviar = document.getElementById('botonEnviar');
  const formularioPrestamo = document.getElementById('formularioPrestamo');
  const notificacion = document.getElementById('notificacion');
  
  // Elementos del DOM - Formulario de Devolución
  const selectorLibroDevolucion = document.getElementById('libroDevolucion');
  const botonDevolver = document.getElementById('botonDevolver');
  const formularioDevolucion = document.getElementById('formularioDevolucion');
  const notificacionDevolucion = document.getElementById('notificacionDevolucion');
  
  // Otros elementos
  const elementoAnioActual = document.getElementById('anioActual');

  // Asegurarse de que las notificaciones estén ocultas al inicio
  notificacion.classList.add('formulario-oculto');
  notificacionDevolucion.classList.add('formulario-oculto');
  
  // Establecer el año actual en el footer
  elementoAnioActual.textContent = new Date().getFullYear();

  // Función para cargar los libros prestados en el selector de devolución
  function cargarLibrosPrestados() {
    // Limpiar el selector
    selectorLibroDevolucion.innerHTML = '<option value="" disabled selected>Selecciona un libro prestado</option>';
    
    // Contador para verificar si hay libros prestados
    let hayLibrosPrestados = false;
    
    // Recorrer todas las estanterías y buscar libros no disponibles (prestados)
    for (const estanteriaId in estanterias) {
      const librosEstanteria = estanterias[estanteriaId];
      
      // Filtrar solo los libros no disponibles (prestados)
      const librosPrestados = librosEstanteria.filter(libro => !libro.disponible);
      
      // Si hay libros prestados en esta estantería, añadirlos al selector
      if (librosPrestados.length > 0) {
        hayLibrosPrestados = true;
        
        // Crear un grupo de opciones para esta estantería
        const grupoEstanteria = document.createElement('optgroup');
        grupoEstanteria.label = estanteriaId === "estanteria-1" ? "Literatura Clásica" : 
                                estanteriaId === "estanteria-2" ? "Ciencia Ficción" : "Fantasía";
        
        // Añadir cada libro prestado como una opción
        librosPrestados.forEach(libro => {
          const opcion = document.createElement('option');
          opcion.value = libro.id;
          opcion.textContent = `${libro.titulo} - ${libro.autor}`;
          grupoEstanteria.appendChild(opcion);
        });
        
        // Añadir el grupo de opciones al selector
        selectorLibroDevolucion.appendChild(grupoEstanteria);
      }
    }
    
    // Habilitar o deshabilitar el botón según si hay libros prestados
    botonDevolver.disabled = !hayLibrosPrestados;
    
    // Si no hay libros prestados, mostrar un mensaje en el selector
    if (!hayLibrosPrestados) {
      const opcionNoHayLibros = document.createElement('option');
      opcionNoHayLibros.value = "";
      opcionNoHayLibros.disabled = true;
      opcionNoHayLibros.selected = true;
      opcionNoHayLibros.textContent = "No hay libros prestados actualmente";
      selectorLibroDevolucion.appendChild(opcionNoHayLibros);
    }
  }

  // Manejar el cambio de estantería
  selectorEstanteria.addEventListener('change', function() {
    const estanteriaSeleccionada = this.value;
    
    // Limpiar y resetear el selector de libros
    selectorLibro.innerHTML = '<option value="" disabled selected>Selecciona un libro</option>';
    
    // Habilitar el selector de libros solo si hay una estantería seleccionada
    if (estanteriaSeleccionada && estanterias[estanteriaSeleccionada]) {
      selectorLibro.disabled = false;
      
      // Cargar los libros de la estantería seleccionada
      estanterias[estanteriaSeleccionada].forEach(libro => {
        const opcion = document.createElement('option');
        opcion.value = libro.id;
        opcion.textContent = `${libro.titulo} - ${libro.autor}`;
        
        // Deshabilitar libros no disponibles
        if (!libro.disponible) {
          opcion.disabled = true;
          opcion.textContent += ' (No disponible)';
        }
        
        selectorLibro.appendChild(opcion);
      });
    } else {
      selectorLibro.disabled = true;
    }
    
    // Verificar si el formulario es válido
    verificarFormulario();
  });

  // Verificar validez del formulario cuando cambian los campos
  selectorLibro.addEventListener('change', verificarFormulario);
  campoNombre.addEventListener('input', verificarFormulario);
  selectorLibroDevolucion.addEventListener('change', function() {
    botonDevolver.disabled = !this.value;
  });

  // Función para verificar si el formulario de préstamo es válido
  function verificarFormulario() {
    const valorNombre = campoNombre.value.trim();
    const valorLibro = selectorLibro.value;
    const valorEstanteria = selectorEstanteria.value;
    
    // Habilitar el botón solo si todos los campos están completos
    botonEnviar.disabled = !(valorNombre && valorLibro && valorEstanteria);
  }

  // Manejar el envío del formulario de préstamo
  formularioPrestamo.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const valorNombre = campoNombre.value.trim();
    const textoEstanteria = selectorEstanteria.options[selectorEstanteria.selectedIndex].text;
    const idLibro = parseInt(selectorLibro.value);
    
    // Encontrar el libro seleccionado en los datos
    let libroSeleccionado = null;
    let estanteriaSeleccionada = null;
    
    for (const estanteriaId in estanterias) {
      const encontrado = estanterias[estanteriaId].find(libro => libro.id === idLibro);
      if (encontrado) {
        libroSeleccionado = encontrado;
        estanteriaSeleccionada = estanteriaId;
        break;
      }
    }
    
    // Marcar el libro como no disponible (prestado)
    if (libroSeleccionado) {
      libroSeleccionado.disponible = false;
    }
    
    // Registrar el préstamo (aquí se podría enviar a un servidor)
    console.log('Préstamo registrado:', {
      nombre: valorNombre,
      estanteria: textoEstanteria,
      libro: libroSeleccionado
    });
    
    // Mostrar la notificación de éxito
    notificacion.classList.remove('formulario-oculto');
    
    // Actualizar el selector de libros para devolución
    cargarLibrosPrestados();
    
    // Resetear el formulario después de 3 segundos
    setTimeout(() => {
      // Resetear el formulario
      formularioPrestamo.reset();
      
      // Ocultar la notificación
      notificacion.classList.add('formulario-oculto');
      
      // Deshabilitar y resetear el selector de libros
      selectorLibro.disabled = true;
      selectorLibro.innerHTML = '<option value="" disabled selected>Primero selecciona una estantería</option>';
      
      // Deshabilitar el botón de envío
      botonEnviar.disabled = true;
    }, 3000);
  });

  // Manejar el envío del formulario de devolución
  formularioDevolucion.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener el ID del libro a devolver
    const idLibroDevolucion = parseInt(selectorLibroDevolucion.value);
    
    // Encontrar el libro en los datos
    let libroDevuelto = null;
    let estanteriaLibro = null;
    
    for (const estanteriaId in estanterias) {
      const encontrado = estanterias[estanteriaId].find(libro => libro.id === idLibroDevolucion);
      if (encontrado) {
        libroDevuelto = encontrado;
        estanteriaLibro = estanteriaId;
        break;
      }
    }
    
    // Marcar el libro como disponible (devuelto)
    if (libroDevuelto) {
      libroDevuelto.disponible = true;
    }
    
    // Registrar la devolución (aquí se podría enviar a un servidor)
    console.log('Devolución registrada:', {
      libro: libroDevuelto,
      estanteria: estanteriaLibro
    });
    
    // Mostrar la notificación de éxito
    notificacionDevolucion.classList.remove('formulario-oculto');
    
    // Actualizar los selectores de libros
    cargarLibrosPrestados();
    
    // Si hay una estantería seleccionada en el formulario de préstamo, actualizar su lista de libros
    if (selectorEstanteria.value) {
      const evento = new Event('change');
      selectorEstanteria.dispatchEvent(evento);
    }
    
    // Resetear el formulario después de 3 segundos
    setTimeout(() => {
      // Ocultar la notificación
      notificacionDevolucion.classList.add('formulario-oculto');
    }, 3000);
  });

  // Inicializar la página
  window.addEventListener('DOMContentLoaded', function() {
    // Cargar los libros prestados en el selector de devolución
    cargarLibrosPrestados();
  });