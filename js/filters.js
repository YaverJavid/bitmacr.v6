function filterCanvas(filterFunction, ...args) {
    let currentPaintData = buffer.getItem()
    for (let i = 0; i < currentPaintData.length; i++) {
        let colorObj = convertRGBAStrToObj(currentPaintData[i])
        if (colorObj.a === undefined) colorObj.a = 1
        paintCells[i].style.background = colorObjectToRGBA(filterFunction(colorObj, ...args))

    }
    recordPaintData()
}


document.getElementById("filter-invert").addEventListener("click", () => {
    filterCanvas((pixel) => {
        return {
            r: 255 - pixel.r,
            g: 255 - pixel.g,
            b: 255 - pixel.b,
            a: pixel.a
        };
    })
})

document.getElementById("filter-sepia").addEventListener("click", () => {
    filterCanvas((pixel) => {
        let r = pixel.r;
        let g = pixel.g;
        let b = pixel.b;
        pixel.r = (r * 0.393) + (g * 0.769) + (b * 0.189);
        pixel.g = (r * 0.349) + (g * 0.686) + (b * 0.168);
        pixel.b = (r * 0.272) + (g * 0.534) + (b * 0.131);
        return pixel;
    })
})


document.getElementById("filter-grayscale").addEventListener("click", () => {
    filterCanvas((pixel) => {
        const average = (pixel.r + pixel.g + pixel.b) / 3;
        return { r: average, g: average, b: average, a: pixel.a };
    })
})
document.getElementById("filter-solorize").addEventListener("click", () => {
    filterCanvas((pixel) => {
        return {
            r: pixel.r > 128 ? 255 - pixel.r : pixel.r,
            g: pixel.g > 128 ? 255 - pixel.g : pixel.g,
            b: pixel.b > 128 ? 255 - pixel.b : pixel.b,
            a: pixel.a
        };
    })
})

document.getElementById("shift-colors-button").addEventListener("click", () => {
    filterCanvas((pixel) => {
        if (pixel.a == 0) return pixel
        return {
            r: Math.min(255, pixel.r + (Math.round(Math.random() * 50) - 25)),
            g: Math.min(255, pixel.g + (Math.round(Math.random() * 50) - 25)),
            b: Math.min(255, pixel.b + (Math.round(Math.random() * 50) - 25)),
            a: pixel.a
        };
    })
})

document.getElementById("filter-duotone").addEventListener("click", () => {
    filterCanvas((pixel) => {
        let r = pixel.r
        let g = pixel.g
        let b = pixel.b
        let a = pixel.a
        let average = (r + g + b) / 3
        if (average > 127.5)
            return { a, r: 255, g: 255, b: 255 }
        return { a, r: 0, g: 0, b: 0 }
    })
})

function sharpenImage(imageArray) {
    // Convert hex color values to RGB values
    let rgbArray = imageArray.map(hexToRgb);

    // Apply unsharp masking to the RGB values
    let blurred = applyGaussianBlur(rgbArray);
    let sharpened = rgbArray.map((pixel, i) => {
        let blurredPixel = blurred[i];
        let sharpenedPixel = [
      clamp(pixel[0] * 2 - blurredPixel[0], 0, 255),
      clamp(pixel[1] * 2 - blurredPixel[1], 0, 255),
      clamp(pixel[2] * 2 - blurredPixel[2], 0, 255),
    ];
        return sharpenedPixel;
    });

    // Convert RGB values back to hex color values
    let sharpenedHexArray = sharpened.map(rgbToHex);
    return sharpenedHexArray;
}

function hexToRgb(hex) {
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}

function rgbToHex(rgb) {
    let r = rgb[0].toString(16).padStart(2, "0");
    let g = rgb[1].toString(16).padStart(2, "0");
    let b = rgb[2].toString(16).padStart(2, "0");
    return "#" + r + g + b;
}

function applyGaussianBlur(rgbArray) {
    let weights = [1, 2, 1, 2, 4, 2, 1, 2, 1];
    let sum = weights.reduce((acc, val) => acc + val, 0);
    let width = Math.sqrt(rgbArray.length);

    let blurred = [];
    for (let i = 0; i < rgbArray.length; i++) {
        let r = 0,
            g = 0,
            b = 0;
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                let x = (i % width) + j;
                let y = Math.floor(i / width) + k;
                if (x < 0 || x >= width || y < 0 || y >= width) {
                    continue;
                }
                let weight = weights[(j + 1) * 3 + (k + 1)];
                let pixel = rgbArray[y * width + x];
                r += pixel[0] * weight;
                g += pixel[1] * weight;
                b += pixel[2] * weight;
            }
        }
        r /= sum;
        g /= sum;
        b /= sum;
        blurred.push([r, g, b]);
    }
    return blurred;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function arrayRGBToHex(array){
    for (var i = 0; i < array.length; i++) {
        array[i] = rgbaToHex(array[i])
    }
    console.log(array);
    return array
}

document.getElementById("sharpen-image-button").addEventListener("click",()=>{
    console.log(sharpenImage(arrayRGBToHex(buffer.getItem())))
    recordPaintData()
})