<?php 
date_default_timezone_set("UTC"); 
$date = date('m/d/Y/h:i:s-a', time());
echo "UTC:".$date->format('Y/m/d/H:i:s');
?>
