<?php 

$tz = getInput("timezone") ?? getInput("tz") ?? "CST";

date_default_timezone_set($tz); 
$date = date('Y/m/d/h:i_a', time());
echo jsonify(array("datetime", "timezone"), array($date, $tz));


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