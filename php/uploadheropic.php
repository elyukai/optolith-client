<?php
$verbindung = mysqli_connect("mysql5.monster-rc.firma.cc", "db368367_6" , "Cha5App", "db368367_6"); 
	if (!$verbindung) {
		die();
		// die('Connect Error: ' . mysqli_connect_errno());
		exit;
	} 

$hid = $_GET['hid'];
$target_dir = "../heropic/";
$name = basename($_FILES["fileToUpload"]["name"]);
$newname = $hid . $name;
$target_file = $target_dir . $newname;

try {
    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (
        !isset($_FILES['upfile']['error']) ||
        is_array($_FILES['upfile']['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }
    
     // Check $_FILES['upfile']['error'] value.
    switch ($_FILES['upfile']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // You should also check filesize here. 
    if ($_FILES['upfile']['size'] > 1000000) {
        throw new RuntimeException('Exceeded filesize limit.');
    }
    
    // Check if file already exists
    if (file_exists($target_file)) {
        throw new RuntimeException('File already exists.');
    }
    
    // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
    // Check MIME Type by yourself.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
        $finfo->file($_FILES['upfile']['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }
    
    // Write Pic-URL into DB
    $sql1 = "INSERT INTO Char_Hero (H_pic) VALUES ('$target_file')";
    if (!mysqli_query($verbindung, $sql1)) {
        throw new RuntimeException('No SQL Connection to upload.');
    }
    
    echo 'true';

} catch (RuntimeException $e) {

    echo $e->getMessage();

}
move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file);



?>