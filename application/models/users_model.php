<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of users_model
 *
 * @author senegalo
 */
class Users_Model extends CI_Model {
    
    const MISSING_LOGINS = "MISSING_LOGINS";
    const INVALID_LOGINS = "INVALID_LOGINS";
    
    public function __construct() {
        parent::__construct();
    }
    
    public function login(){
        return true;
    }
    
}

?>
