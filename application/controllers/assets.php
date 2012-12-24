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
            $the_info = @$file_info->file($file['tmp_name']);
            $mime_info = substr($the_info, 0, strpos($the_info, ';'));
            switch ($mime_info) {
                case "image/jpeg":
                case "image/png":
                case "image/gif":
                    $out = $this->assets_model->store($this->user, $file, "image");
                    if ($out == Assets_Model::UPLOAD_ERROR) {
                        error(Assets_Model::UPLOAD_ERROR, "Couldn't move your image and store it in the database...");
                    } else if ($out == Assets_Model::SERVER_ERROR) {
                        error(Assets_Model::SERVER_ERROR, "Server encountered an error while processing your request...");
                    } else {
                        success($out);
                    }
                    break;
                case "text/plain":
                case "application/pdf":
                case "application/x-download":
                case "application/msword":
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                case "application/zip":
                    $out = $this->assets_model->store($this->user, $file, "other");
                    if ($out !== Assets_Model::UPLOAD_ERROR) {
                        success($out);
                    } else {
                        error(Assets_Model::UPLOAD_ERROR, "Couldn't move your document and store it in the database...");
                    }
                    break;
            }
            error(Assets_Model::UPLOAD_ERROR, "File type not allowed.");
        }
    }

    public function get() {
        $this->load->model("assets_model");
        $out = $this->assets_model->get_assets($this->user);
        success(array("assets" => $out));
    }

    public function delete() {
        $asset_id = $this->input->post("asset_id");
        if ($asset_id === false) {
            error(Constance::INVALID_PARAMETERS, "asset_id is missing.");
        } else {
            $this->load->model("assets_model");
            if ($this->assets_model->delete_asset($this->user, $asset_id) !== Assets_Model::ASSET_NOT_FOUND) {
                success();
            } else {
                error(Assets_Model::ASSET_NOT_FOUND, "asset_id provided is not found or you don't have access to it.");
            }
        }
    }

    public function update_photo_properties() {
        $name = $this->input->post("name");
        $caption = $this->input->post("caption");
        $title = $this->input->post("title");
        $asset_id = $this->input->post("asset_id");

        if ($name === false || $asset_id === false || $caption === false || $title === false) {
            error(Constance::INVALID_PARAMETERS, "A required parameter is missing");
        } else {
            $this->load->model("assets_model");
            $this->assets_model->update_photo_properties($this->user, $asset_id, array("caption" => $caption, "title" => $title, "name" => $name));
            success();
        }
    }

    public function change_asset_name() {
        $new_name = $this->input->post("new_name");
        $asset_id = $this->input->post("asset_id");
        if ($new_name === false || $asset_id === false || $caption === false || $title === false) {
            error(Constance::INVALID_PARAMETERS, "A required parameter is missing");
        } else {
            $this->load->model("assets_model");
            $this->assets_model->change_asset_name($this->user, $asset_id, $new_name);
            success();
        }
    }
    
    public function add_flicker_image(){
        $this->load->model("assets_model");
        $flicker_obj = $this->input->post("flicker_obj");
        $image = file_get_contents('http://farm'.$flicker_obj['farm'].'.staticflickr.com/'.$flicker_obj['server'].'/'.$flicker_obj['id'].'_'.$flicker_obj['originalsecret'].'_o.'.$flicker_obj['originalformat']);
        $out  = $this->assets_model->store($this->user,array("name"=>$flicker_obj['title'],"flicker_obj"=>$flicker_obj,"data"=>$image),"image");
        success(array("asset"=>$out));
    }
}

?>