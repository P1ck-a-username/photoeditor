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

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeNoise(img, min, max) {
    var pixels = ImageUtils.getPixels(img);
    var length = pixels.data.length;
    var data = pixels.data;
    for (var i = 0; i < length; i += 4) {
        data[i] = data[i] + getRandomInt(min, max);
        data[i + 1] = data[i + 1] + getRandomInt(min, max);
        data[i + 2] = data[i + 2] + getRandomInt(min, max);
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function makeMoreBlue(img) {

    var pixels = ImageUtils.getPixels(img);
    var length = pixels.data.length;
    var data = pixels.data;
    for (var i = 0; i < length; i += 4) {
        data[i + 2] = data[i + 2] + 200;
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function makeMoreRed(img) {

    var pixels = ImageUtils.getPixels(img);
    var length = pixels.data.length;
    var data = pixels.data;
    for (var i = 0; i < length; i += 4) {
        data[i] = data[i] + 200;
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function makeMoreGreen(img) {

    var pixels = ImageUtils.getPixels(img);
    var length = pixels.data.length;
    var data = pixels.data;
    for (var i = 0; i < length; i += 4) {
        data[i + 1] = data[i + 1] + 200;
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function makeBright(img, adjustment) {

    var pixels = ImageUtils.getPixels(img);
    var length = pixels.data.length;
    var data = pixels.data;
    for (var i = 0; i < length; i += 4) {
        data[i] = data[i] + adjustment;
        data[i + 1] = data[i + 1] + adjustment;
        data[i + 2] = data[i + 2] + adjustment;
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function makeFunky(img) {
    var pixels = ImageUtils.getPixels(img);
    var length = pixels.data.length;
    var data = pixels.data;

    for (var i = 0; i < length / 2; i += 2) {
        var temp = data[i];
        data[i] = data[length - i];
        data[length - i] = temp;
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}


// function definitions here

$(document).ready(function () {
    var img = new Image();
    img.src = "img/cat.jpg";

    makeFunky(img);
});
