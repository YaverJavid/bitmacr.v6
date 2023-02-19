if (!localStorage.getItem("bit_theme")) {
    localStorage.setItem("bit_theme", "#1a1b1d,#ffffff")
}

let currentTheme = localStorage.getItem("bit_theme").split(",")
setTheme(currentTheme[0],currentTheme[1])

function setTheme(accent, secondary){
    setSecondaryColor(secondary)
    setAccentColor(accent)
    changeCellBorderColor(secondary)
    localStorage.setItem("bit_theme",`${accent},${secondary}`)
}

document.getElementById("invert-theme").addEventListener("click",()=>{
    setTheme(getSecondaryColor(), getAccentColor())
})

for (let i = 0; i < themeSelectors.length; i++) {
    themeSelectors[i].addEventListener("click",()=>{
       setTheme(themeSelectors[i].dataset.accent, themeSelectors[i].dataset.secondary);
    })
}

borderColor = '#'+getSecondaryColor().slice(1)