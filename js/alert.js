const alertMessage = document.getElementById("alert-message")
const alertHeading = document.getElementById("alert-heading")
const alertBox = document.getElementById("alert")
let nothing = () => {}

var cancel = nothing
var ok = nothing
var then = nothing
var hasAlertAnswered = true
function customConfirm(message, ifOk = nothing, ifCancel = nothing, argThen = nothing ) {
    alertBox.style.opacity = "1"
    alertBox.style.zIndex = "2"
    alertMessage.textContent = message
    cancel = ifCancel
    ok = ifOk
    if(!hasAlertAnswered) then()
    hasAlertAnswered = false
    then = argThen
}

function hideAlert() {
    alertBox.style.opacity = "0"
    alertBox.style.zIndex = "-3"
}

function cancelAlert() {
    hasAlertAnswered = true
    hideAlert()
    cancel()
    then()
}

function okAlert() {
    hasAlertAnswered = true
    hideAlert()
    ok()
    then()
}

