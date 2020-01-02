<?php
    // database settings
    include "../tools.php";

    $database = getInput(array("database", "db", "d"), NULL, TRUE);
    $user = getInput(array("user","u"), NULL, TRUE);
    $host = getInput(array("host", "url", "ip"), "localhost");
    $password = getInput(array("password","psk", "p"), NULL, TRUE);
    $table = getInput(array("table","t"), NULL, TRUE);
    $specs = getInput(array("specs","s","columns","cols","col"), NULL, TRUE);

    // sql statement
    $sql = "CREATE TABLE $table ($specs)";

    // attempt to connect to database
    $db = new mysqli($url, $user, $password, $database);
    

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