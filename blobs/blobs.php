<!-- <?php
$IP="huntspi.hopto.org";
$DB="test1";
$TABLE="testTable12";
$USER="root";
$PSK="";

$CONN = mysql_connect($IP, $USER, $PSK);
mysql_select_db($DB, $CONN);

if (!$CONN){
    die("Connection Failed: ". mysql_error());
}
$A = $_GET["action"];
$U = $_GET["userName"];
$S = $_GET["score"];
$C = $_GET["scoreColor"];

if ($A === "insert"){
    $STMT = "INSERT INTO ".$TABLE." (userName, score, scoreColor) values ('".$U."',".$S.",'".$C."')";
} else if ($A === "update"){
    $STMT = "UPDATE ".$TABLE." SET score=".$S." where userName='".$U."'";
}

mysql_query($STMT, $CONN);
echo $STMT

?> -->