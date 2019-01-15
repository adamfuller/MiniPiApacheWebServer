<?php
    // database settings
    // table open for any traffic/transfers
    if (isset($_GET['table']) && $_GET['table'] != ''){
        $table = $_GET['table'];
    } elseif (isset($_GET['ex_ip']) && $_GET['ex_ip'] != ''){
        $table = $_GET['ex_ip'];
    } else {
        $table = "open";
    }


    // sql statement
    $labels = $_GET["s"];
    $key = $_GET["k"];
    $sql = "UPDATE ".$table." SET ".$labels." WHERE ".$key;

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }

    // query sql statement
    $result = $db->query($sql);
    
?>