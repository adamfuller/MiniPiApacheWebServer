<!-- <?php 
$IP="localhost";
$DB="test1";
$TABLE="testTable12";
$USER="root";
$PSK="";

$CONN = mysql_connect($IP, $USER, $PSK);
mysql_select_db($DB, $CONN);

if (!$CONN){
    die("Connection failed: ". mysql_error());
}

$U = $_GET["userName"];
$STMT = "DELETE FROM ".$TABLE." WHERE userName='".$U."'";
mysql_query($STMT, $CONN);

?> -->