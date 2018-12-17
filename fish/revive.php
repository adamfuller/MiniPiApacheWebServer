<?php
$IP="huntspi.hopto.org";
$DB="test1";
$TABLE="testTable7";
$USER="root";
$PSK="JqFl8497__GcZ-P";

$CONN = mysql_connect($IP, $USER, $PSK);
mysql_select_db($DB, $CONN);

if (!$CONN){
    die("Connection failed: " . mysql_error());
}

//    delete row from database
$ID = $_GET["id"];
$STMT = "UPDATE ".$TABLE." SET alive=1, size=5 WHERE id=".$ID;
mysql_query($STMT, $CONN);



?>