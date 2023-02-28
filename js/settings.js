
const shortcutInfos = document.querySelectorAll(".shortcut-info")

function changeShortcutInfoVisibility(mode){
    for (let i = 0; i < shortcutInfos.length; i++){
        shortcutInfos[i].style.display = mode
    }
}

setUpLocalStorageBucket("pixmacr_shortcut_info_visible", "1")

execBucket("pixmacr_shortcut_info_visible", "0", ()=>{
    document.getElementById("shortcut-info-checkbox").checked = false
    changeShortcutInfoVisibility("none")
})


document.getElementById("shortcut-info-checkbox").addEventListener("change", function (){
    changeShortcutInfoVisibility(this.checked ? "initial" : "none")
    setBucketOnCondition("pixmacr_shortcut_info_visible", this.checked, "1", "0")
})


// Default Pallatte Visibility 
const defaultPallettes = document.getElementsByClassName("default-pallette")

function changeDefaultPalletteVisibility(mode){
    for (let i = 0; i < defaultPallettes.length; i++)
      defaultPallettes[i].style.display = mode
}

setUpLocalStorageBucket("pixmacr_hide_default_pallette", "0")

execBucket("pixmacr_hide_default_pallette", "1", ()=>{
    document.getElementById("hide-default-pallette-checkbox").checked = true
    changeDefaultPalletteVisibility("none")
})

document.getElementById("hide-default-pallette-checkbox").addEventListener("input",function(){
    changeDefaultPalletteVisibility(this.checked ? "none" : "initial")
    setBucketOnCondition("pixmacr_hide_default_pallette", this.checked, "1", "0")
})

// Animate Menu 

setUpLocalStorageBucket("pixmacr_animate_menu", "1")

execBucket("pixmacr_animate_menu", "0", ()=>{
    bottomControlsContainer.style.scrollBehavior = "auto"
    document.getElementById("animate-menu-checkbox").checked = false
})

document.getElementById("animate-menu-checkbox").addEventListener("input",function(){
    setBucketOnCondition("pixmacr_animate_menu", this.checked, "1", "0")
    bottomControlsContainer.style.scrollBehavior = this.checked ? "smooth" : "auto"
})


// Background

const randomBackgroundURL = "https://source.unsplash.com/random/?wallpaper/"
let imageTracker = 0

function getImageURL(increment=true) {
    if(increment) imageTracker++
    return `url("https://source.unsplash.com/random/200x200?sig=${imageTracker}")`
}

setUpLocalStorageBucket("pixmacr_background_image", "0")

execBucket("pixmacr_background_image","1", ()=>{
    document.body.style.backgroundImage = getImageURL(false)
    document.getElementById("add-image-background-checkbox").checked = true
})


document.getElementById("add-image-background-checkbox").addEventListener("input", function(){
    setBucketOnCondition("pixmacr_background_image", this.checked, "1", "0")
    document.body.style.backgroundImage = this.checked ? getImageURL() : "none"
})

document.getElementById("change-background-image").addEventListener("click", ()=>{
    document.getElementById("add-image-background-checkbox").checked = true
    localStorage.setItem("pixmacr_background_image", "1")
    document.body.style.backgroundImage = getImageURL()
})