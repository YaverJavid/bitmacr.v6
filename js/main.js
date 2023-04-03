let getAccentColor = () => getComputedStyle(root).getPropertyValue("--accent")
let getSecondaryColor = () => getComputedStyle(root).getPropertyValue("--secondary")
let setAccentColor = color => root.style.setProperty("--accent", color)
let setSecondaryColor = color => root.style.setProperty("--secondary", color)

let colorToBeReplaced = colorToBeReplacedSelector.value
let colorToReplaceWith = colorToReplaceWithSelector.value
colorToBeReplacedSelector.addEventListener("change", () => {
    colorToBeReplaced = colorToBeReplacedSelector.value
})

colorToReplaceWithSelector.addEventListener("change", () => {
    colorToReplaceWith = colorToReplaceWithSelector.value
})

let cellWidth
let cellHeight
let prevSelectedColor
let buffer = new Stack()
let borderColor = getSecondaryColor().slice(1)
let cellBorderWidth = 1
// hex should be lowercase
var defaultPalletteColors = ["#f44336", "#ffc107", "#9c27b0", "#4caf50", "#2196f3", "#ff5722", "#607d8b", "#673ab7", "#ffeb3b"]
let usedColors = defaultPalletteColors.flat()
let tabLocations = []
let pallateColors = document.getElementsByClassName("pallate-color")
let currentSelectedColor = undefined
setCurrentColor("#273782")
let chooseColorRandomly = false
let rows, cols
let menuSegmentLocations = []

guideCellBorderColor.value = borderColor

for (let i = 0; i < menus.length; i++) {
    let currentMenuName = menus[i].children[1].textContent
    menuSegmentLocations.push(i * controlWidth)
    menuNav.innerHTML += `<div class="menu-nav-items" data-shortcutkey="${menus[i].children[1].dataset.shortcutkey}" >${currentMenuName.toUpperCase()}
      <kbd class="shortcut-info" style="display: ${menus[i].children[1].dataset.shortcutkey == undefined ? "none" : "initial"}">ctrl+${menus[i].children[1].dataset.shortcutkey}</kbd>
    </div>`
}

function redirectMenuViewTo(location) {
    bottomControls.scrollLeft = location
}

function gotoTab(tabName) {
    return redirectMenuViewTo(tabLocations[tabName] * controlWidth)
}

for (let i = 0; i < menuNav.children.length; i++) {
    menuNav.children[i].addEventListener("click", () => {
        redirectMenuViewTo(i * controlWidth)
    })
    if (bottomControls.children[i].children[1].dataset.type == "hidden-tab") {
        tabLocations[bottomControls.children[i].children[1].dataset.tabname] = i
        menuNav.children[i].style.display = "none"
    }
}



function recordPaintData() {
    let data = []
    for (var i = 0; i < paintCells.length; i++) {
        data.push(window.getComputedStyle(paintCells[i]).getPropertyValue('background-color'))
    }
    buffer.deleteRight()
    buffer.addItem(data)
    return data
}

function applyPaintData(data, isUndoRedo = true) {
    if (isUndoRedo) {
        for (var i = 0; i < paintCells.length; i++) {
            paintCells[i].style.background = data[i]
        }
        return
    }
    for (var i = 0; i < paintCells.length; i++) {
        setCellColor(paintCells[i], data[i])
    }
}

