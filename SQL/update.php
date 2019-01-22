<?php

    if (isset($_REQUEST['table']) && $_REQUEST['table'] != ''){
        $table = $_REQUEST['table'];
    } elseif (isset($_REQUEST['t']) && $_REQUEST['t'] != ''){
        $table = $_REQUEST['t'];
    } else{
        die("No table specified");
    }

    if (isset($_REQUEST['database']) && $_REQUEST['database'] != ''){
        $database = $_REQUEST['database'];
    } elseif (isset($_REQUEST['d']) && $_REQUEST['d'] != ''){
        $database = $_REQUEST['d'];
    }elseif (isset($_REQUEST['db']) && $_REQUEST['db'] != ''){
        $database = $_REQUEST['db'];
    } else{
        die("No database specified");
    }

    if (isset($_REQUEST['url']) && $_REQUEST['url'] != ''){
        $url = $_REQUEST['url'];
    }elseif (isset($_REQUEST['URL']) && $_REQUEST['URL'] != ''){
        $url = $_REQUEST['URL'];
    } else{
        die("No url specified");
    }

    if (isset($_REQUEST['user']) && $_REQUEST['user'] != ''){
        $user = $_REQUEST['user'];
    }elseif (isset($_REQUEST['u']) && $_REQUEST['u'] != ''){
        $user = $_REQUEST['u'];
    } else{
        die("No user specified");
    }

    if (isset($_REQUEST['password']) && $_REQUEST['password'] != ''){
        $password = $_REQUEST['password'];
    }elseif (isset($_REQUEST['psk']) && $_REQUEST['psk'] != ''){
        $password = $_REQUEST['psk'];
    } elseif (isset($_REQUEST['p']) && $_REQUEST['p'] != ''){
        $password = $_REQUEST['p'];
    } else{
        die("No user specified");
    }

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


    // sql statement
    if (isset($_REQUEST['where']) || isset($_REQUEST['w'])){
        $sql = "UPDATE $table SET $set WHERE $where";
    } else {
        $sql = "UPDATE $table SET $set";
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

