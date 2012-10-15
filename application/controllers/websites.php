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
    
    public function __construct() {
        parent::__construct();
    }
    
    public function save(){
        $this->load->model("users_model") ; /* @var $users_model Users_Model*/
        $out = $this->users_model->login();
        if($out === true || $out == Users_Model::MISSING_LOGINS){
            
        }
    }
    
}

?>
