let hue = 0

function updateHueShower() {
    hueAngleShower.innerHTML = `(${hueAngle.value}&deg;)`
}

let psedoElementForColorConversion = document.getElementById("psedo")

function cssToRGBAOrRgb(color) {
    psedoElementForColorConversion.style.background = color
    return window.getComputedStyle(
        psedoElementForColorConversion, true
    ).getPropertyValue("background-color")
}

function getCurrentSelectedColor() {
    if (colorModeSelector.value == "random")
        color = rgbToHex(getRandColor())
    else if (colorModeSelector.value == "hue") {
        let currentHue;
        hue += parseFloat(hueSpeedSlider.value)
        let decimalPart = hue - Math.floor(hue)
        currentHue = (hue % 360) + decimalPart
        hueAngle.value = currentHue
        updateHueShower()
        color = hslToHex(`hsl(${currentHue},${saturationSlider.value}%,${lightingSlider.value}%)`)
    }
    else if (colorModeSelector.value == "eraser")
        color = '#00000000'
    else if (colorModeSelector.value == "css-color")
        color = rgbToHex(cssToRGBAOrRgb(colorStringInput.value));
    else if (colorModeSelector.value == "random-pallatte") {
        let colorsArray;
        if (onlyFromDefaultPallatte.checked)
            colorsArray = defaultPalletteColors
        else if (onlyFromNonDefaultPallatte.checked)
            colorsArray = usedColors.filter(n => !defaultPalletteColors.includes(n))
        else colorsArray = usedColors
        color = colorsArray[Math.floor(Math.random() * colorsArray.length)]
    } else
        color = currentSelectedColor
    return slightVariationsCheckbox.checked ? slightlyDifferentColor(color) : color
}

hueSpeedSlider.addEventListener("input", () => {
    hueSpeedShower.innerHTML = `(${hueSpeedSlider.value}&deg;)`
})

lightingSlider.addEventListener("input", () => {
    lightingShower.innerHTML = `(${lightingSlider.value}%)`
})

saturationSlider.addEventListener("input", () => {
    saturationShower.innerHTML = `(${saturationSlider.value}%)`
})

colorVariationThSlider.addEventListener("input", () => {
    colorVariationThShower.innerHTML = `(${colorVariationThSlider.value})`
})

hueAngle.addEventListener("input", () => {
    updateHueShower()
    hue = parseFloat(hueAngle.value)
})

function slightlyDifferentColor(hexColor, th = 24) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const rVariation = Math.floor(Math.random() * (th + 1)) - th / 2;
    const gVariation = Math.floor(Math.random() * (th + 1)) - th / 2;
    const bVariation = Math.floor(Math.random() * (th + 1)) - th / 2;
    const newR = Math.min(Math.max(r + rVariation, 0), 255);
    const newG = Math.min(Math.max(g + gVariation, 0), 255);
    const newB = Math.min(Math.max(b + bVariation, 0), 255);
    const newHexColor = '#' + ((1 << 24) + (Math.floor(newR) << 16) + (Math.floor(newG) << 8) + Math.floor(newB)).toString(16).slice(1);
    const opacity = hexColor.length === 9 ? hexColor.substring(7, 9) : null;
    return opacity ? newHexColor + opacity : newHexColor;
}

function setCellColor(cellElem, color) {
    let currentColor = window.getComputedStyle(cellElem).getPropertyValue('background-color')
    let dontFillIfColorIs = cssToRGBAOrRgb(fillOnlyThisColor.value)
    if (onlyFillTransaprent.checked && currentColor != dontFillIfColorIs) return
    cellElem.style.background = color
}


onlyFromDefaultPallatte.onclick = () => {
    if (onlyFromDefaultPallatte.checked) {
        onlyFromNonDefaultPallatte.checked = false
    }
}

onlyFromNonDefaultPallatte.onclick = () => {
    if (onlyFromNonDefaultPallatte.checked) {
        onlyFromDefaultPallatte.checked = false
    }
}