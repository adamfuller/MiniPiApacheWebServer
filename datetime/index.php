<?php 
include "../tools.php";

$tz = getInput(array("timezone","tz"), "UTC");

date_default_timezone_set($tz); 
$date = date('Y/m/d/h:i_a', time());
echo jsonify(array("datetime", "timezone"), array($date, $tz));

?>