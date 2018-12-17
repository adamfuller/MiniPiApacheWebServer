<?php
    // database settings
    if (isset($_GET['table']) && $_GET['table'] != ''){
        $table = $_GET['table'];
    }else{
        $table = "isChanged";
    }

    if (isset($_GET['user']) && $_GET['user'] != ''){
        $user = $_GET['user'];
    }else{
        $user = "root";
    }

    if (isset($_GET['db']) && $_GET['db'] != ''){
        $db = $_GET['db'];
    }else{
        $db = "roomie";
    }

    if (isset($_GET['psk']) && strlen($_GET['psk'])>=2){
        $psk = $_GET['psk'];
    }else{
        $psk = "JqFl8497__GcZ-P";
    }

    if (isset($_GET['IP']) && $_GET['IP'] != ''){
        $db_IP = $_GET['IP'];
    }else{
        $db_IP = "localhost";
    }
	
	
    // sql statement
    $column = $_GET["col"];
    $values = $_GET["val"];
    
    $sql = "UPDATE ".$table." SET ".$column."=".$values;

    // attempt to connect to database
    $conn = mysql_connect($db_IP, $user, $psk);

    // ensure connection to MySQL
    if (!$conn){
        die("Connection failed: " . mysql_error());
    }
    // select the database to use
    mysql_select_db($db, $conn);
    // query sql statement
    $result = mysql_query($sql, $conn);
    
    
?>