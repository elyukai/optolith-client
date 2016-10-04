<?php
    //funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	} 
    
    $uid = $_GET['uid'];
    $gname = mysqli_real_escape_string($verbindung, $_GET['n']);
    $pw = $_GET['p']; 
    $pw = md5($pw);
    
    $sql3 ="SELECT L_GID FROM last_IDs";
    $ergebnis = mysqli_query($verbindung, $sql3);
    $row = mysqli_fetch_object($ergebnis);
    $nrow = $row->L_GID;
    $nrow++;
    $gid = 'g'.$nrow;
    $sql5 ="UPDATE last_IDs SET L_GID = '$nrow'";

    $sql1 = "INSERT INTO Char_Group (GID, Name, Passwort, MeisterID, GameApp) VALUES ('$gid', '$gname', '$pw', '$uid', '0')";
    
    $res = mysqli_query($verbindung, $sql1);
    mysqli_query($verbindung, $sql5);
    echo $gid;
?>