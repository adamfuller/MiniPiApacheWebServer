<?php
    // database settings
    // table open for any traffic/transfers
    if (isset($_REQUEST['table']) && $_REQUEST['table'] != ''){
        $table = $_REQUEST['table'];
    } elseif (isset($_REQUEST['ex_ip']) && $_REQUEST['ex_ip'] != ''){
        $table = $_REQUEST['ex_ip'];
    } else{
        $table = "open";
    }

    if (isset($_REQUEST['username'])){
        $username = $_REQUEST['username'];
    } else{
        $username = "sample_username";
    }

    if (isset($_REQUEST['ip'])){
        $ip = $_REQUEST['ip'];
    } else{
        $ip = "172.24.5.68";
    }

    // sql statement
    $sql = "DELETE FROM $table WHERE username = '$username' AND ip = '$ip'";
    echo $sql;

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");
    

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }
    
    $result = $db->query($sql);

    // query sql statement
    if ($result){
        echo "Succes";
    } else {
        echo $db->error;
    }
    
    $db->close();
    
?>
