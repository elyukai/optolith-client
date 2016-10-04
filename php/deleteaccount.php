<?php
    //funzt
    function delhero($heroid, $userid) {
        $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
        if (!$verbindung) {
            die();
            // die('Connect Error: ' . mysqli_connect_errno());
            exit;
        }
        $sql1 = "DELETE FROM Char_Hero WHERE HID = '$heroid' AND H_UID = '$userid'";
        $sql2 = "DELETE FROM Char_HShare WHERE HID = '$heroid'";
        mysqli_query($verbindung, $sql1);
        mysqli_query($verbindung, $sql2);
    }

    function delgroupandrest($userid) {
        $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
        if (!$verbindung) {
            die();
            // die('Connect Error: ' . mysqli_connect_errno());
            exit;
        }
        $sql4 = "DELETE FROM Char_Group WHERE MeisterID = '$userid'";
        $sql5 = "DELETE FROM Aktivierung WHERE ID = '$userid'";
        mysqli_query($verbindung, $sql4);
        mysqli_query($verbindung, $sql5);
    }

    function delaccount($userid) {
        $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
        if (!$verbindung) {
            die();
            // die('Connect Error: ' . mysqli_connect_errno());
            exit;
        }
        $sql6 = "DELETE FROM Char_User WHERE UserID = '$userid'";
        $erg = mysqli_query($verbindung, $sql6);
        if (mysqli_affected_rows($verbindung) > 0)
            $back = "true";
        else
            $back = "false";
        
       return $back;
    }
    
    //------------------------------------------------------------------------------------
    $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}
    
    $uid = $_GET['uid'];
    $sql3 = "SELECT HID FROM Char_Hero WHERE H_UID = '$uid'";
    $erg = mysqli_query($verbindung, $sql3);
    while ($res = mysqli_fetch_object($erg)) {
        delhero($res->HID, $uid);
    }
    delgroupandrest($uid);
    echo delaccount($uid);
?>