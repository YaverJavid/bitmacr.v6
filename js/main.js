let getAccentColor = () => getComputedStyle(root).getPropertyValue("--accent")
let getSecondaryColor = () => getComputedStyle(root).getPropertyValue("--secondary")
let setAccentColor = color => root.style.setProperty("--accent", color)
let setSecondaryColor = color => root.style.setProperty("--secondary", color)


canvas.height = 1840
canvas.width = 1840
canvas.style.border = '1px solid white'
canvas.style.width = '100%'
canvas.style.boxSizing = 'border-box'
let ctx = canvas.getContext('2d')
let cellWidth
let cellHeight
let prevSelectedColor
let buffer = new Stack()
let borderColor = getSecondaryColor().slice(1)
let cellBorderWidth = 1
let usedColors = []
let settingsLocations = []
let pallateColors = document.getElementsByClassName("pallate-color")
for (var i = 0; i < pallateColors.length; i++) {
    usedColors.push(rgbToHex(getComputedStyle(pallateColors[i]).getPropertyValue('background-color')).toLowerCase())
}

let currentSelectedColor = undefined
setCurrentColor("#162829")
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

function redirectViewToSetting(settingName) {
    return redirectMenuViewTo(settingsLocations[settingName] * controlWidth)
}

for (let i = 0; i < menuNav.children.length; i++) {
    menuNav.children[i].addEventListener("click", () => {
        redirectMenuViewTo(i * controlWidth)
    })
    if (bottomControls.children[i].children[1].dataset.type == "settings-menu") {
        settingsLocations[bottomControls.children[i].children[1].dataset.settingsname] = i
        menuNav.children[i].style.display = "none"
    }
}

function getCurrentSelectedColor() {
    if (chooseColorRandomly) return getRandColor()
    return currentSelectedColor
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

function applyPaintData(data) {
    for (var i = 0; i < paintCells.length; i++) {
        paintCells[i].style.backgroundColor = data[i]
    }
}



function addCanvas(argRows, argCols) {
    rows = argRows
    cols = argCols
    buffer.clearStack()
    paintZone.innerHTML = ""
    let HTML = ''
    let i = 0
    let elemWidth = 100 / cols
    cellWidth = canvas.width / cols
    cellHeight = cellWidth
    while (i < rows * cols) {
        HTML += `<div class="cell" style="width:${elemWidth}%;height:${elemWidth}vw"></div>`
        i++
    }
    paintZone.innerHTML = HTML
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].addEventListener("click", function() {
            if (colorSelectionInProgress) {
                let selectedColor = rgbToHex(buffer.getItem()[i])
                changeCellBorderColor(borderColor)
                if (colorCopierCheckboxes.selectColorForFind.checked) {
                    colorToBeReplacedSelector.value = selectedColor
                    colorCopierCheckboxes.selectColorForFind.checked = false
                } else if (colorCopierCheckboxes.colorSelectCheckbox.checked) {
                    setCurrentColor(selectedColor)
                    colorCopierCheckboxes.colorSelectCheckbox.checked = false
                } else if (colorCopierCheckboxes.selectColorForReplacer.checked) {
                    colorToReplaceWithSelector.value = selectedColor
                    colorCopierCheckboxes.selectColorForReplacer.checked = false
                } else if (colorCopierCheckboxes.copyColorFromCellCheckbox.checked) {
                    copyTextToClipboard(selectedColor);
                    copiedColorShower.textContent = `If Color Wasn't Copied, Copy Manually: ${selectedColor}`
                    colorCopierCheckboxes.copyColorFromCellCheckbox.checked = false
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
            }
            else {
                this.style.background = getCurrentSelectedColor()
                recordPaintData()
            }


        })
        paintCells[i].style.borderColor = borderColor
    }
    recordPaintData()

}

addCanvas(10, 10)






colorSelector.addEventListener("input", function() {
    if (currentSelectedColor == '#00000000') {
        eraseButton.value = 'Select Eraser'
    }
    setCurrentColor(this.value)
})

