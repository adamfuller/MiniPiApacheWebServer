<?php
    $json_str = file_get_contents('php://input');
    if ($json_str == null) die("No json input");
    echo ("input : $json_str\n");
    $json = json_decode($json_str);
    if ($json === null) die("Couldn't decode json");

    foreach ($json as $key => $value){
        echo ("$key: $value\n");
    }

?>