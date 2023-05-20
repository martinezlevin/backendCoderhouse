export const productPropertiesErrorInfo = (product) => {
  return `Propiedades incompletas o no válidas:
  - título: debe ser una cadena, recibió ${product.title}.
  - descripción: debe ser una cadena, recibió ${product.description}.
  - código: debe ser una cadena, recibido ${product.code}.
  - precio: debe ser Número, recibido ${product.price}.
  - estado: debe ser booleano, recibido ${product.status}.
  - stock: debe ser Número, recibido ${product.stock}.
  - categoría: debe ser Cadena, recibido ${product.category}.`;
};

export const serverErrorInfo = (result) => {
  return `Error interno del servidor. Se obtuvo ${result} cuando se esperaba otro resultado`
}