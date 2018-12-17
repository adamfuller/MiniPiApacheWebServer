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
//    PUSH data into MySQL
$A = $_GET["A"];

if ($A === "insert"){
    $ID = $_GET["id"];
    $X = $_GET["x"];
    $Y = $_GET["y"];
    $Z = $_GET["size"];
    $L = $_GET["alive"];
    //$STMT="INTERT INTO ".$TABLE."(id, x, y, size, alive, killedBy) values (". $ID .",". $X.",". $Y .", 1, 1)";
    $STMT = "INSERT INTO ".$TABLE." (id, x, y, alive, size) VALUES (".$ID.", ".$X.", ".$Y.", ".$L.", ".$Z.")";
} else if ($A === "updatex"){
    $ID = $_GET["id"];
    $X = $_GET["x"];
    $STMT="UPDATE ".$TABLE." SET x=".$X." WHERE id=".$ID;
} else if ($A === "updatey"){
    $ID = $_GET["id"];
    $Y = $_GET["y"];
    $STMT="UPDATE ".$TABLE." SET y=".$Y." WHERE id=".$ID;
} else if ($A === "updateZ"){
    $ID = $_GET["id"];
    $Z = $_GET["size"];
    $STMT="UPDATE ".$TABLE." SET size=".$Z." WHERE id=".$ID;
}

mysql_query($STMT, $CONN);


?>