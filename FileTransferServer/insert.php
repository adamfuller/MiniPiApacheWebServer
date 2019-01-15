<?php
    // database settings
    if (isset($_GET['table']) && $_GET['table'] != ''){
        $table = $_GET['table'];
    }else{
        $table = "open";
    }

    //$table = "testTable5";

    // sql statement
    $labels = $_GET["s"];
    $key = $_GET["k"];
    $sql = "INSERT INTO ".$table." (".$labels.") VALUES (".$key.")";

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }

    // query sql statement
    $result = $db->query($sql);
    
    mysqli_close($db);
?>