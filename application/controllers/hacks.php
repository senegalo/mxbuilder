<?php

class Hacks extends CI_Controller {
    public function __construct() {
        parent::__construct();
    }
    
    public function switch_token($token){
        $this->input->set_cookie(array(
                "name" => "token",
                "value" => $token,
                "expire" => 31536000
                ));
    }
    
}

?>
