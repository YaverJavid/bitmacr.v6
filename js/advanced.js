if(!localStorage.getItem("pixmacr_top_logo_visible")) localStorage.setItem("pixmacr_top_logo_visible", "1")
if(localStorage.getItem("pixmacr_top_logo_visible") == "0"){
    topImage.style.display = 'none'
    document.getElementById("advanced-remove-top-image-checkbox").checked = true
}
document.getElementById("advanced-remove-top-image-checkbox").addEventListener("change", function() {
    topImage.style.display = this.checked ? "none" : "initial"
    if(this.checked) localStorage.setItem("pixmacr_top_logo_visible", "0") 
    else localStorage.setItem("pixmacr_top_logo_visible", "1") 
})