function addCanvas(argRows, argCols) {
    rows = argRows
    cols = argCols
    buffer.clearStack()
    paintZone.innerHTML = ""
    let HTML = ''
    let i = 0
    let elemWidth = parseFloat(getComputedStyle(paintZone).getPropertyValue("width")) / window.innerWidth * 100 / cols
    while (i < rows * cols) {
        HTML += `<div class="cell" style="width:${elemWidth}vw;height:${elemWidth}vw"></div>`
        i++
    }
    paintZone.innerHTML = HTML
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].addEventListener("click", function() {
            let currentCol = i % cols
            let currentRow = Math.floor(i / rows);
            lineInfoShower.textContent = `row:${currentRow},col:${currentCol},`
            if (colorSelectionInProgress) {
                let selectedColor = rgbToHex(buffer.getItem()[i])
                changeCellBorderColor(borderColor)
                if (colorCopierCheckboxes.selectColorForFind.checked) {
                    colorToBeReplacedSelector.value = selectedColor
                    colorToBeReplaced = selectedColor
                    colorCopierCheckboxes.selectColorForFind.checked = false
                } else if (colorCopierCheckboxes.colorSelectCheckbox.checked) {
                    setCurrentColor(selectedColor)
                    colorCopierCheckboxes.colorSelectCheckbox.checked = false
                } else if (colorCopierCheckboxes.selectColorForReplacer.checked) {
                    colorToReplaceWithSelector.value = selectedColor
                    colorToReplaceWith = selectedColor
                    colorCopierCheckboxes.selectColorForReplacer.checked = false
                } else if (colorCopierCheckboxes.copyColorFromCellCheckbox.checked) {
                    copyTextToClipboard(selectedColor);
                    copiedColorShower.innerHTML = `If Color Wasn't Copied, Copy Manually: <span class="color">${selectedColor}</span> <span style="user-select:none; color: ${selectedColor}; background: ${selectedColor}; border: 0.5px solid var(-secondary)" >!!!!</span>`
                    colorCopierCheckboxes.copyColorFromCellCheckbox.checked = false
                } else if (colorCopierCheckboxes.selectHueFromCell.checked) {
                    colorCopierCheckboxes.selectHueFromCell.checked = false
                    hueAngle.value = getHSLFromHex(selectedColor).hue
                    hue = parseFloat(hueAngle.value)
                    updateHueShower()
                } else if (colorCopierCheckboxes.selectLightingFromCell.checked) {
                    // LIGHTING
                    colorCopierCheckboxes.selectLightingFromCell.checked = false
                    lightingSlider.value = getHSLFromHex(selectedColor).lightness * 100

                    lightingShower.innerHTML = `(${lightingSlider.value}%)`
                } else if (colorCopierCheckboxes.selectSaturationFromCell.checked) {
                    // SATURATION
                    colorCopierCheckboxes.selectSaturationFromCell.checked = false
                    saturationSlider.value = getHSLFromHex(selectedColor).saturation * 100
                    saturationShower.innerHTML = `(${saturationSlider.value}%)`
                }
                recordPaintData()
                colorSelectionInProgress = false
            } else if (clickModeSelector.value == "row") {
                let rowToPaint = Math.floor(i / rows);
                let newData = squareArray(buffer.getItem().slice())
                let rowArray = []
                for (let i = 0; i < rows; i++) rowArray.push(getCurrentSelectedColor())
                newData[rowToPaint] = rowArray
                applyPaintData(newData.flat())
                recordPaintData()
            } else if (clickModeSelector.value == "col") {
                let colToPaint = i % cols
                let newData = squareArray(buffer.getItem().slice())
                for (let i = 0; i < newData.length; i++) newData[i][colToPaint] = getCurrentSelectedColor()
                applyPaintData(newData.flat())
                recordPaintData()
            } else if (clickModeSelector.value == "fill") {
                applyPaintData(fill(squareArray(buffer.getItem()), currentCol, currentRow).flat())
                recordPaintData()
            }
            else {
                setCellColor(this, getCurrentSelectedColor())
                recordPaintData()
            }


        })
        paintCells[i].style.borderColor = borderColor
    }
    // if (guideCheckbox.checked || guideCheckbox2.checked)
    // addGuides()
    recordPaintData()

}

addCanvas(10, 10)





colorSelector.addEventListener("input", function() {
    setCurrentColor(this.value)
})



function setCurrentColor(color) {
    currentSelectedColor = color
    colorSelector.value = color
    if (!usedColors.includes(color.toLowerCase())) {
        pallateContainer.innerHTML += getPaletteHTML(color)
        usedColors.push(color)
    }
    removePalletteSelectionHint()
}


document.getElementById('clear-button').addEventListener("click", () => {
    for (let i = 0; i < paintCells.length; i++) {
        setCellColor(paintCells[i], "#00000000")
    }
    recordPaintData()
})

document.getElementById('fill-all-button').addEventListener("click", () => {
    for (let i = 0; i < paintCells.length; i++) {
        setCellColor(paintCells[i], getCurrentSelectedColor())
    }
    recordPaintData()
})


function exportImage(mini = false) {
    let currentBuffer = buffer.getItem()
    let paintData = []
    for (let i = 0; i < currentBuffer.length; i++) {
        paintData.push(rgbaToHex(currentBuffer[i]))
    }
    let dataUrl = colorDataToImage(squareArray(paintData), cellBorderWidthSlider.value, cellBorderColorSelector.value, mini)
    downloadImage(dataUrl, 'syn-pixmacr-yj.png')
}

