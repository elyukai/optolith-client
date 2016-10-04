<?php
    //funzt
    $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
    if (!$verbindung) {
        die();
        // die('Connect Error: ' . mysqli_connect_errno());
        exit;
    }
    $email = mysqli_real_escape_string($verbindung, $_GET['e']);
	$sql1 = "SELECT UserID FROM Char_User WHERE email = '$email'";
	$ergebnis = mysqli_query($verbindung, $sql1);
    $row = mysqli_num_rows($ergebnis);
    if ($row === 0) {
        echo 'false';
    }
    else {
        echo 'true';
    }
?>