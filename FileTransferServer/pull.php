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
        $table = str_replace(".", "_", $_REQUEST['table']);
    } elseif (isset($_REQUEST['ex_ip']) && $_REQUEST['ex_ip'] != ''){
        $table = str_replace(".", "_", $_REQUEST['ex_ip']);
    } else{
        $table = "open";
    }

    // sql statement
    $sql = "SELECT * from ". $table;

    // get any special modifications to the request
    if (isset($_REQUEST['username'])){
        $username = $_REQUEST['username'];
        $sql = $sql . " where username = '$username'";
    }

    // if (isset($_REQUEST['mask'])){
    //     $mask = $_REQUEST['mask'];
    //     $sql = $sql . " where mask = '$mask'";
    // }

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
        $r['ip'] = str_replace("_",".", $r['ip']);
        $rows['query_results'][] = $r;
    }
    echo json_encode($rows);

    $db->close();
?>
