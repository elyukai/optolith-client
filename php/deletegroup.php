<?php
    //funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}

    $uid = $_GET['uid'];
    $gid = $_GET['gid'];

    $sql1 = "DELETE FROM Char_Group WHERE GID = '$gid' AND MeisterID = '$uid'";
    $res = mysqli_query($verbindung, $sql1);
    if (mysqli_affected_rows($verbindung) > 0)
        $back = "true";
    else
        $back = "false";

    echo $back;
?>