<?php

class Users extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function authenticate() {
        $this->load->model("users_model");
        $token = $this->input->post("token");

        if ($token === false) {
            error(Constance::INVALID_PARAMETERS,"Token is missing from the parameters list");
        } else {
            $out = $this->users_model->authenticate($token);
            if ($out == Users_Model::USER_NOT_FOUND) {
                error($out, "The token supplied didn't match any users.");
            } else {
                success($out);
            }
        }
    }
    
    public function login() {
        $this->load->model("users_model");
        $username = $this->input->post("username");
        $password = $this->input->post("password");

        if ($username === false || $password === false) {
            error(Constance::INVALID_PARAMETERS,"Username or password is missing from the parameters list");
        } else {
            $out = $this->users_model->login($username, $password);
            if ($out == Users_Model::USER_NOT_FOUND) {
                error($out, "The username or password supplied are incorrect.");
            } else {
                success($out);
            }
        }
    }
    
    public function create_guest_session(){
        
    }
    
}

?>