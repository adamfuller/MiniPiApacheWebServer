<?php 

$json_str = file_get_contents('php://input');
$json_input = NULL;
if ($json_str != NULL) $json_input = json_decode($json_str);

/**
 * @param array/string $names possible names of input to retrieve
 * @param any $default value returned if input isn't present
 * @return any value retrieved from $_REQUEST[$name] or attached JSON
 */
function getInput($names, $default = NULL, $dieOnFail = FALSE){
    $names = is_array($names) ? $names : array($names);

    // Check to see if any of the names are present
    foreach($names as $name){
        if (isset($_REQUEST[$name])){
            return $_REQUEST[$name];
        }
    }

    // If we are supposed to die with failures and don't have the json input
    // then die.
    if ($dieOnFail && !isset($json_input)){
        die("Failed to get: " . $names[0]);
    }

    // Check the json input if present and return it
    $json_value = getJsonInput($names, $default, $dieOnFail);
    if (isset($json_value)) return $json_value;

    return $default;
}

function getJsonInput($names, $default = NULL, $dieOnFail = FALSE){
    global $json_str;
    global $json_input;

    if ($json_str == NULL){
        if ($dieOnFail) die("No JSON input");
        return $default;
    }

    if ($json_input == NULL){
        if ($dieOnFail) die("Couldn't decode JSON");
        return $default;
    } 

    foreach($names as $name){
        if (isset($json_input->{$name})){
            return $json_input->{$name};
        }
    }

    if ($dieOnFail) die("Could not find input labeled: " . $names[0]);

    return $default;
}

/**
 * Convert an array of keys and an array of values
 * into a JSON string
 * 
 * @param array $keys keys for the key-value pairs in json
 * @param array $values values for the key-value pairs in json
 * @return string JSON string with keys and values
 */
function jsonify($keys, $values){
    $output = array();

    if (count($keys) != count($values)){
        return NULL;
    }

    for ($i = 0; $i < count($keys); $i++){
        $output[$keys[$i]] = $values[$i];
    }

    return json_encode($output);
}
