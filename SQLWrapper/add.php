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
    $data = $json->{"data"}; // Data to be uploaded; keys should be the columns

    $columns = "";
    $values = "";

    // Parse each key and value into the columns and values strings
    foreach ($json as $key => $value){
        $columns .= $key;
        $columns .= ",";

        $values .= $value;
        $values .= ",";
    }

    // Remove last , since it will be extra
    rtrim($columns, ',');
    rtrim($values, ',');

    // SQL statement
    $sql = "INSERT INTO $table ($columns) VALUES ($values)";

    // Attempt to connect to database
    $db = new mysqli($url, $user, $password, $database);

    // Ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }
    
    $result = $db->query($sql);

    // Query sql statement
    if (!$result){
        echo $db->error;
    } elseif ($db->affected_rows > 0) {
        echo "true";
    } else {
        echo "false";
    }

    $db->close();
?>

