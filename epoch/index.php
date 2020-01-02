<?php 
include "../tools.php";

$tz = getInput(array("timezone", "tz"), "UTC");

date_default_timezone_set($tz); 
echo "$tz:".time();

?>