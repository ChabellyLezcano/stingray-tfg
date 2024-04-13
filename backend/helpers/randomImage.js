// Función para obtener un elemento aleatorio del array y combinarlo con la URL base
function randomImage() {
  const cloudAvatarURL = process.env.CLOUD_AVATAR_IMAGES;

  // Define el array de images
  const images = [
    "gdvko4h40ncgsxdxwzc4.png",
    "ahtsgfexrvsb4ffuyisv.png",
    "tmbfuqwitq1m4rdymeey.png",
    "zmdu4yjw2mqdwyfj4cha.png",
    "cqpv1ylkgkyyqlw3dqsi.png",
    "qd0kufqizboqnkrhry2x.png",
    "s3bonsqwfs2be7yjkems.png",
    "uu2un7eijwdjs3exepqj.png",
    "tolicv1xfjjhbplnw5cc.png",
    "kxk7zc79cwfpyfdfro4q.png",
  ];

  // Genera un número aleatorio entre 0 y la longitud del array - 1
  const indiceAleatorio = Math.floor(Math.random() * images.length);

  // Obtiene el elemento aleatorio del array
  const elementoAleatorio = images[indiceAleatorio];

  // Combina el elemento con la URL base
  const urlCompleta = `${cloudAvatarURL}/${elementoAleatorio}`;

  return urlCompleta;
}

module.exports = { randomImage };
