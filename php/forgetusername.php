<?php
	//funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}
    $Absender = "cha5app@dsa-sh.de";
    $email = mysqli_real_escape_string($verbindung, $_REQUEST['e']);
    $sql1 = "SELECT UserName FROM Char_User WHERE email = '$email'";
    if (mysqli_query($verbindung, $sql1)) {
        $result = mysqli_query($verbindung, $sql1);
        $row = mysqli_fetch_object($result);
        $un = $row->UserName;
        mail($email, "Benutzer-Name vergessen", "Hallo, \n\n Dein Benutzer-Name in der Cha5App lautet: \n\n $un \n\n \n\n Viele Grüße vom DSA-SH-Team", "FROM: $Absender");
        echo "true";
    }
    else
        echo "false";
?>
    