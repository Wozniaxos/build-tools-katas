const fs = require('fs');
const path = require('path');
const imagesPath = path.join(__dirname, '../images');
const jimp = require('jimp');

const files = fs.readdirSync(imagesPath);
const jpgFiles = files.filter(file => file.split('.').pop() === 'jpg');
const maxAllowedSize = 500;

const _resizeImage = async(image, dimension) =>
  dimension === 'Height' 
    ? await image.resize(jimp.AUTO, maxAllowedSize) 
    : await image.resize(maxAllowedSize, jimp.AUTO);

jpgFiles.forEach(async file => {
  const imgFromPath = path.join(`${imagesPath}/`, file);
  const imgToPath = path.join(__dirname, `../../build/images/${file}`);

  const image = await jimp.read(imgFromPath);
  const biggerDimension = image.getHeight() > image.getWidth() ? 'Height' : 'Width';
  const shouldResize = image[`get${biggerDimension}`]() > maxAllowedSize;
  const imageToSave = shouldResize ? await _resizeImage(image, biggerDimension) : image;

  imageToSave.writeAsync(imgToPath);
})

