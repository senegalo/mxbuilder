<?php

//print_r($_FILES);



foreach($_FILES as $file){
    $file_info = new finfo(FILEINFO_MIME);
    
    switch($file_info->file($file['tmp_name'])){
        case "image/jpeg":
        case "image/png":
        case "images/gif":
            handle_image_upload($file);
            break;
    }
}

function handle_image_upload($file){
    if(move_uploaded_file($file['tmp_name'], "./".$file['name'])){
        return true;
    }
    return false;
}

?>