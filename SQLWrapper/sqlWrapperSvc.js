
/**
 * Get a list of all keys in a json
 * @param {JSON} json JSON object to get keys of
 * 
 * @return {Array<string>} array of keys in __json__
 */
function getKeys(json){
    if (!!!json) return null;
    let keys = [];
    for (key in json){
        keys.push(key);
    }
    return keys;
}
function test(){
    let json = {"hello": "test"};
    let str_json = JSON.stringify(json);
    let request = new XMLHttpRequest();

    request.onload = (data) => {
        console.log(data.message);
    }

    request.open("GET", "http://www.justanotherpi.com/SQL/help.php", true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(str_json);
}
test();