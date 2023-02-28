function drawCircle(centerX, centerY, radius, grid, filled = false) {
    // Iterate through each cell of the grid
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // Calculate the distance between the current cell and the center of the circle
            const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);

            // Check if the current cell is within the circle
            if (distance <= radius) {
                // If the circle is filled or if the current cell lies on the circumference
                if (filled || Math.abs(distance - radius) < 1) {
                    grid[i][j].style.backgroundColor = getCurrentSelectedColor();
                }
            }
        }
    }
}

function drawSphere(centerX, centerY, radius, grid) {

    let filled = true
    // Iterate through each cell of the grid
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // Calculate the distance between the current cell and the center of the circle
            const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);

            // Check if the current cell is within the circle
            if (distance <= radius) {
                // If the circle is filled or if the current cell lies on the circumference
                if (filled || Math.abs(distance - radius) < 1) {
                    grid[i][j].style.backgroundColor = brightenHexColor(getCurrentSelectedColor(), radius / distance - 0.95)
                }
            }
        }
    }
}


function drawRectangeOnPlane(x, y, w, h, plane, filled) {
    // filled = !0
    y += 1
    for (var i = (y - h); i < y; i++) {
        for (let j = x; j < (x + w); j++) {
            try {
                if (filled || j == x || j == (x + w - 1) || i == (y - h) || i == (y - 1))
                    plane[i][j].style.backgroundColor = getCurrentSelectedColor()
            } catch {

            }
        }
    }
}


let currentCell;

let startingCoords = {}
paintZone.addEventListener('touchstart', (event) => {
    if (["none", "stroke"].includes(paintModeSelector.value)) return
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
    if (["circle", "filled-circle", "sphere", "rect", "rect-filled"].includes(paintModeSelector.value)) {
        let paintCells2d = []
        for (let i = 0; i < paintCells.length; i++) {
            paintCells[i].style.background = buffer.getItem()[i]
            paintCells2d.push(paintCells[i])
        }
        paintCells2d = squareArray(paintCells2d)
        event.preventDefault()
        const cw = 350 / cols
        let dx = Math.ceil(Math.abs(startingCoords.x - x) / cw)
        let dy = Math.ceil(Math.abs(startingCoords.y - y) / cw)
        const radius = dx
        // gridX is gridY and vice versa in reality
        
        switch (paintModeSelector.value) {
            case 'circle':
                drawCircle(startingCoords.gridX - radius, startingCoords.gridY + radius, radius, paintCells2d, false)
                break
            case 'circle-filled':
                drawCircle(startingCoords.gridX - radius, startingCoords.gridY + radius, radius, paintCells2d, true)
                break
            case 'sphere':
                drawSphere(startingCoords.gridX - radius, startingCoords.gridY + radius, radius, paintCells2d)
                break
            case 'rect':
                drawRectangeOnPlane(startingCoords.gridY, startingCoords.gridX, dx, dy, paintCells2d, false)
                break
            case 'rect-filled':
                drawRectangeOnPlane(startingCoords.gridY, startingCoords.gridX, dx, dy, paintCells2d, true)
                break
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