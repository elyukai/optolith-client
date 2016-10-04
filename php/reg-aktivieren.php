<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Cha5App - Registrierung abgeschlossen</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

		<link href="../css/default.css" rel="stylesheet">
		<link href="../favicon.ico" rel="shortcut icon" type="image/x-icon">
    </head>
    <body>
        <div class="content-section">
            <div class="page-wrapper">
                <div class="page">
                    <div class="title-wrapper">
                        <h1 class="section-title">Registrierung abgeschlossen</h1>
                    </div>
                    <div class="content-wrapper">
                        <p class="default-1-1">
                            <?php
                                //funzt
                                $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
                                if (!$verbindung) {
                                    die();
                                    // die('Connect Error: ' . mysqli_connect_errno());
                                    exit;
                                }
                                    
                                    if($_REQUEST['ID'] && $_REQUEST['Aktivierungscode']) {
                                        
                                        $_REQUEST['Aktivierungscode'] = mysqli_real_escape_string($verbindung, $_REQUEST['Aktivierungscode']);

                                        $ResultPointer = mysqli_query($verbindung, "SELECT ID FROM Aktivierung WHERE ID = '".$_REQUEST['ID']."' AND Aktivierungscode = '".$_REQUEST['Aktivierungscode']."'");

                                        if(mysqli_num_rows($ResultPointer) > 0) {
                                            mysqli_query($verbindung, "UPDATE Aktivierung SET Aktiviert = 'Ja' WHERE ID = '".$_REQUEST['ID']."'");
                                            mysqli_query($verbindung, "UPDATE Char_User SET active = 1 WHERE UserID = '".$_REQUEST['ID']."'");
                                            echo "Vielen Dank für Ihre Registrierung. Der Aktivierungsprozess ist nun abgeschlossen.";
                                        }
                                    }

                            ?>
                        </p>
						<div class="default-1-1">
							<a href="http://cha5app.dsa-sh.de/" target="_blank" class="btn blue">
								<span class="btn-text">Zurück zur Cha5App-Anmeldeseite</span>
							</a>
						</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>