function colorDataToImage(colors, borderWidth, borderColor, mini = false, res = 1024) {
    // Calculate the dimensions of the canvas
    const canvasWidth = colors[0].length;
    const canvasHeight = colors.length;

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Get the canvas context and create an ImageData object
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvasWidth, canvasHeight);

    // Loop through each pixel in the ImageData object and set its color from the 2D array
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Calculate the x and y position of the pixel
        const x = (i / 4) % canvasWidth;
        const y = Math.floor(i / (4 * canvasWidth));

        // Get the color of the corresponding cell in the 2D array
        const color = colors[y][x];

        // Convert the color from hex to RGB
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        let a = parseInt(color.substring(7, 9), 16);
        if (isNaN(a)) a = 255
        // Set the pixel color in the ImageData object
        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
    }

    // Put the ImageData onto the canvas
    ctx.putImageData(imageData, 0, 0);
    if (mini) return canvas.toDataURL()
    // Scale the canvas up to resXres
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = res;
    scaledCanvas.height = res;

    const scaledCtx = scaledCanvas.getContext('2d');
    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, res, res);
    let cellSize = res / colors.length
    // If there is a border, draw it onto the final canva
    scaledCtx.lineWidth = borderWidth;
    scaledCtx.strokeStyle = borderColor;
    if (borderWidth > 0) {
        for (let y = 0; y < colors.length; y++) {
            for (let x = 0; x < colors[y].length; x++) {
                if (colors[y][x] != "#00000000" || cellBorderOnTransparentCellsCheckbox.checked)
                    scaledCtx.strokeRect(x * cellSize + borderWidth / 2, y * cellSize + borderWidth / 2, cellSize - borderWidth, cellSize - borderWidth);
            }
        }
    }
    return scaledCanvas.toDataURL();

}








document.getElementById('export-button').addEventListener("click", () => exportImage())
document.getElementById('export-button2').addEventListener("click", () => exportImage())
document.getElementById("export-mini").addEventListener("click", () => exportImage(true))

cellsSlider.addEventListener("input", function() {
    canvasSizeShower.innerHTML = `(${this.value})`
})

cellsSlider.addEventListener("change", () => changeCanvasSize())
document.getElementById("increment-canvas-size").addEventListener("click", () => changeCanvasSize(1))
document.getElementById("decrement-canvas-size").addEventListener("click", () => changeCanvasSize(-1))

function changeCanvasSize(offset = 0) {
    cellsSlider.value = parseInt(cellsSlider.value) + offset
    customConfirm(`You will loose your artwork if you resize. Do you really want to resize to ${cols} cell(s) to ${cellsSlider.value}cell(s)?`,
        () => {
            addCanvas(cellsSlider.value, cellsSlider.value)
            if (guideCheckbox.checked) {
                addGuides()
            }
            if (!borderCheckbox.checked) {
                removeBorder()
            }
            canvasSizeShower.innerHTML = `(${cellsSlider.value})`
        },
        () => {
            cellsSlider.value = cols
            canvasSizeShower.innerHTML = `(${cols})`
        }
    )
}





undo.addEventListener("click", () => {
    if (buffer.setPointer(buffer.pointer - 1))
        applyPaintData(buffer.getItem())
})

redo.addEventListener("click", () => {
    if (buffer.setPointer(buffer.pointer + 1))
        applyPaintData(buffer.getItem())
})


// Color Copier Manager
let colorSelectionInProgress = false
for (let colorCopierCheckbox in colorCopierCheckboxes) {
    colorCopierCheckboxes[colorCopierCheckbox].addEventListener("input", function() {
        if (!this.checked) {
            changeCellBorderColor(borderColor)
            colorSelectionInProgress = false
            return
        }
        colorSelectionInProgress = true
        for (let colorCopierCheckbox in colorCopierCheckboxes) colorCopierCheckboxes[colorCopierCheckbox].checked = false
        this.checked = true
        changeCellBorderColor("red")
    })
}


// END
eraseButton.addEventListener("click", function() {
    colorModeSelector.value = "eraser"
    this.value = "Selected Eraser"
    colorModeShower.textContent = "eraser,"
    setTimeout(() => { this.value = "Select Eraser" }, 500)
})



