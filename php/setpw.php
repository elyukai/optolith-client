<!DOCTYPE html>
<!--funzt-->
<html>
	<head>
		<meta charset="utf-8">
		<title>Cha5App - Passwort ändern</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

		<link href="../css/default.css" rel="stylesheet">
		<link href="../favicon.ico" rel="shortcut icon" type="image/x-icon">
    </head>
    <body>
        <div class="content-section content-section-php">
            <div class="page-wrapper">
                <div class="page">
                    <div class="title-wrapper">
                        <h1 class="section-title">Passwort ändern</h1>
                    </div>
                    <div class="content-wrapper">
                            

                            <form action="pwchanged.php" method="post" class="default-1-1">
                                <div class="textfield-wrapper">
                                <label for="pw">Neues Passwort</label>
                                <input type="password" name="pw">
                            </div>
                            <div class="textfield-wrapper">
                                <label for="pw2">Neues Passwort bestätigen</label>
                                <input type="password" name="pw2">
                            </div>
                            <input type="submit" name="submit" value="Passwort ändern">
                        </form>
                        <p class="default-1-1">
<?php
    $code = $_GET['code'];
    if ($_POST['submit'] == "Passwort ändern" AND $_POST['pw'] == $_POST['pw2']) {
        $verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
            if (!$verbindung) {
                die();
                // die('Connect Error: ' . mysqli_connect_errno());
                exit;
            }
        $pw = $_POST['pw'];
        $pw = md5($pw);
        $sql1 = "UPDATE Char_User SET pw = '$pw' WHERE pwcode = '$code'";
        $erg = mysqli_query($verbindung, $sql1);
    }
?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>