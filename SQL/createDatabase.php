<?php
// No database selected
include "../tools.php";

// database settings
    // table open for any traffic/transfers

    $database = getInput(array("database", "db", "d"), NULL);
    $user = getInput(array("user","u"), NULL);
    $host = getInput(array("host", "url", "ip"), "localhost");
    $password = getInput(array("password","psk", "p"), die("No password specified"));

    // sql statement
    $sql = "CREATE DATABASE $database";

    // attempt to connect to database
    $db = new mysqli($host, $user, $password);
    
    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }
    
    $result = $db->query($sql);

    // query sql statement
    if ($result){
        echo "true";
    } else {
        echo $db->error;
    }
    
    $db->close();

?>