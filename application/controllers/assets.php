<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of assets
 *
 * @author senegalo
 */
class Assets extends MX_Controller {

    public function __construct() {
        parent::__construct();
        $this->authenticate();
    }

    public function upload() {
        $this->load->model("assets_model");
        foreach ($_FILES as $file) {
            $file_info = new finfo(FILEINFO_MIME);

            switch ($file_info->file($file['tmp_name'])) {
                case "image/jpeg":
                case "image/png":
                case "images/gif":
                    if($this->assets_model->store($file,"image")){
                        success();
                    } else {
                        error(Assets_Model::UPLOAD_ERROR,"Couldn't upload your images...");
                    }
                    break;
            }
        }
    }

}

?>
