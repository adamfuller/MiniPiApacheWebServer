<?php 
// use: delete.php?table=[*table*]&IP=localhost&user=root&db=[*database*]
// database settings
if (isset($_GET['table']) && $_GET['table'] != ''){
    $table = $_GET['table'];
}else{
    $table = "testTable5";
}

if (isset($_GET['user']) && $_GET['user'] != ''){
    $user = $_GET['user'];
}else{
    $user = "root";
}

if (isset($_GET['db']) && $_GET['db'] != ''){
    $db = $_GET['db'];
}else{
    $db = "test1";
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


$CONN = mysql_connect($db_IP, $user, $psk);
mysql_select_db($db, $CONN);

if (!$CONN){
    die("Connection failed: ". mysql_error());
}

$K = $_GET["key"];
$V = $_GET["val"];
$STMT = "DELETE FROM ".$table." WHERE ".$K."=".$V;
mysql_query($STMT, $CONN);
echo $STMT

?>