<?php
    /*
        get input variable demo
        if (isset($_REQUEST['variableName'])){
            $variableName = $_REQUEST['variableName'];
        
        }
    */

    // database settings
    // table open for any traffic/transfers
    if (isset($_REQUEST['table']) && $_REQUEST['table'] != ''){
        $table = $_REQUEST['table'];
    } elseif (isset($_REQUEST['ex_ip']) && $_REQUEST['ex_ip'] != ''){
        $table = $_REQUEST['ex_ip'];
    } else{
        $table = "open";
    }

    // get any special modifications to the request
    if (isset($_REQUEST['mods'])){
        $mods = $_REQUEST['mods'];
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

    mysqli_close($db);
?>