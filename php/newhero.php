<?php
    //funzt
    $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}
    
    $uid = $_GET['uid']; //UserID
    $hname = $_GET['n']; //Heldenname
    
    $sql3 ="SELECT L_HID FROM last_IDs";
    $ergebnis = mysqli_query($verbindung, $sql3);
    $row = mysqli_fetch_object($ergebnis);
    $nrow = $row->L_HID;
    $nrow++;
    $hid = 'h'.$nrow; //neue HeldenID bauen
    $sql5 ="UPDATE last_IDs SET L_HID = '$nrow'";
    mysqli_query($verbindung, $sql5);

    $sql6 ="INSERT INTO Char_Hero VALUES ('$hid', '$hname', '0', '$uid', '0', '0', '0')"; //Held in die DB schreiben
    $res = mysqli_query($verbindung, $sql6);
    if (mysqli_affected_rows($verbindung) > 0)
        echo $hid;

?>