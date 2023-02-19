
const shortcutInfos = document.getElementsByClassName("shortcut-info")

function changeShortcutInfoVisibility(mode){
    for (let i = 0; i < shortcutInfos.length; i++) {
        shortcutInfos[i].style.display = mode
    }
}

if(!localStorage.getItem("pixmacr_shortcut_info_visible")) localStorage.setItem("pixmacr_shortcut_info_visible", "1")
if(localStorage.getItem("pixmacr_shortcut_info_visible") == "0"){
    document.getElementById("shortcut-info-checkbox").checked = false
     changeShortcutInfoVisibility("none")

}
document.getElementById("shortcut-info-checkbox").addEventListener("change", function (){
    if(this.checked){
      changeShortcutInfoVisibility("initial")
      localStorage.setItem("pixmacr_shortcut_info_visible", "1")
      return
    }
    changeShortcutInfoVisibility("none")
    localStorage.setItem("pixmacr_shortcut_info_visible", "0")
})


// Default Pallatte Visibility 
const defaultPallettes = document.getElementsByClassName("default-pallette")

function changeDefaultPalletteVisibility(mode){
    for (let i = 0; i < defaultPallettes.length; i++)
      defaultPallettes[i].style.display = mode
}

if(!localStorage.getItem("pixmacr_hide_default_pallette")) localStorage.setItem("pixmacr_hide_default_pallette", "0")
if(localStorage.getItem("pixmacr_hide_default_pallette") == "1"){
    document.getElementById("hide-default-pallette-checkbox").checked = true
    changeDefaultPalletteVisibility("none")
}

document.getElementById("hide-default-pallette-checkbox").addEventListener("input",function(){
    if(this.checked){
        changeDefaultPalletteVisibility("none")
        localStorage.setItem("pixmacr_hide_default_pallette", "1")
        return 
    }
    changeDefaultPalletteVisibility("initial")
    localStorage.setItem("pixmacr_hide_default_pallette", "0")
})