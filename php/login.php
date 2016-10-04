<?php
    //funzt
	$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	}

	$username = $_GET['u'];
	$passwort = md5($_GET['p']);
	
	$sql1 = "SELECT * FROM Char_User WHERE UserName = '$username'";
	$ergebnis = mysqli_query($verbindung, $sql1);	
	if (mysqli_num_rows($ergebnis) > 0) {
        $row = mysqli_fetch_object($ergebnis); 
        $test = $row->pw;
        $uid = $row->UserID;
        $sql2 = "UPDATE Char_User SET logged = 1 WHERE UserID = '$uid'";
        $active = $row->active;
        $logged = $row->logged;
        if($test == $passwort AND $active == 1 AND $logged == 0) {
            mysqli_query($verbindung, $sql2);
            echo $uid;
        }
        else { 
            if ($logged == 1) 
                echo "logged";
            elseif ($active == 0)
                echo "notactive";
            else
                echo "false";
        }
    }
    else
        echo "false";
	
	// Letztendlich muss hier ein false/USER_ID Wert ausgegeben werden: Wenn die Logindaten nicht zusammenpassen, wird "false" ausgegeben; wenn die Daten stimmen, wird die "{USER_ID}" zurückgegeben. Diese wird dann in JS gespeichert und kann weitere PHP-Funktionen wie das Auslesen die der USER_ID zugeordneten Helden auslesen.
	// Wir müssen nochmal genau definieren, wie die Übergabe von Werten aussieht... hier aber auch in den anderen php-Dateien...
?>
