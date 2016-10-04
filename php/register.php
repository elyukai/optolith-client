<?php
    //funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}

    $Absender = "cha5app@dsa-sh.de";
    
    $username = mysqli_real_escape_string($verbindung, $_GET['u']);
    $email = mysqli_real_escape_string($verbindung, $_GET['e']);
    $pw = $_GET['p']; 
    $pw = md5($pw);

    $sql3 ="SELECT L_UID FROM last_IDs";
    $ergebnis = mysqli_query($verbindung, $sql3);
    $row = mysqli_fetch_object($ergebnis);
    $nrow = $row->L_UID;
    $nrow++;
        
    $sql4 = "INSERT INTO Char_User (UserID, email, UserName, pw) VALUES ('$nrow', '$email', '$username', '$pw')";
    $sql5 ="UPDATE last_IDs SET L_UID = '$nrow'";
    $register = mysqli_query($verbindung, $sql4);
    mysqli_query($verbindung, $sql5);
    if ($register == true) {
        $_REQUEST['e'] = mysqli_real_escape_string($verbindung, $_REQUEST['e']);
        $Erstellt = date("Y-m-d H:i:s");
        $Aktivierungscode = rand(1, 99999999);

        mysqli_query($verbindung, "INSERT INTO Aktivierung (ID, Aktivierungscode, Erstellt, EMail, Aktiviert) VALUES ('$nrow', '$Aktivierungscode', '$Erstellt', '".$_REQUEST['e']."', 'Nein')");

        mail($_REQUEST['e'], "Registrierung", "Hallo,\n\num die Registrierung abzuschließen, klickst Du bitte auf den folgenden Link:\n\nhttp://www.dsa-sh.de/cha5app/php/reg-aktivieren.php?ID=$nrow&Aktivierungscode=$Aktivierungscode \n\n \n\n Viele Grüße vom DSA-SH-Team", "FROM: $Absender");
        echo "true";
    }
?>