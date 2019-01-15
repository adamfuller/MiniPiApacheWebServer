<?php
    /*
        get input variable demo
        if (isset($_GET['variableName'])){
            $variableName = $_GET['variableName'];
        
        }
    */

    // database settings
    if (isset($_GET['table']) && $_GET['table'] != ''){
        $table = $_GET['table'];
    }else{
        $table = "open";
    }

    // get any special modifications to the request
    if (isset($_GET['mods']) && $_GET['mods'] != ''){
        $mods = $_GET['mods'];
    }else{
        $mods = "";
    }

    // sql statement
    $sql = "SELECT * from ". $table . $mods;

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");

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
    
?>