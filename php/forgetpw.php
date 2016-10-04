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
    $Erstellt = date("Y-m-d H:i:s");
    $npw = rand(1, 99999999);
    $sql1 = "SELECT UserID FROM Char_User WHERE email = '$email'";
    $result = mysqli_query($verbindung, $sql1);
    $row = mysqli_fetch_object($result);
    if(count($row)>=1) {
        $encrypt = md5(1290*3+$row->UserID);
        $sql2 = "UPDATE Char_User SET pwcode = '$encrypt' WHERE email = '$email'";
        mysqli_query($verbindung, $sql2);
        mail($email, "Passwort vergessen", "Hallo, \n\num Dein Passwort zu erneuern klicke bitte auf folgenden Link: \n\n http://cha5app.dsa-sh.de/php/setpw.php?code=$encrypt \n\n \n\n Viele Grüße vom DSA-SH-Team", "FROM: $Absender");
        echo "true";
    }
    else
        echo "false";
?>
