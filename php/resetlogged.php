<?php
//funzt
$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}
$un = $_GET['n'];
$sql1 = "SELECT UserID FROM Char_User WHERE UserName = '$un' AND logged = '1'";
$sql2 = "UPDATE Char_User SET logged = '0' WHERE UserName = '$un'";
$erg = mysqli_query($verbindung, $sql1);
$res = mysqli_fetch_object($erg);
$uid = $res->UserID;
echo $uid;
if(!$uid == "") {
    mysqli_query($verbindung, $sql2);
    echo 'true';
}
else
    echo 'false';
?>