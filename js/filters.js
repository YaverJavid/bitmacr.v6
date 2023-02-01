function filterCanvas(filterFunction) {
    let currentPaintData = buffer.getItem()
    for (let i = 0; i < currentPaintData.length; i++) {
        let colorObj = convertRGBAStrToObj(currentPaintData[i])
        if (colorObj.a === undefined) colorObj.a = 1
        paintCells[i].style.background = colorObjectToRGBA(filterFunction(colorObj))

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

// document.getElementById("filter-").addEventListener("click", () => {
//     filterCanvas((pixel, color1 = "red", color2 = "blue")=>{
//         let brightness = 0.34 * pixel.r + 0.5 * pixel.g + 0.16 * pixel.b
//         let color = brightness > 255 / 2 ? color1 : color2;
//         pixel.r = color[0];
//         pixel.g = color[1];
//         pixel.b = color[2];
//         return pixel
//     })
// })
// document.getElementById("filter-grayscale").addEventListener("click", () => {})