<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of assets_model
 *
 * @author senegalo
 */
class Assets_Model extends CI_Model {
    
    const SALT = "134!HJ1erlhkj1rf1oij%^!u1406jg!%GQERFGHQEJ5g20i5jqRGAFSGjqoie5jg45og9j0uyjqerlfqjf";
    const UPLOAD_ERROR = "UPLOAD_ERROR";
    
    public function __construct() {
        parent::__construct();
    }
    
    public function store($user,$file,$type){
        $this->db->set("user_id",$user['id'])
                ->set("name", $file['name'])
            ->set("type",$type)
            ->set("upload_date","NOW()",false)
            ->insert("assets");
        
        $asset_id = $this->db->insert_id();
        $asset_filename = $this->get_filename($asset_id);
        $upload_dir = $this->get_upload_path();
        
        if(!move_uploaded_file($file['tmp_name'],  $upload_dir."/".$asset_filename)){
            $this->db->where("id",$asset_id)->delete("assets");
            return Assets_Model::UPLOAD_ERROR;
        }
        
        return true;
    }
    
    public function get_filename($asset_id){
        return md5(Assets_Model::SALT.$asset_id);
    }
    
    public function get_upload_path(){
        $paths = explode("-",date("Y-m-d"));
        $current_lookup = "uploads";
        foreach($paths as $path){
            $current_lookup .= "/".$path;
            if(!is_dir($current_lookup)){
                mkdir($current_lookup,0777);
            }
        }
        return $current_lookup;
    }
    
}

?>