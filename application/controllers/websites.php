<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of websites
 *
 * @author senegalo
 */
class websites extends MX_Controller{


    public function __construct() {
        parent::__construct();
        $this->authenticate();
    }
    
    public function save(){
        $this->load->model("websites_model");
        
        $website_content = $this->input->post("website_content");
        
        if($website_content == false){
            error(Constance::INVALID_PARAMETERS,"Missing website_content variable.");
        } else {
            $this->websites_model->update($this->user,$website_content);
            success();
        }
    }
    
    public function get(){
        $this->load->model("websites_model");
        $websiteData = $this->websites_model->get($this->user);
        if($websiteData != Websites_Model::WEBSITE_NOT_FOUND){
            success($websiteData);
        }
        error($websiteData,"User has not created a website yet");
    }
}
?>