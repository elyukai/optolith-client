<?php
//funzt
$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
if (!$verbindung) {
    die();
    // die('Connect Error: ' . mysqli_connect_errno());
    exit;
}
$hid = $_GET['hid'];
$hn = $_GET['n'];
$s1 = $_GET['s1'];
$s2 = $_GET['s2'];

$sql1 = "UPDATE Char_Hero SET Name = '$hn', String1 = '$s1', String2 = '$s2' WHERE HID = '$hid'";
mysqli_query($verbindung, $sql1);
if (mysqli_affected_rows($verbindung) > 0)
    echo "true";
else
    echo "false";
?>