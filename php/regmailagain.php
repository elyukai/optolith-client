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
    $sql1 = "SELECT * FROM Aktivierung WHERE EMail = '$email'";
    if (mysqli_query($verbindung, $sql1)) {
        $result = mysqli_query($verbindung, $sql1);
        $row = mysqli_fetch_object($result);
        $id = $row->ID;
        echo $id;
        $code = $row->Aktivierungscode;
        echo $code;
        mail($_REQUEST['e'], "Registrierung die 2te", "Hallo,\n\nhier nochmal die Registrierungsmail.\nUm die Registrierung abzuschließen, klickst Du bitte auf den folgenden Link:\n\nhttp://www.dsa-sh.de/cha5app/php/reg-aktivieren.php?ID=$id&Aktivierungscode=$code \n\n \n\n Viele Grüße vom DSA-SH-Team", "FROM: $Absender");
        echo "true";
    }
    else
        echo "false";
?>