guideCellBorderColor.addEventListener("input", function() {
    borderColor = this.value
    for (var i = 0; i < paintCells.length; i++) {
        paintCells[i].style.borderColor = borderColor
    }
})

setUpLocalStorageBucket("bitmacr_border", "1")
execBucket("bitmacr_border", "0", () => {
    removeBorder()
    borderCheckbox.checked = false
    guideCellBorder2.checked = false
})

borderCheckbox.addEventListener("input", handleGuideBorderVisibility)
guideCellBorder2.addEventListener("input", handleGuideBorderVisibility)

guideCheckbox.addEventListener("input", handleQuadrandGuideClick)
guideCheckbox2.addEventListener("input", handleQuadrandGuideClick)

function handleGuideBorderVisibility() {
    borderCheckbox.checked = this.checked
    guideCellBorder2.checked = this.checked
    if (this.checked) {
        localStorage.setItem("bitmacr_border", "1")

        for (var i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderWidth = '0.5px'
        }
    } else {
        localStorage.setItem("bitmacr_border", "0")
        for (var i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderWidth = '0'
        }
    }
    if (guideCheckbox.checked) addGuides()

}

function handleQuadrandGuideClick() {
    guideCheckbox.checked = this.checked
    guideCheckbox2.checked = this.checked
    if (this.checked) {
        addGuides()
    } else {
        if (borderCheckbox.checked) {
            for (var i = 0; i < paintCells.length; i++) {
                paintCells[i].style.border = `0.5px solid ${borderColor}`
            }
        } else {
            for (var i = 0; i < paintCells.length; i++) {
                paintCells[i].style.border = `0 solid ${borderColor}`
            }
        }
    }
}



function addGuides() {

    if (cols % 2 == 1) {
        let paintCells2d = []
        for (let i = 0; i < paintCells.length; i++)
            paintCells2d.push(paintCells[i])
        paintCells2d = squareArray(paintCells2d)
        for (let i = 0; i < paintCells2d.length; i++) {
            let middleElementIndex = (paintCells2d[i].length - 1) / 2
            paintCells2d[i][middleElementIndex].style.borderRight = `1px dashed ${borderColor}`
            paintCells2d[i][middleElementIndex].style.borderLeft = `1px dashed ${borderColor}`
        }
        let middlePaintCellsArray = paintCells2d[(paintCells2d.length - 1) / 2]
        for (let i = 0; i < middlePaintCellsArray.length; i++) {
            middlePaintCellsArray[i].style.borderTop = `1px dashed ${borderColor}`
            middlePaintCellsArray[i].style.borderBottom = `1px dashed ${borderColor}`
        }
        return
    }
    for (var i = 0; i < paintCells.length; i += (cols / 2)) {
        paintCells[i].style.borderLeft = `1px dashed ${borderColor}`
    }
    let j = 0;
    for (var i = (cols * (cols / 2)); i < paintCells.length; i++) {
        paintCells[i].style.borderTop = `1px dashed ${borderColor}`
        j++
        if (j == cols) break
    }
}


function removeBorder() {
    for (var i = 0; i < paintCells.length; i++) {
        paintCells[i].style.borderWidth = '0'
    }
}


cellBorderWidthSlider.addEventListener("input", () => {
    cellBorderWidthShower.innerHTML = `(${cellBorderWidthSlider.value})`
})

function packQuadrants(quadrant1, quadrant2, quadrant3, quadrant4) {
    var packedArray = [];
    for (var i = 0; i < quadrant1.length; i++) {
        packedArray.push(quadrant1[i].concat(quadrant2[i]));
    }
    for (var i = 0; i < quadrant3.length; i++) {
        packedArray.push(quadrant3[i].concat(quadrant4[i]));
    }
    return packedArray.flat();
}



