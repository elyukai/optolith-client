<?php
    //funzt
    $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
    if (!$verbindung) {
        die();
        // die('Connect Error: ' . mysqli_connect_errno());
        exit;
    }
    $un = mysqli_real_escape_string($verbindung, $_GET['u']);
	$sql1 = "SELECT UserID FROM Char_User WHERE UserName = '$un'";
	$ergebnis = mysqli_query($verbindung, $sql1);
    $row = mysqli_num_rows($ergebnis);
	if ($row === 0) {
        echo 'false';
    }
    else {
        echo 'true'; 
    }
?>