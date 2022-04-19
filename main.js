import {
  clasificarPalabras,
  obtenerPalabras,
  obtenerPathImagen,
  pintarResultadoClasificacion,
} from './helpers';

const obtenerTextoImagen = async (imagen) => {
  const path = obtenerPathImagen(imagen);

  const palabras = await obtenerPalabras(path);

  // console.log(palabras);

  const resultClasificacion = await clasificarPalabras(palabras);

  // console.log(resultClasificacion);
  pintarResultadoClasificacion(palabras, resultClasificacion);
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    obtenerTextoImagen(file);
  });
});
