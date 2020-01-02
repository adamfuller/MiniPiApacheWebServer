<?php
    include "../tools.php";

    $database = getInput(array("database", "db", "d"), NULL, TRUE);
    $user = getInput(array("user","u"), NULL, TRUE);
    $host = getInput(array("host", "url", "ip"), "localhost");
    $password = getInput(array("password","psk", "p"), NULL, TRUE);
    $table = getInput(array("table","t"), NULL, TRUE);
    $where = getInput(array("where","w"), NULL);
    $set = getInput(array("set","s"), NULL, TRUE);


    if (isset($_REQUEST['set']) && $_REQUEST['set'] != ''){
        $set = $_REQUEST['set'];
    }elseif (isset($_REQUEST['s']) && $_REQUEST['s'] != ''){
        $set = $_REQUEST['s'];
    } else{
        die("No set specified");
    }

    if (isset($_REQUEST['where']) && $_REQUEST['values'] != ''){
        $where = $_REQUEST['where'];
    }elseif (isset($_REQUEST['w']) && $_REQUEST['w'] != ''){
        $where = $_REQUEST['w'];
    }

    // Build base SQL query
    $sql = "UPDATE $table SET $set";

    // sql statement
    if (isset($where)){
        $sql = $sql . " WHERE $where";
    }

    // attempt to connect to database
    $db = new mysqli($url, $user, $password, $database);

    // ensure connection to MySQL
    if ($db->connect_errno > 0){
        die("Connection failed");
    }
    
    $result = $db->query($sql);

    // query sql statement
    if (!$result){
        echo $db->error;
    } elseif ($db->affected_rows > 0) {
        echo "true";
    } else {
        return "false";
    }

    //$statement->close();
    $db->close();
?>

