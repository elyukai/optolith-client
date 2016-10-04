<?php
    //funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	} 
	
	$userid = $_GET['uid'];
	$sepinner = "#%";
    $sepouter = "#§";
	$sql1 = "SELECT * FROM Char_Hero WHERE H_UID = '$userid'";
	$ergebnis = mysqli_query($verbindung, $sql1);
	while ($row = mysqli_fetch_object($ergebnis)) {
		$string = $string . $row->HID . $sepinner . $row->Name . $sepinner . $row->String1 . $sepouter;
	}
    echo $string;
?>