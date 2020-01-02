<?php

    $json_str = file_get_contents('php://input');
    if ($json_str == null) die("No json input");
    $json = json_decode($json_str);
    if ($json == null) die("Couldn't decode json");

    $table = $json->{"table"};
    $database = $json->{"database"};
    $user = $json->{"user"};
    $password = $json->{"password"};
    $location = $json->{"location"};

    $sql = "SHOW COLUMNS FROM $table FROM $database";

    // attempt to connect to database
    $db = new mysqli($location, $user, $password, $database);

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }

    // query sql statement
    $result = $db->query($sql);
    $rows = array();
    while ($r = mysqli_fetch_assoc($result)){
        $rows['query_results'][] = $r;
    }
    echo json_encode($rows);

    $db->close();
?>