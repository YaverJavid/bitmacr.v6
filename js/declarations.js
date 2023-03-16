const paintCells = document.getElementsByClassName("cell")
const cellsSlider = document.getElementById('cells-slider')
const paintZone = document.getElementById('paint-zone')
const colorSelector = document.getElementById('color-selector')
const canvasSizeShower = document.getElementById("canvas-size-shower")
const eraseButton = document.getElementById("erase-selector-button")
const guideCheckbox = document.getElementById("guide-checkbox")
const guideCheckbox2 = document.getElementById("guide-checkbox2")
const borderCheckbox = document.getElementById("border-checkbox")
const cellBorderWidthSlider = document.getElementById("cell-border-width-slider")
const cellBorderWidthShower = document.getElementById("cell-border-width-shower")
const multiplyQButton = document.getElementById("multiply-q-button")
const selectAllCopyTargets = document.getElementById("select-all-copy-targets")
const multiplyQSelector = document.getElementById("multiply-q-selector")
const copyTargetsShower = document.getElementById("copy-targets-shower")
const randomiseCellsButton = document.getElementById("randomise-cells-button")
const randomColorSelectorButton = document.getElementById("random-color-selector-button")
const colorToBeReplacedSelector = document.getElementById("color-to-be-replaced-selector")
const colorToReplaceWithSelector = document.getElementById("color-to-replace-with-selector")
const replaceButton = document.getElementById("replace-button")
const thresholdShower = document.getElementById("threshold-shower")
const colorMatchThresholdSlider = document.getElementById("color-match-threshold-range")
const root = document.querySelector(":root")
const controlWidth = parseFloat(getComputedStyle(document.getElementsByClassName("controls")[1]).getPropertyValue("width"))
const bottomControls = document.getElementById("bottom-control-container")
const menuNav = document.getElementById("menu-nav")
const menus = bottomControls.children
const cellBorderColorSelector = document.getElementById("cell-border-color-selector")
const multiplyTargetCheckboxes = {
    q1MultiplyTargetCheckbox: document.getElementById("q1-multiply-target-checkbox"),
    q2MultiplyTargetCheckbox: document.getElementById("q2-multiply-target-checkbox"),
    q3MultiplyTargetCheckbox: document.getElementById("q3-multiply-target-checkbox"),
    q4MultiplyTargetCheckbox: document.getElementById("q4-multiply-target-checkbox"),
}

const guideCellBorderColor = document.getElementById("guide-cell-border-color")
const drawingName = document.getElementById("drawing-name")
const saveToLocalStorage = document.getElementById("save-to-ls")
const drawingsSection = document.getElementById("drawings-section")
const colsPainter = document.getElementById("cols-painter")
const rowsPainter = document.getElementById("rows-painter")
const themeSelectors = document.getElementsByClassName("theme-selector")
const paintMode = document.getElementById("paint-mode")
const topImage = document.getElementById("top-image")
const pallateContainer = document.getElementById("pallate-container")
const copiedColorShower = document.getElementById("copied-color-shower")
const drawingCheckerSection = document.getElementById("drawing-checker-section")
const paintModeSelector = document.getElementById("paint-mode-selector")
const clickModeSelector = document.getElementById("click-mode-selector")


const colorCopierCheckboxes = {
    colorSelectCheckbox: document.getElementById("select-color"),
    selectColorForFind: document.getElementById("select-color-for-find"),
    selectColorForReplacer: document.getElementById("select-color-for-replacer"),
    copyColorFromCellCheckbox: document.getElementById("copy-color-from-cell-checkbox")
}

const bottomControlsContainer = document.getElementById("bottom-control-container")

const cellBorderOnTransparentCellsCheckbox = document.getElementById("cell-border-on-transparent-cells-checkbox")
const themesSection = document.getElementById("themes-section")
const lineInfoShower = document.getElementById('line-info-shower')
const paintModeInfoShower = document.getElementById("paint-mode-info-shower")
const colorModeSelector = document.getElementById("color-mode-selector")
const colorModeShower = document.getElementById("color-mode-shower")
const onlyFillTransaprent = document.getElementById("only-fill-transaprent")