<?php
    // database settings
    // table open for any traffic/transfers
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

    // mask is available but not necessary it is a byte to be used for 8 booleans on the row
    $mask = intval($_REQUEST['mask']) ?? 0;

    // sql statement
    $sql = "UPDATE $table SET active = $active, mask = $mask WHERE (username = '$username') AND (ip = '$ip')";

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");
    

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }

    //$statement = $db->prepare($sql);
    //$statement->bind_param("iiss", $active, $mask, $username, $ip);
    
    $result = $db->query($sql);

    // query sql statement
    if (!$result){
        echo $db->error;
    } elseif ($db->affected_rows > 0) {
        echo "success";
    } else {
        return "failure";
    }
    
    //$statement->close();
    $db->close();
    
?>