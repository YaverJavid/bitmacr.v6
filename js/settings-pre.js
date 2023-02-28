setUpLocalStorageBucket("pixmacr_top_logo_visible", '0')

execBucket("pixmacr_top_logo_visible", "0", ()=>{
    topImage.style.display = 'none'
    document.getElementById("advanced-remove-top-image-checkbox").checked = true
})

document.getElementById("advanced-remove-top-image-checkbox").addEventListener("change", function() {
    topImage.style.display = this.checked ? "none" : "initial"
    setBucketOnCondition("pixmacr_top_logo_visible", this.checked, "0", "1")
})
