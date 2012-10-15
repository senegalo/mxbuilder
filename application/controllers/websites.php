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
class websites extends CI_Controller{
    
    private $user;


    public function __construct() {
        parent::__construct();
        
        $this->load->model("users_model");
        
        $token = $this->input->post("token");
        
        if($token === false){
            error(Constance::INVALID_PARAMETERS,"This is a secure endpoint. user token must be sent with request");
        }
        
        $this->user = $this->users_model->authenticate($token);
        if($this->user == Users_Model::USER_NOT_FOUND){
            error(Users_Model::USER_NOT_FOUND,"The token didn't match any registred/guest users");
        }
        
    }
    
    public function save(){
        
    }
    
}

?>
