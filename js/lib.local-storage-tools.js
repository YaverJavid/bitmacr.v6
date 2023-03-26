function setUpLocalStorageBucket(bucketName, value, setup = ()=>{}, ...setupArgs){
    if(localStorage.getItem(bucketName) != undefined) return
    localStorage.setItem(bucketName, value)
    return setup(...setupArgs)
}

function execBucket(bucketName, expectedValue, action, ...actionArgs){
    if(localStorage.getItem(bucketName) == expectedValue) action(...actionArgs)
    return localStorage.getItem(bucketName) == expectedValue
}

function setBucketOnCondition(bucketName, condition, valueIfTrue, valueIfFalse){
    let bucketValue = condition ? valueIfTrue : valueIfFalse
    localStorage.setItem(bucketName ,bucketValue)
    return bucketValue
}