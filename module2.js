class ImageUtils {

    static getCanvas(w, h) {
        var c = document.querySelector("canvas");
        c.width = w;
        c.height = h;
        return c;
    }

    static getPixels(img) {
        var c = ImageUtils.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0,0,c.width,c.height);
    }

    static putPixels(imageData, w, h) {
        var c = ImageUtils.getCanvas(w, h);
        var ctx = c.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

    static fromImageData(imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;

        var pixelGrid = initializePixelGrid(height);

        for (var y = 0; y < height; y++) {
            var row = (y * width * 4);

            for (var x = 0; x < width; x++) {
                var index = row + (x * 4);
                var rgba = new RGBA(data[index], data[index + 1], data[index + 2], data[index + 3]);
                pixelGrid[y][x] = rgba;
            }
        }
        return new ImageModel(height, width, pixelGrid);
    }

    static fromImgSrc(imgSrc) {
        var img = new Image();
        img.src = imgSrc;
        var data = ImageUtils.getPixels(img);
        return ImageUtils.fromImageData(data);
    }

    static toImageData(imageModel) {

        console.log(imageModel);
        var buffer = new ArrayBuffer(imageModel.height * imageModel.width * 4);

        var data = new Uint8ClampedArray(buffer);

        for (var y = 0; y < imageModel.height; y++) {
            var row = (y * imageModel.width * 4);

            for (var x = 0; x < imageModel.width; x++) {
                var rgba = imageModel.pixelGrid[y][x];

                var index = row + (x * 4);

                data[index] = rgba.red;
                data[index + 1] = rgba.green;
                data[index + 2] = rgba.blue;
                data[index + 3] = rgba.alpha;
            }
        }

        return new ImageData(data, imageModel.width, imageModel.height);
    }

    static drawImageModel(imageModel) {
        var c = ImageUtils.getCanvas(imageModel.width, imageModel.height);
        var imageData = ImageUtils.toImageData(imageModel);
        ImageUtils.putPixels(imageData, imageModel.width, imageModel.height);
    }

}

function initializePixelGrid(height) {
    var pixelGrid = [];
    for (var y = 0; y < height; y++) {
        pixelGrid[y] = [];
    }
    return pixelGrid;
}

class RGBA {
    constructor(redValue, greenValue, blueValue, alphaValue) {
        this.red = redValue;
        this.green = greenValue;
        this.blue = blueValue;
        this.alpha = alphaValue;
    }
}

class ImageModel {
    constructor(heightValue, widthValue, pixelGridValue) {
        this.height = heightValue;
        this.width = widthValue;

        if (pixelGridValue) {
            this.pixelGrid = pixelGridValue;
        }
        else {
            this.pixelGrid = initializePixelGrid(heightValue);
        }
    }
}

function grayscale(imageModel) {

    var grayscaleImageModel = new ImageModel(imageModel.height, imageModel.width);

    for (var y = 0; y < imageModel.height; y++) {
        for (var x = 0; x < imageModel.width; x++) {
            var rgba = imageModel.pixelGrid[y][x];
            var average = (rgba.red + rgba.green + rgba.blue) / 3;
            grayscaleImageModel.pixelGrid[y][x] = new RGBA(average, average, average, rgba.alpha);
        }
    }
    return grayscaleImageModel;
}


function verticalMirror(imageModel) {

    var mirrorImageModel = new ImageModel(imageModel.height, imageModel.width);

    for (var y = 0; y < imageModel.height; y++) {
        for (var x = 0; x < imageModel.width / 2; x++) {
            var mirroredIndex = imageModel.width - 1 - x;
            mirrorImageModel.pixelGrid[y][x] = imageModel.pixelGrid[y][mirroredIndex];
            mirrorImageModel.pixelGrid[y][mirroredIndex] = imageModel.pixelGrid[y][x]
        }
    }

    return mirrorImageModel;
}

function horizontalMirror(imageModel) {
    var horizontalImageModel = new ImageModel(imageModel.height, imageModel.width);

    for (var y = 0; y < imageModel.height / 2; y++) {
        var mirroredIndex = imageModel.height - 1 - y;
        for (var x = 0; x < imageModel.width; x++) {
            horizontalImageModel.pixelGrid[y][x] = imageModel.pixelGrid[mirroredIndex][x];
            horizontalImageModel.pixelGrid[mirroredIndex][x] = imageModel.pixelGrid[y][x];
        }
    }

    return horizontalImageModel;
}

function colourise(img, colour, level) {

    var pixels = ImageUtils.getPixels(img);
    var all = pixels.data.length;
    var data = pixels.data;

    for (var i = 0; i < all; i += 4) {
        var originalRGBA = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
        var modifiedRGBA = colourisePixel(originalRGBA, colour, level);
        setPixel(data, i, modifiedRGBA);
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function colourisePixel(originalRGBA, colour, level) {
    var diffRed = (originalRGBA.red - colour.red) * (level / 100);
    var newRed = originalRGBA.red - diffRed;

    var diffGreen = (originalRGBA.green - colour.green) * (level / 100);
    var newGreen = originalRGBA.green - diffGreen;

    var diffBlue = ((originalRGBA.blue - colour.blue) * (level / 100));
    var newBlue = originalRGBA.blue - diffBlue;

    return new RGBA(newRed, newGreen, newBlue, originalRGBA.alpha);
}

function setPixel(data, i, colour) {
    data[i] = colour.red;
    data[i + 1] = colour.green;
    data[i + 2] = colour.blue;
    data[i + 3] = colour.alpha;
}

function sepia(img) {

    var pixels = ImageUtils.getPixels(img);
    var all = pixels.data.length;
    var data = pixels.data;

    for (var i = 0; i < all; i += 4) {
        var originalRGBA = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
        var sepiaRGBA = sepiaPixel(originalRGBA);
        setPixel(data, i, sepiaRGBA);
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function sepiaPixel(colour) {

    var newRed = colour.red * 0.193 + colour.green * 0.769 + colour.blue * 0.189;
    var newGreen = colour.red * 0.349 + colour.green * 0.686 + colour.blue * 0.168;
    var newBlue = colour.red * 0.272 + colour.green * 0.534 + colour.blue * 0.131;

    return new RGBA(newRed, newGreen, newBlue, colour.alpha);
}

function clip(img, adjustment) {
    var pixels = ImageUtils.getPixels(img);
    var all = pixels.data.length;
    var data = pixels.data;

    for (var i = 0; i < all; i += 4) {
        var originalRGBA = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
        var newRGBA = clipPixel(originalRGBA, adjustment);
        setPixel(data, i, newRGBA);
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function clipPixel(colour, range) {
    var clippedRed = 0;

    if (colour.red > 255 - range) {
        clippedRed = 255;
    }
    var clippedGreen = 0;
    if (colour.green > 255 - range) {
        clippedGreen = 255;
    }
    var clippedBlue = 0;
    if (colour.blue > 255 - range) {
        clippedBlue = 255;
    }
    return new RGBA(clippedRed, clippedGreen, clippedBlue, colour.alpha);
}


$(document).ready(function () {
    var img = new Image();
    img.src = "img/cat.jpg";

    var cat = ImageUtils.fromImgSrc("img/cat.jpg");
    ImageUtils.drawImageModel(verticalMirror(cat));
});