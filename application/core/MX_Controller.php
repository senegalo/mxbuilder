<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of mx_controller
 *
 * @author senegalo
 */
class MX_Controller extends CI_Controller {

    protected $user;

    public function __construct() {
        parent::__construct();
    }

    public function authenticate() {
        $this->load->model("users_model");
        $token = $this->input->post("token");
        if ($token === false) {
            $token = $this->input->cookie("token");
        }
        if ($token === false) {
            $out = $this->users_model->create_guest_session();
            setcookie("token",$out['token'], time()+2629740);
        } else {
            $out = $this->users_model->authenticate($token);
            if ($out == Users_Model::USER_NOT_FOUND) {
                $out = $this->users_model->create_guest_session();
                setcookie("token",$out['token'], time()+2629740);
            }
        }
        $this->user = $out;
    }

}