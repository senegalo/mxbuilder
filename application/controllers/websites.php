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
    
    /**
     * @todo Needs to be redone from scratch ...
     */
    public function publish(){
        $this->load->model("websites_model");
        $this->load->model("assets_model");
        $this->load->helper("url");
        
        $user_dir = $this->websites_model->get_publish_folder($this->user['username']);
        $pages = $this->input->post("pages");
        $layout = $this->input->post("layout");
        $assets = $this->input->post("assets");
        
        //copy required assets
        mkdir($user_dir."/images");
        $this->assets_model->move_assets_to_publish_dir($this->user,$assets,$user_dir."/images");
        
        foreach($pages as $page){
            touch($user_dir."/".$page['address'].".html");
            $content = $this->load->view('publish_template',array_merge($layout,$page),true);
            file_put_contents($user_dir."/".$page['address'].".html", $content);
        }
        success(array("website"=>base_url('/public/websites/'.$this->user['username'])));
    }
}
?>