<?php
    //funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}

    $uid = $_GET['uid'];
    $sql1= "UPDATE Char_User SET logged = 0 WHERE UserID = '$uid'";
    if (mysqli_query($verbindung, $sql1) == true)
        echo "true";
?>