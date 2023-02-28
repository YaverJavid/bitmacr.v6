if (!localStorage.getItem("bit_theme")) {
    localStorage.setItem("bit_theme", "#1a1b1d,#ffffff")
}

let currentTheme = localStorage.getItem("bit_theme").split(",")
setTheme(currentTheme[0], currentTheme[1])

function setTheme(accent, secondary) {
    setSecondaryColor(secondary)
    setAccentColor(accent)
    changeCellBorderColor(secondary)
    localStorage.setItem("bit_theme", `${accent},${secondary}`)
}


borderColor = '#' + getSecondaryColor().slice(1)

class Theme {
    constructor(accent, secondary, name) {
        this.accent = accent,
            this.secondary = secondary,
            this.name = name,
            this.htmlString = Theme.getThemeButtonHTML(accent, secondary, name)
    }
    static getThemeButtonHTML(accent, secondary, name) {
        return `<input type="button" class="theme-selector" data-accent="${accent}" data-secondary="${secondary}" value="${name}"/>`
    }
}

let themes = [
    new Theme("#1a1b1d", "#ffffff", "Dark Theme"),
    new Theme("#ffffff", "#1a1b1d", "Light Theme"),
    new Theme("#5858F9", "#ffffff", "Bluey"),
    new Theme("#1a1b1d", "#32CD32", "Dark Lime"),
    new Theme("#2E86C1", "#F5B041", "Blue Gold"),
    new Theme("#E74C3C", "#F9E79F", "Red Yellow"),
    new Theme("#8E44AD", "#F1C40F", "Purple Yellow"),
    new Theme("#1ABC9C", "#ffffff", "Turquoise Whité"),
    new Theme("#3498DB", "#F5CBA7", "Blue Peach"),
    new Theme("#27AE60", "#FFC300", "Green Yellow"),
    new Theme("#D35400", "#F0E68C", "Orange Khaki"),
    new Theme("#2C3E50", "#FAD7A0", "Navy Peach"),
    new Theme("#2C3E50", "#ffffff", "Navy White")
]

for (var i = 0; i < themes.length; i++) {
    themesSection.innerHTML += themes[i].htmlString
}

for (let i = 0; i < themeSelectors.length; i++) {
    themeSelectors[i].addEventListener("click", () => {
        setTheme(themeSelectors[i].dataset.accent, themeSelectors[i].dataset.secondary);
    })
}

document.getElementById("invert-theme").addEventListener("click", () => {
    setTheme(getSecondaryColor(), getAccentColor())
})
