<?php 

/**
 * @param array/string $names possible names of input to retrieve
 * @param any $default value returned if input isn't present
 * @return any value retrieved from $_REQUEST[$name]
 */
function getInput($names, $default = NULL, $dieOnFail = FALSE){
    $names = is_array($names) ? $names : array($names);

    foreach($names as $name){
        if (isset($_REQUEST[$name])){
            return $_REQUEST[$name];
        }
    }

    if ($dieOnFail){
        die("Failed to get: " . $names[0]);
    }

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
?>