multiplyQButton.addEventListener("click", () => {
    let qToCopy = multiplyQSelector.value
    let data = squareArray(recordPaintData())
    let qToCopyData = getQuadrant(data, qToCopy)
    let newQ1, newQ2, newQ3, newQ4
    if (qToCopy == 1) {
        newQ1 = qToCopyData
    } else if (qToCopy == 2) {
        newQ1 = flip2DArrayHorizontally(qToCopyData)
    } else if (qToCopy == 3) {
        newQ1 = flip2DArrayVertically(qToCopyData)
    } else if (qToCopy == 4) {
        newQ1 = flip2DArrayHorizontally((flip2DArrayVertically(qToCopyData)))
    }


    if (multiplyTargetCheckboxes.q2MultiplyTargetCheckbox.checked) {
        newQ2 = flip2DArrayHorizontally(newQ1)
    } else {
        newQ2 = getQuadrant(data, 2)
    }
    if (multiplyTargetCheckboxes.q3MultiplyTargetCheckbox.checked) {
        newQ3 = flip2DArrayVertically(newQ1)
    } else {
        newQ3 = getQuadrant(data, 3)
    }

    if (multiplyTargetCheckboxes.q4MultiplyTargetCheckbox.checked) {
        newQ4 = flip2DArrayHorizontally(flip2DArrayVertically(newQ1))
    } else {
        newQ4 = getQuadrant(data, 4)
    }
    if (!multiplyTargetCheckboxes.q1MultiplyTargetCheckbox.checked) {
        newQ1 = getQuadrant(data, 1)
    }

    applyPaintData(packQuadrants(newQ1, newQ2, newQ3, newQ4))
    recordPaintData()
})

selectAllCopyTargets.addEventListener("click", () => {
    for (var prop in multiplyTargetCheckboxes) {
        multiplyTargetCheckboxes[prop].checked = true
    }
    updateCopyTargetString()

})

selectAllCopyTargets.addEventListener("dblclick", () => {
    for (var prop in multiplyTargetCheckboxes) {
        multiplyTargetCheckboxes[prop].checked = false
    }
    updateCopyTargetString()
})

for (var prop in multiplyTargetCheckboxes) {
    multiplyTargetCheckboxes[prop].addEventListener("input", updateCopyTargetString)
}


function updateCopyTargetString() {
    let string = ""
    let i = 1
    for (var prop in multiplyTargetCheckboxes) {
        if (multiplyTargetCheckboxes[prop].checked)
            string += `q${i} ,`
        i++
    }
    copyTargetsShower.innerHTML = `(${string.slice(0,-2)})`
}

updateCopyTargetString()

randomiseCellsButton.addEventListener("click", () => {
    for (let i = 0; i < paintCells.length; i++) setCellColor(paintCells[i], getRandColor())
    recordPaintData()

})


replaceButton.addEventListener("click", () => {
    for (var i = 0; i < paintCells.length; i++) {
        let currentColor = rgbToHex(getComputedStyle(paintCells[i]).getPropertyValue("background-color"))
        if (matchHexColors(colorToBeReplaced, currentColor, colorMatchThresholdSlider.value))
            setCellColor(paintCells[i], replaceWithNormalCheckbox.checked ? getCurrentSelectedColor() : colorToReplaceWith)
    }
    recordPaintData()
})

function changeCellBorderColor(color) {
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].style.borderColor = color
    }
}

colorMatchThresholdSlider.addEventListener("input", () => {
    thresholdShower.innerHTML = `(${colorMatchThresholdSlider.value})`
})


document.getElementById("flipv-button").addEventListener("click", () => {
    applyPaintData(buffer.getItem().slice().reverse())
    recordPaintData()
})

document.getElementById("fliph-button").addEventListener("click", () => {
    let newData = flip2DArrayHorizontally(squareArray(buffer.getItem().slice())).flat()
    applyPaintData(newData)
    recordPaintData()
})


document.getElementById("rotate-clockwise-button").addEventListener("click", () => {
    applyPaintData(rotateArray90Degrees(squareArray(buffer.getItem().slice())).flat())
    recordPaintData()
})

document.getElementById("rotate-anticlockwise-button").addEventListener("click", () => {
    applyPaintData(rotateArray90Degrees(squareArray(buffer.getItem().slice()), false).flat())
    recordPaintData()
})

// Pallette 

function getPaletteHTML(color, defaultPallette = false) {
    let classString = defaultPallette ? "default-pallette" : ""
    return `<div style="background:${color}" onclick="selectPalletteColor(this, '${color}')" class="${classString} pallate-color"></div>`
}

document.getElementById("extract-pallette").addEventListener("click", () => {
    let currentUniquePaintData = [...new Set(buffer.getItem())]
    for (let i = 0; i < currentUniquePaintData.length; i++) {
        let currentColor = rgbToHex(currentUniquePaintData[i].toLowerCase())
        if (!usedColors.includes(currentColor)) {
            pallateContainer.innerHTML += getPaletteHTML(currentColor)
            usedColors.push(currentColor)
        }
    }
})

