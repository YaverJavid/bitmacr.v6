if (!localStorage.getItem("drawings")) {
    localStorage.setItem("drawings", "{}")
}

let drawings = JSON.parse(localStorage.getItem("drawings"))

document.getElementById("raw-data-fp").addEventListener("change", function() {
    let fr = new FileReader;
    fr.onload = () => {
        let data = parseRawData(fr.result)
        if (!data) return
        addCanvas(data.rows, data.cols)
        applyPaintData(data.colorData)
        buffer.clearStack()
    }
    fr.readAsText(this.files[0])
    this.value = null
})

function parseRawData(rawData) {
    let data, res, colorData
    try {
        data = rawData.toString().split(':')
        res = data[0].split(",")
        res = [parseInt(res[0]), parseInt(res[1])]
        colorData = verifyAndProcessRawColorArray(data[1].split(','), res[0], res[1])
    }
    catch (error) {
        alert("File is corrupted")
        return
    }
    return {
        cols: res[1],
        rows: res[0],
        colorData
    }
}

function getCurrentDrawingData() {
    let cols = Math.round(canvas.height / cellHeight)
    let rows = Math.round(canvas.width / cellWidth)
    return toRawData(buffer.getItem(), rows, cols)
}

function toRawData(primitiveData, rows, cols) {
    let data = ""
    data += rows + ',' + cols + ':'
    for (var i = 0; i < buffer.getItem().length; i++) {
        if (i != 0) data += ','
        if (primitiveData[i] == "rgba(0, 0, 0, 0)") {
            data += '#00000000'
            continue
        }
        data += rgbToHex(buffer.getItem()[i])
    }
    return data
}

document.getElementById("export-raw-data").addEventListener("click", () => {
    let data = getCurrentDrawingData()
    downloadText(drawingName.value + '(pixmacr).spad', data)
})

function verifyAndProcessRawColorArray(rawArray, rows, cols) {
    if (rows * cols != rawArray.length) {
        if (!confirm("Missing Or Extra Data: Do you still want Apply?")) return false
    }
    let result = []
    for (var i = 0; i < rawArray.length; i++) {
        if (rawArray[i].replaceAll(" ", '') == "%rand") {
            result.push(getRandColor())
            continue
        }
        result.push(rawArray[i])
    }
    return result
}

saveToLocalStorage.addEventListener("click", () => {
    let currentDrawingName = prompt('Enter Name', drawingName.value || 'Untitled')
    if (!(currentDrawingName in drawings)) {
        drawingsSection.innerHTML += getDrawingHTML(currentDrawingName)
        addEventListenersToSavedDrawings()
    }
    drawings[currentDrawingName] = getCurrentDrawingData()
    saveDrawings()
    alert("Drawing Saved!")
})


function saveDrawings() {
    localStorage.setItem("drawings", JSON.stringify(drawings))
}


function getDrawingHTML(drawingName) {
    return `<div class="drawing">
                <p class="drawing-name">${drawingName}</p>
                <div class="drawing-icons-container">
                <img class="drawing-delete-icon" src="icons/delete.svg">
                <img class="drawing-apply-icon" src="icons/play.svg">
                <img class="drawing-download-icon" src="icons/download.svg">
                </div>
            </div>`
}


for (let drawingName in drawings) {
    // let currentParsedData = parseRawData(drawings[drawingName])
    // paintDataOnCanvas(ctx, canvas, currentParsedData.colorData, cellBorderWidthSlider.value, cellBorderColorSelector.value, currentParsedData.rows, currentParsedData.cols)
    // let img = canvasToImage(canvas)
    // img.width = 100
    // img.height = 100
    // document.querySelector("body").appendChild(img)
    drawingsSection.innerHTML += getDrawingHTML(drawingName)
}
addEventListenersToSavedDrawings()


function addEventListenersToSavedDrawings() {
    const drawingDeleteIcons = document.getElementsByClassName("drawing-delete-icon")
    const drawingApplyIcons = document.getElementsByClassName("drawing-apply-icon")
    const drawingNames = document.getElementsByClassName("drawing-name")
    const drawingElements = document.getElementsByClassName("drawing")
    const drawingDownloadIcons = document.getElementsByClassName("drawing-download-icon")

    for (let i = 0; i < drawingElements.length; i++) {
        let currentDrawingName = drawingNames[i].innerHTML
        drawingDeleteIcons[i].addEventListener("click", () => {
            if (confirm(`Do you really want to delete drawing "${currentDrawingName}"?`)) {
                delete drawings[currentDrawingName]
                drawingElements[i].style.display = "none"
            }
            saveDrawings()
        })
        drawingApplyIcons[i].addEventListener("click", () => {
            if(!confirm("Do you really want to apply data, you will loose your current artwork on canvas?")) return
            let data = parseRawData(drawings[currentDrawingName])
            addCanvas(data.rows, data.cols)
            canvasSizeShower.textContent = `(${data.cols})`
            cellsSlider.value = data.cols
            applyPaintData(data.colorData)
            buffer.clearStack()
            if (!borderCheckbox.checked) {
                removeBorder()
            }
            if (guideCheckbox.checked) {
                addGuides()
            }
            recordPaintData()
        })
        drawingDownloadIcons[i].addEventListener("click", () => {
            if (confirm("Do You Want To Download In Png Format? (Cancel To Download In Raw Data Format(spad))")) {
                let data = parseRawData(drawings[currentDrawingName])
                paintDataOnCanvas(ctx,
                    canvas,
                    data.colorData,
                    cellBorderWidthSlider.value,
                    cellBorderColorSelector.value,
                    data.rows,
                    data.cols
                )
                downloadCanvasAsImage(canvas, `${currentDrawingName}(pixmacr-saved).png`)
            } else {
                downloadText(currentDrawingName + "(saved-pixmacr).spad", drawings[currentDrawingName])
            }
        })
    }
}