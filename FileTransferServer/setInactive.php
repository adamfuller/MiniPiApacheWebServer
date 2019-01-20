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

    // sql statement
    $sql = "UPDATE $table SET active = ?, mask = (mask & ~1) WHERE (username = ?) AND (ip = ?)";

    // attempt to connect to database
    $db = new mysqli("localhost", "root", "JqFl8497__GcZ-P", "FileTransferServer");
    

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }

    $statement = $db->prepare($sql);
    $statement->bind_param("iss", $active, $username, $ip);
    
    $result = $statement->execute();

    // query sql statement
    if (!$result){
        if (strpos($db->error, 'exist')){ // if the table doesn't exist error is thrown
            // create the table
            exec('wget localhost/FileTransferServer/create.php?ex_ip=$table');
            $result = $db->query($sql);
        }
        // echo $db->error;
    } elseif ($db->affected_rows > 0) {
        echo "success";
    } else {
        return "failure";
    }
    
    $statement->close();
    $db->close();
    
?>