function selectPalletteColor(palletteElem, color) {
    setCurrentColor(color)
    palletteElem.style.borderTopWidth = "5px"
}

function removePalletteSelectionHint() {
    for (let i = 0; i < pallateColors.length; i++) {
        pallateColors[i].style.borderTopWidth = "1px"
    }
}


for (let i = 0; i < defaultPalletteColors.length; i++) {
    pallateContainer.innerHTML += getPaletteHTML(defaultPalletteColors[i], true)
}

// input text color hex ...
document.getElementById("color-selector-hex").addEventListener("input", function() {
    if (validateHex(this.value)) {
        setCurrentColor(this.value)
        colorSelector.value = this.value
    }
})

document.getElementById("color-to-be-replaced-selector-hex").addEventListener("input", function() {
    if (validateHex(this.value)) {
        colorToBeReplacedSelector.value = this.value
        colorToBeReplaced = this.value
    }
})

document.getElementById("color-to-replace-with-selector-hex").addEventListener("input", function() {
    if (validateHex(this.value)) {
        colorToReplaceWithSelector.value = this.value
        colorToReplaceWith = this.value
    }
})

document.getElementById("guide-cell-border-selector-hex").addEventListener("input", function() {
    if (validateHex(this.value)) {
        guideCellBorderColor.value = this.value
        borderColor = this.value
        changeCellBorderColor(this.value)
    }
})

document.getElementById("export-cell-border-selector-hex").addEventListener("input", function() {
    if (validateHex(this.value)) {
        cellBorderColorSelector.value = this.value
    }
})


// drawing result shower

document.getElementById("refresh-drawing-checker").addEventListener("click", () => {
    let img = new Image(200, 200)
    let currentBuffer = buffer.getItem()
    let paintData = []
    for (let i = 0; i < currentBuffer.length; i++) {
        paintData.push(rgbaToHex(currentBuffer[i]))
    }
    img.src = colorDataToImage(
        squareArray(paintData),
        cellBorderWidthSlider.value,
        cellBorderColorSelector.value
    )
    img.style.border = "1px solid var(--secondary)"
    drawingCheckerSection.removeChild(drawingCheckerSection.lastChild)
    drawingCheckerSection.appendChild(img)
})


// paint mode
paintModeSelector.addEventListener("input", () => {
    paintModeInfoShower.textContent = `${paintModeSelector.value},`
})

colorModeSelector.addEventListener("input", () => {
    colorModeShower.textContent = colorModeSelector.value + ','
})



function imageToPixeArtData(image, width, height) {
    // create a new canvas element
    const canvas = document.createElement('canvas');

    // set the canvas dimensions to match the desired dimensions
    canvas.width = width;
    canvas.height = height;

    // get the canvas context
    const context = canvas.getContext('2d');

    // draw the image on the canvas
    context.drawImage(image, 0, 0, width, height);

    // get the pixel data from the canvas
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // create a 2D array to hold the pixel data with hex color values
    const pixelArray = [];

    // loop through the pixels and create a 2D array of hex color values
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const a = pixels[index + 3];

            // convert the RGB values to a hex color value
            const hexColor = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
            row.push("#" + hexColor);
        }
        pixelArray.push(row);
    }

    // return the 2D array of pixel data with hex color values
    return pixelArray.flat();
}



document.getElementById("image-to-pixel").addEventListener("change", function() {
    const file = this.files[0];
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
            let img = new Image();
            img.src = event.target.result;
            img.addEventListener("load", () => {
                applyPaintData(imageToPixeArtData(img, rows, cols))
                recordPaintData()
            })
        };
        reader.readAsDataURL(file);
    }
});



clickModeSelector.addEventListener("change", ()=>{
    onclickFillShower.textContent = clickModeSelector.value + ','
})


deleteNonDefaultPallette.onclick = ()=>{
    usedColors = defaultPalletteColors.flat()
    let palletteElemsToDelete = []
    for (let i = 0; i < pallateContainer.children.length; i++) 
        if(!pallateContainer.children[i].classList.contains("default-pallette")) 
            palletteElemsToDelete.push(pallateContainer.children[i])
    for (let i = 0; i < palletteElemsToDelete.length; i++) 
       pallateContainer.removeChild(palletteElemsToDelete[i])
}