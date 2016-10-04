<?php
$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	} 
$hid = $_GET['hid'];
$sql1 = "SELECT H_pic FROM Char_Hero WHERE HID = '$hid'";
$erg = mysqli_query($verbindung, $sql1);
echo $erg;

?>