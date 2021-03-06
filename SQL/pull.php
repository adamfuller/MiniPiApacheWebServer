<?php
    include "../tools.php";
    
    $database = getInput(array("database", "db", "d"), NULL, TRUE);
    $user = getInput(array("user","u"), NULL, TRUE);
    $host = getInput(array("host", "url", "ip"), "localhost");
    $password = getInput(array("password","psk", "p"), NULL, TRUE);
    $table = getInput(array("table","t"), NULL, TRUE);
    $specs = getInput(array("specs","s","where","w"), NULL);

    // sql statement
    $sql = "SELECT * from ". $table;

    // get any special modifications to the request
    if (isset($specs)){
        $sql = $sql . " WHERE $specs";
    }

    // attempt to connect to database
    $db = new mysqli($url, $user, $password, $database);

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

    $db->close();
?>