function getPaletteHTML(color) {
    return `<div style="background:${color}" onclick="setCurrentColor('${color}')" class="pallate-color"></div>`
}

function setCurrentColor(color) {
    currentSelectedColor = color
    colorSelector.value = color
    if (!usedColors.includes(color.toLowerCase())) {
        pallateContainer.innerHTML += getPaletteHTML(color)
        usedColors.push(color)
    }

}


document.getElementById('clear-button').addEventListener("click", () => {
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].style.background = "#00000000"
    }
    recordPaintData()
})

document.getElementById('fill-all-button').addEventListener("click", () => {
    let color = getCurrentSelectedColor()
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].style.background = color
    }
    recordPaintData()
})

function drawRectangle(context, x, y, width, height, borderColor, fillColor, borderWidth) {
    context.beginPath();
    context.rect(x, y, width, height);
    context.fillStyle = fillColor;
    context.fill();
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;
    context.stroke();
}

function exportImage() {
    paintDataOnCanvas(ctx, canvas, buffer.getItem(), cellBorderWidthSlider.value, cellBorderColorSelector.value, rows, cols)
    downloadCanvasAsImage(canvas, 'syn-pixmacr-yj.png')
}

function paintDataOnCanvas(ctx, canvas, colorData, borderWidth, borderColor, rows, cols) {
    let currentY = 0
    let currentX = 0
    let cellWidth = canvas.height / cols
    // let cellHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = cellBorderWidthSlider.value
    if (cellBorderWidthSlider.value == 0) {
        for (let i = 0; i < colorData.length; i++) {
            let currentCellColor = colorData[i]
            ctx.fillStyle = currentCellColor
            ctx.strokeStyle = 'black'
            ctx.fillRect(currentX, currentY, cellWidth, cellWidth)
            currentX += cellWidth
            if (Math.round(currentX) == Math.round(canvas.width)) {
                currentX = 0
                currentY += cellWidth
            }

        }
    } else {
        for (let i = 0; i < colorData.length; i++) {
            let currentCellColor = colorData[i]
            if (currentCellColor != "rgba(0, 0, 0, 0)")
                drawRectangle(ctx, currentX, currentY, cellWidth, cellWidth, borderColor, currentCellColor, borderWidth)
            currentX += cellWidth
            if (Math.round(currentX) == Math.round(canvas.width)) {
                currentX = 0
                currentY += cellWidth
            }
        }
    }
    if (watermarkChekbox.checked) {
        ctx.fillStyle = 'white'
        ctx.font = '50px Arial'
        ctx.fillText('Pix-Macr',
            canvas.width - (canvas.width / 5),
            canvas.height - (canvas.height / 10),
            canvas.width - (canvas.width / 5)
        )

    }


}


document.getElementById('export-button').addEventListener("click", exportImage)
document.getElementById('export-button2').addEventListener("click", exportImage)


cellsSlider.addEventListener("input", function() {
    canvasSizeShower.innerHTML = `(${this.value})`
})
cellsSlider.addEventListener("change", function() {
    if (confirm(`You will loose your artwork if you resize. Do you really want to resize to ${Math.round(canvas.width / cellWidth)} cell(s) to ${this.value}cell(s)?`)) {
        addCanvas(this.value, this.value)
        if (guideCheckbox.checked) {
            addGuides()
        }
        if (!borderCheckbox.checked) {
            removeBorder()
        }
    } else {
        cellsSlider.value = Math.round(canvas.width / cellWidth)
        canvasSizeShower.innerHTML = `(${Math.round(canvas.width / cellWidth)})`
    }
})






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
    if (this.value == 'Select Eraser') {
        this.value = 'Unselect Eraser'
        prevSelectedColor = getCurrentSelectedColor()
        setCurrentColor('#00000000')
    } else {
        setCurrentColor(prevSelectedColor)
        this.value = 'Select Eraser'
    }
})



