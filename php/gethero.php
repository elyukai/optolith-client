<?php
	//funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}
    $sepinner = "#%";
    $sepouter = "#§";
	
	$heroid = $_GET['hid'];
    $sql1 = "SELECT * FROM Char_Hero WHERE HID = '$heroid'";
    $sql2 = "SELECT * FROM Char_HShare WHERE HID = '$heroid' AND MID = 1";
    $sql3 = "SELECT * FROM Char_HShare WHERE HID = '$heroid' AND MID = 0";
    
    $erghero = mysqli_query($verbindung, $sql1);
    $row = mysqli_fetch_object($erghero);
    $stringhero = $stringhero . $row->String2;
    
    if (mysqli_query($verbindung, $sql2)) {
        $ergmid = mysqli_query($verbindung, $sql2);
        $row = mysqli_fetch_object($ergmid);
        $mid = $row->UserID;
        $sql4 = "SELECT UserName FROM Char_User WHERE UserID = '$mid'";
        $ergmn = mysqli_query($verbindung, $sql4);
        $row1 = mysqli_fetch_object($ergmn);
        $mn = $row1->UserName;
        $stringhero = $stringhero . $mid . $sepinner . $mn . $sepouter;
    }
    else {
        $stringhero = $stringhero . "false" . $sepinner . "false" . $sepouter;
    }       

    if (mysqli_query($verbindung, $sql3)) {
        $erguser = mysqli_query($verbindung, $sql3);
        while ($row = mysqli_fetch_object($erguser)) {
            $uid = $row->UserID;
            $sql5 = "SELECT UserName FROM Char_User WHERE UserID = '$uid'";
            $ergun = mysqli_query($verbindung, $sql5);
            $row1 = mysqli_fetch_object($ergun);
            $un = $row1->UserName;
            $stringhero = $stringhero . $uid . $sepinner . $un . $sepouter;
        }
    }
    else { 
        $stringhero = $stringhero . "false" . $sepinner . "false" . $sepouter;
    }   
	echo $stringhero;
?>