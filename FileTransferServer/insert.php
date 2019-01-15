<?php
    // database settings
    // table open for any traffic/transfers
    if (isset($_GET['table']) && $_GET['table'] != ''){
        $table = $_GET['table'];
    } elseif (isset($_GET['ex_ip']) && $_GET['ex_ip'] != ''){
        $table = $_GET['ex_ip'];
    } else{
        $table = "open";
    }

    if (isset($_GET['username'])){
        $username = $_GET['username'];
    } else{
        die("No username");
    }

    if (isset($_GET['ip'])){
        $ip = $_GET['ip'];
    } else{
        die("No ip");
    }

    if (isset($_GET['active'])){
        $active = $_GET['active'];
    } else{
        die("No active");
    }

    $mask = $_GET['mask'] ?? "0";

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
    echo "success";
?>