guideCellBorderColor.addEventListener("input", function() {
    borderColor = this.value
    for (var i = 0; i < paintCells.length; i++) {
        paintCells[i].style.borderColor = borderColor
    }
})

borderCheckbox.addEventListener("input", function() {
    if (this.checked) {
        for (var i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderWidth = '0.5px'
        }
    } else {
        for (var i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderWidth = '0'
        }
    }
    if (guideCheckbox.checked) addGuides()

})

guideCheckbox.addEventListener("input", function() {
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
})


function addGuides() {
    let cols = Math.round(canvas.width / cellWidth)
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
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].style.background = getRandColor()
    }
    recordPaintData()

})


randomColorSelectorButton.addEventListener("click", () => {
    if (chooseColorRandomly) {
        chooseColorRandomly = false
        randomColorSelectorButton.value = "Select Random Color Mode"
    } else {
        chooseColorRandomly = true
        randomColorSelectorButton.value = "Select Normal Color Mode"
    }
})

replaceButton.addEventListener("click", () => {
    let colorToBeReplaced = colorToBeReplacedSelector.value
    let colorToReplaceWith = colorToReplaceWithSelector.value
    for (var i = 0; i < paintCells.length; i++) {
        let currentColor = rgbToHex(getComputedStyle(paintCells[i]).getPropertyValue("background"))
        if (matchHexColors(colorToBeReplaced, currentColor, colorMatchThresholdSlider.value))
            paintCells[i].style.backgroundColor = colorToReplaceWith

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


let currentCell;

let startingCoords = {}
paintZone.addEventListener('touchstart', (event) => {
    if (["none", "stroke"].includes(paintModeSelector.value) ) return
    const { targetTouches } = event;
    const touch = targetTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    const currentCellIndex = Array.from(paintCells).indexOf(document.elementFromPoint(x, y))
    startingCoords.gridX = Math.floor(currentCellIndex / cols);
    startingCoords.gridY = currentCellIndex % cols
    startingCoords.x = x
    startingCoords.y = y
})


paintZone.addEventListener('touchmove', (event) => {
    if (paintModeSelector.value == "none") return
    const { targetTouches } = event;
    const touch = targetTouches[0];
    const x = touch.clientX
    const y = touch.clientY
    if (["circle", "filled-circle"].includes(paintModeSelector.value)) {
        let paintCells2d = []
        for (let i = 0; i < paintCells.length; i++) {
            paintCells[i].style.background = buffer.getItem()[i]
            paintCells2d.push(paintCells[i])
        }
        paintCells2d = squareArray(paintCells2d)
        event.preventDefault()
        const cw = 350 / cols
        const radius = Math.ceil(Math.abs(startingCoords.x - x) / cw)
        if (paintModeSelector.value == "circle")
            drawCircle(startingCoords.gridX - radius, startingCoords.gridY + radius, radius, paintCells2d, false)
        else{
            drawCircle(startingCoords.gridX - radius, startingCoords.gridY + radius, radius, paintCells2d, true)
        }
        return
    } 
    
    // Stroke 
    event.preventDefault()
    currentCell = document.elementFromPoint(x, y);
    if (currentCell.classList[0] != "cell") return
    currentCell.style.background = getCurrentSelectedColor()
});

paintZone.addEventListener('touchend', (event) => {
    if (paintModeSelector.value != "none") recordPaintData()
})



// Pallette 
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
    }
})

document.getElementById("color-to-replace-with-selector-hex").addEventListener("input", function() {
    if (validateHex(this.value)) {
        colorToReplaceWithSelector.value = this.value
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
    paintDataOnCanvas(ctx, canvas, buffer.getItem(), cellBorderWidthSlider.value, cellBorderColorSelector.value, rows, cols)
    img.src = canvas.toDataURL()
    img.style.border = "1px solid var(--secondary)"
    drawingCheckerSection.removeChild(drawingCheckerSection.lastChild)
    drawingCheckerSection.appendChild(img)
})


// paint modes