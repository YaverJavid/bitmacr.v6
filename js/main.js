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
let currentSelectedColor = colorSelector.value
let chooseColorRandomly = false
let rows, cols
guideCellBorderColor.value = borderColor

for (let i = 0; i < menus.length; i++) {
    let currentMenuName = menus[i].children[1].textContent
    menuNav.innerHTML += `<div class="menu-nav-items">${currentMenuName.toUpperCase()}</div>`
}

for (let i = 0; i < menuNav.children.length; i++) {
    menuNav.children[i].addEventListener("click", () => {
        bottomControls.scrollLeft = i * controlWidth
    })
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
            if ((!colorSelectCheckbox.checked) && (!selectColorForFind.checked) && (!selectColorForReplacer.checked)) {
                this.style.background = getCurrentSelectedColor()
                recordPaintData()
            } else {
                let selectedColor = rgbToHex(buffer.getItem(buffer.data.length - 1)[i])
                changeCellBorderColor(borderColor)
                if (selectColorForFind.checked) {
                    colorToBeReplacedSelector.value = selectedColor
                    selectColorForFind.checked = false
                } else if (colorSelectCheckbox.checked) {
                    colorSelector.value = selectedColor
                    currentSelectedColor = colorSelector.value
                    colorSelectCheckbox.checked = false
                } else {
                    colorToReplaceWithSelector.value = selectedColor
                    selectColorForReplacer.checked = false
                }
            }
           
        })
        paintCells[i].style.borderColor = guideCellBorderColor.value
    }
    recordPaintData()
}

addCanvas(10, 10)






colorSelector.addEventListener("input", function() {
    if (currentSelectedColor == '#00000000') {
        eraseButton.value = 'Select Eraser'
    }
    currentSelectedColor = this.value
})



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

function exportImage (){
    paintDataOnCanvas(ctx, canvas, buffer.getItem(), cellBorderWidthSlider.value, cellBorderColorSelector.value, rows, cols)
    downloadCanvasAsImage(canvas, 'syn-pixmacr-yj.png')
}

function paintDataOnCanvas(ctx, canvas, colorData, borderWidth, borderColor, rows, cols){
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






document.getElementById('undo').addEventListener("click", () => {
    if (buffer.setPointer(buffer.pointer - 1))
        applyPaintData(buffer.getItem())
})

document.getElementById('redo').addEventListener("click", () => {
    if (buffer.setPointer(buffer.pointer + 1))
        applyPaintData(buffer.getItem())
})






colorSelectCheckbox.addEventListener("input", function() {
    if (this.checked) changeCellBorderColor("red")
    else changeCellBorderColor(borderColor)
    selectColorForFind.checked = false
    selectColorForReplacer.checked = false
})

selectColorForReplacer.addEventListener("input", function() {
    if (this.checked) changeCellBorderColor("red")
    else changeCellBorderColor(borderColor)
    selectColorForFind.checked = false
    colorSelectCheckbox.checked = false
})

selectColorForFind.addEventListener("input", function() {
    if (this.checked) changeCellBorderColor("red")
    else changeCellBorderColor(borderColor)
    colorSelectCheckbox.checked = false
    selectColorForReplacer.checked = false
})




eraseButton.addEventListener("click", function() {
    if (this.value == 'Select Eraser') {
        this.value = 'Unselect Eraser'
        prevSelectedColor = getCurrentSelectedColor()
        currentSelectedColor = '#00000000'
    } else {
        currentSelectedColor = prevSelectedColor
        this.value = 'Select Eraser'
    }
})



guideCellBorderColor.addEventListener("input", function (){
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
    if (cols % 2 == 1) return
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


document.getElementById("flipv-button").addEventListener("click",()=>{
    applyPaintData(buffer.getItem().slice().reverse())
    recordPaintData()
})

document.getElementById("fliph-button").addEventListener("click", () => {
    let newData = flip2DArrayHorizontally(squareArray(buffer.getItem().slice())).flat()
    applyPaintData(newData)
    recordPaintData()
})





