<?php

class Users extends MX_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function login() {
        $this->load->model("users_model");
        $username = $this->input->post("username");
        $password = $this->input->post("password");

        if ($username === false || $password === false) {
            error(Constance::INVALID_PARAMETERS, "Username or password is missing from the parameters list");
        } else {
            $out = $this->users_model->login($username, $password);
            if ($out == Users_Model::USER_NOT_FOUND) {
                error($out, "The username or password supplied are incorrect.");
            } else {
                success($out);
            }
        }
    }

}

?>