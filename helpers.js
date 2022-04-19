import '@tensorflow/tfjs';
import Tesseract from 'tesseract.js';
import * as toxicity from '@tensorflow-models/toxicity';
const resultado = document.getElementById('resultado');
const grafica = document.getElementById('grafica');
const inputFile = document.getElementById('file');
let modelo;

// funcion para cargar el modelo de toxicidad
export const cargarModelo = async () => {
  inputFile.disabled = true;
  inputFile;
  resultado.innerHTML = `<p>Estado: Cargando modelo, por favor espere</p>`;
  const limite = 0.9;

  modelo = await toxicity.load(limite);

  resultado.innerHTML = `<p>Estado: Modelo Cargado</p>`;
  inputFile.disabled = false;
};

// funcion para obtener path de imagen
export const obtenerPathImagen = (imagen) => {
  const path = window.URL.createObjectURL(imagen);
  return path;
};

// funcion para obtener arreglo de palabras
export const obtenerPalabras = async (path) => {
  let {
    data: { text: texto },
  } = await Tesseract.recognize(path, 'spa', {
    logger: ({ status, progress }) => {
      resultado.innerHTML = `<p>Estado: ${status} - Porcentaje : ${Math.round(
        progress * 100
      )}%</p>`;
    },
  });

  // quitar los caracteres especiales
  texto = texto.replace(/[^\w\s]/gi, '');

  // separar las palabras por medio del salto de linea
  texto = texto.split('\n').join(' ');
  // separar las palabras por medio del espacio
  texto = texto.split(' ');
  // quitar espacios en blanco
  texto = texto.filter((palabra) => palabra !== '');
  //   console.log(texto);

  return texto;
};

export const clasificarPalabras = async (palabras) => {
  resultado.innerHTML = `<p>Estado: Clasificando...</p>`;
  grafica.innerHTML = '';

  const predicciones = await modelo.classify(palabras);

  return predicciones;
};

export const pintarResultadoClasificacion = (palabras, predicciones) => {
  // vaciamos el contenido del resultado
  resultado.innerHTML = '';

  // declaramos la cabeza de la tabla
  let tabla = `
    <table class="table">
        <thead>
        <tr>
        <th>Palabra</th>
    `;

  // insertamos los tipos de toxicidad
  predicciones.forEach((prediccion) => {
    tabla += `
        <th scope="col">${prediccion.label}</th>
    `;
  });

  // cerrar la cabeza de la tabla
  tabla += `</tr></thead><tbody>`;

  // recorremos las palabras y hacemos que coincidan con el arreglo de predicciones
  palabras.forEach((palabra, index) => {
    tabla += `<tr> <td>${palabra}</td>`;
    predicciones.forEach(({ results }) => {
      let claseCss = results[index].match ? 'bg-success' : 'bg-danger';
      let mensaje = results[index].match ? 'Si' : 'No';
      tabla += `<td class="${claseCss}">${mensaje}</td>`;
    });
    tabla += `</tr>`;
  });
  tabla += `</tbody></table>`;

  grafica.innerHTML = tabla;
};
