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
        die("No username");
    }

    if (isset($_REQUEST['ip'])){
        $ip = $_REQUEST['ip'];
    } else{
        die("No ip");
    }

    if (isset($_REQUEST['active'])){
        $active = $_REQUEST['active'];
    } else{
        die("No active");
    }

    $mask = $_REQUEST['mask'] ?? "0";

    // sql statement
    $sql = "INSERT INTO ".$table." (username, ip, active, mask) VALUES (".$username.", ".$ip.", ".$active.", ".$mask.")";

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }

    // query sql statement
    $result = $db->query($sql);
    
    mysqli_close($db);
    echo $result;
?>

