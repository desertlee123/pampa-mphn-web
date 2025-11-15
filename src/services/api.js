// src/services/api.js
export const API_BASE_URL = "http://192.168.0.103:8000/api";
export const IMAGE_BASE_URL = "http://192.168.0.103:8000/img";

export async function getAllArticulos() {
  try {
    const response = await fetch(`${API_BASE_URL}/articulos`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData || !Array.isArray(jsonData)) {
      throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
    }

    return jsonData.map((item) => {
      const {
        id,
        titulo,
        imagen,
        para_socios,
      } = item;

      const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

      return {
        id,
        titulo,
        imageUrl: img,
        para_socios,
      };

    });
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    throw error;
  }
}

export async function getLastArticulos() {
  try {
    const response = await fetch(`${API_BASE_URL}/articulos/recientes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData || !Array.isArray(jsonData)) {
      throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
    }

    return jsonData.map((item) => {
      const {
        id,
        titulo,
        imagen,
        para_socios,
      } = item;

      const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

      return {
        id,
        titulo,
        imageUrl: img,
        para_socios,
      };

    });
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    throw error;
  }
}

export async function getAllCategorias() {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    const categoriasData = jsonData.categorias;

    if (!categoriasData || !Array.isArray(categoriasData)) {
      throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
    }

    return categoriasData.map((item) => {
      const {
        id,
        nombre,
        imagen,
      } = item;

      const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

      return {
        id,
        nombre,
        imageUrl: img,
      };

    });
  } catch (error) {
    console.error('Error al obtener categorias:', error);
    throw error;
  }
}

export async function getArticuloPorId(id) {
  const url = `${API_BASE_URL}/articulos/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData) {
      throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
    }

    const {
      id: articuloId,
      autor,
      titulo,
      imagen,
      descripcion,
      fecha_publicacion,
      metadatos,
      para_socios,
    } = jsonData;

    const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

    return {
      id: articuloId,
      autor,
      titulo,
      descripcion,
      fecha_publicacion,
      imageUrl: img,
      metadatos,
      para_socios,
    };
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    throw error;
  }
}

export async function saveArticulo(idArticulo, session) {
  if (session.role === 'visitor') {
    alert("Debes registrarte para guardar artículos");
    return null;
  }

  if (!session.token) {
    alert("Token no disponible. Por favor, vuelve a iniciar sesión.");
    console.error('Token no disponible:', session);
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/articulos/guardar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        id_articulo: parseInt(idArticulo), // Asegurar que sea número
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', response.status, errorData);
      alert(`No se pudo guardar el artículo: ${response.status} ${errorData.message || ''}`);
      return null;
    }

    const data = await response.json();

    return {
      message: data.message,
      guardado: data.guardado
    };

  } catch (error) {
    console.error('Error al guardar artículo:', error);
    alert(`Error: ${error.message}`);
    return null;
  }
}

export async function checkIfArticleSaved(articleId, session) {
  if (!session?.token || session.token === "VISITOR_MODE") {
    console.log('No hay token válido');
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/articulos/guardados`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token}`
      }
    });

    if (!response.ok) {
      console.log('Error en response:', response.status);
      return false;
    }

    const data = await response.json();

    // Verificar la estructura de la respuesta
    if (data.articulos && Array.isArray(data.articulos)) {
      const isSaved = data.articulos.some(articulo => {
        return articulo.id === articleId;
      });

      return isSaved;
    } else {
      console.log('Estructura de datos inválida');
      return false;
    }

  } catch (error) {
    console.error('Error al verificar artículo guardado:', error);
    return false;
  }
}

// Función adicional para Next.js - SSR (Server Side Rendering)
export async function getServerSideArticulos() {
  try {
    const response = await fetch(`${API_BASE_URL}/articulos`, {
      cache: 'no-store' // Para evitar cache en SSR
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData || !Array.isArray(jsonData)) {
      throw new Error('Estructura de respuesta inválida');
    }

    return jsonData.map((item) => {
      const { id, titulo, imagen, para_socios } = item;
      const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

      return {
        id,
        titulo,
        imageUrl: img,
        para_socios,
      };
    });
  } catch (error) {
    console.error('Error al obtener artículos en SSR:', error);
    throw error;
  }
}

// Función para Static Generation (SSG)
export async function getStaticArticulos() {
  try {
    const response = await fetch(`${API_BASE_URL}/articulos`, {
      next: { revalidate: 60 } // Revalidar cada 60 segundos
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData || !Array.isArray(jsonData)) {
      throw new Error('Estructura de respuesta inválida');
    }

    return jsonData.map((item) => {
      const { id, titulo, imagen, para_socios } = item;
      const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

      return {
        id,
        titulo,
        imageUrl: img,
        para_socios,
      };
    });
  } catch (error) {
    console.error('Error al obtener artículos en SSG:', error);
    throw error;
  }
}