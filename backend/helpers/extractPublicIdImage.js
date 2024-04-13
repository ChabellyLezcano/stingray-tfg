function extractPublicId(url) {
  // Split the URL to get its parts
  const pathArray = url.split("/");
  // Remove the part "https://res.cloudinary.com/<cloud_name>/image/upload/"
  const relevantParts = pathArray.slice(pathArray.indexOf("upload") + 1);
  // Join the remaining parts to form the public_id, excluding the version "vXXXX"
  let publicId = relevantParts
    .filter((part) => !part.startsWith("v"))
    .join("/");
  // Remove the file extension to get only the public_id
  publicId = publicId.substring(0, publicId.lastIndexOf("."));
  return publicId;
}

module.exports = extractPublicId;
