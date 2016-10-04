<?php
//funzt
    $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}

	$heroid = mysqli_real_escape_string($verbindung,$_GET['hid']);
    $userid = $_GET['uid'];
    $sql1 = "DELETE FROM Char_Hero WHERE HID = '$heroid' AND H_UID = '$userid'";
    $sql2 = "DELETE FROM Char_HShare WHERE HID = '$heroid'";
    $res = mysqli_query($verbindung, $sql1);
    if (mysqli_affected_rows($verbindung) > 0) {
        $back = "true";
        mysqli_query($verbindung, $sql2);
    }
    else
        $back = "false";

    echo $back;
?>