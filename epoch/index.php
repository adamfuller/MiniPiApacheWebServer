<?php 

$tz = getInput("timezone") ?? getInput("tz") ?? "UTC";

date_default_timezone_set($tz); 
echo "$tz:".time();

function getInput($name){
    if (isset($_REQUEST[$name]) && $_REQUEST[$name] != ''){
        return $_REQUEST[$name];
    } else{
        return NULL;
    }
}


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