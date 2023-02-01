if (!localStorage.getItem("bit_theme")) {
    localStorage.setItem("bit_theme", "#1a1b1d,#ffffff")
}

let currentTheme = localStorage.getItem("bit_theme").split(",")
setTheme(currentTheme[0],currentTheme[1])

document.getElementById("light-theme").addEventListener("click",()=>{
    setTheme("white", "#1a1b1d")
})

document.getElementById("dark-theme").addEventListener("click", () => {
    setTheme("#1a1b1d", "white")
})

document.getElementById("orlue-theme").addEventListener("click", () => {
    setTheme("orange","blue")
})

function setTheme(accent, secondary){
    setSecondaryColor(secondary)
    setAccentColor(accent)
    changeCellBorderColor(secondary)
    localStorage.setItem("bit_theme",`${accent},${secondary}`)
}

document.getElementById("invert-theme").addEventListener("click",()=>{
    setTheme(getSecondaryColor(), getAccentColor())
})