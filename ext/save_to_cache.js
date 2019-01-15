function save(title, value, location) {
    if (location.toLowerCase() === "cache"){
        localStorage.setItem(title, value)
    } else if (location.toLowerCase() === "session"){
        sessionStorage.setItem(title, value)
    }  
};

function pull(title, location){
    if (location.toLowerCase() === "cache"){
        return localStorage[title];
    } else if (location.toLowerCase() === "session"){
        return sessionStorage[title];
    }
}