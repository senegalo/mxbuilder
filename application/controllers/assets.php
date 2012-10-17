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
            $the_info = $file_info->file($file['tmp_name']);
            $mime_info = substr($the_info, 0, strpos($the_info, ';'));
            switch ($mime_info) {
                case "image/jpeg":
                case "image/png":
                case "images/gif":
                    $out = $this->assets_model->store($this->user,$file,"image");
                    if($out !== Assets_Model::UPLOAD_ERROR){
                        success($out);
                    } else {
                        error(Assets_Model::UPLOAD_ERROR,"Couldn't upload your images...");
                    }
                    break;
            }
        }
    }
    
    public function get(){
        $this->load->model("assets_model");
        $out = $this->assets_model->get_assets($this->user);
        success(array("assets" => $out));
    }
    
    public function delete(){
        $asset_id = $this->input->post("asset_id");
        if($asset_id === false){
            error(Constance::INVALID_PARAMETERS, "asset_id is missing.");
        } else {
            $this->load->model("assets_model");
            if($this->assets_model->delete_asset($this->user,$asset_id) !== Assets_Model::ASSET_NOT_FOUND){
                success();
            } else {
                error(Assets_Model::ASSET_NOT_FOUND,"asset_id provided is not found or you don't have access to it.");
            }
        }
    }

}

?>