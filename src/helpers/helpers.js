const generateRandomString = (len = 100) => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let length = chars.length;
    let random = "";
    for(let i = 0; i < len; i++){
        let posn = Math.floor(Math.random() * (length-1)) // 62.0 => 62
        random += chars[posn]
    }
    return random
}


module.exports = {
    generateRandomString
}