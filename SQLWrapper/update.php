<?php

    $json_str = file_get_contents('php://input');
    if ($json_str == null) die("No json input");
    $json = json_decode($json_str);
    if ($json == null) die("Couldn't decode json");

    $table = $json->{table};
    $database = $json->{database};
    $user = $json->{user};
    $password = $json->{password};
    $location = $json->{location};
    $data = $json->{data}; // Data to be uploaded; keys should be the columns
    $conditions = $json->{conditions}; // Conditions to be met to replace row

    $set = "";
    $where = "";

    // Parse each key and value into the columns and values strings
    foreach ($data as $key => $value){
        $set .= "$key = $value,";
    }

    if ($conditions !== null){
        foreach ($conditions as $key => $value){
            $where .= "$key = $value,";
        }
        rtrim($where, ',');
    }

    // Remove last , since it will be extra
    rtrim($set, ',');

    if ($conditions !== null){
        $sql = "UPDATE $table SET $set WHERE $where";
    } else {
        $sql = "UPDATE $table SET $set";
    }

    if (!isset($sql)) die ("Failed to parse query from JSON");
    
    // attempt to connect to database
    $db = new mysqli($location, $user, $password, $database);

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }
    
    $result = $db->query($sql);

    // query sql statement
    if (!$result){
        echo $db->error;
    } elseif ($db->affected_rows > 0) {
        echo "true";
    } else {
        return "false";
    }

    //$statement->close();
    $db->close();
?>

