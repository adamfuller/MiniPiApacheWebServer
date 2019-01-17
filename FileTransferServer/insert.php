<?php
    // database settings
    // table open for any traffic/transfers
    var_dump($_REQUEST);

    if (isset($_REQUEST['table']) && $_REQUEST['table'] != ''){
        $table = str_replace(".", "_", $_REQUEST['table']);
    } elseif (isset($_REQUEST['ex_ip']) && $_REQUEST['ex_ip'] != ''){
        $table = str_replace(".", "_", $_REQUEST['ex_ip']);
    } else{
        $table = "open";
    }

    if (isset($_REQUEST['username'])){
        $username = $_REQUEST['username'];
    } else{
        die("No username");
    }

    if (isset($_REQUEST['ip'])){
        $ip = str_replace(".", "_", $_REQUEST['ip']);
    } else{
        die("No ip");
    }

    if (isset($_REQUEST['active'])){
        $active = intval($_REQUEST['active']);
    } else{
        die("No active");
    }

    $mask = intval($_REQUEST['mask']) ?? 0;

    // sql statement
    $sql = "INSERT INTO $table (username, ip, active, mask) VALUES (".$username.", ".$ip.", ".$active.", ".$mask.")";

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }


    $statement = $db->prepare("INSERT INTO ".$table." (username, ip, active, mask) VALUES (?, ?, ?, ?)");
    $statement->bind_param("ssii", $username, $ip, $active, $mask);
    
    $result = $statement->execute();

    // query sql statement
    if ($result){
        echo "success";
    } else {
        echo $db->error;
    }
    
    $db->close();
?>

