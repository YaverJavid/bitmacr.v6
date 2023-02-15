document.addEventListener("keydown", function(event) {
    if (event.ctrlKey) {
        event.preventDefault()
        for (let i = 0; i < menuNav.children.length; i++) {
            if(menuNav.children[i].dataset.shortcutkey == undefined) continue
            if (event.key == menuNav.children[i].dataset.shortcutkey) {
                redirectMenuViewTo(menuSegmentLocations[i])
                break
            }

        }
        if (event.key == 'p') {
            paintMode.checked = !paintMode.checked
        }else if(event.key == 'u'){
            if (buffer.setPointer(buffer.pointer - 1))
                applyPaintData(buffer.getItem())
        }else if(event.key == 'i'){
            if (buffer.setPointer(buffer.pointer + 1))
                applyPaintData(buffer.getItem())
        }
    }
});