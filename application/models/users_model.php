<?php

class Users_Model extends CI_Model {

    const USER_NOT_FOUND = "USER_NOT_FOUND";
    const SALT = "saltjhLKhlkuhkyoiuyIU&(^5*^%4O8ghp9809u(&gt*^r^%$^oiuboIUnoIY98y9Y8&$65#Etrvhb";

    public function __construct() {
        parent::__construct();
    }

    /**
     * takes a token and returns the user information object.
     * @param string $token
     * @return array|USER_NOT_FOUND
     */
    public function authenticate($token) {
        $query = $this->db->select("id, username, type, token")
                        ->from("users")
                        ->where("token", $token)->get();
        if ($query->num_rows() > 0) {
            $out = end($query->result_array());
        } else {
            $out = Users_Model::USER_NOT_FOUND;
        }
        return $out;
    }

    /**
     * checks if the username and password belongs to a user.
     * @param string $username
     * @param string $password
     * @return array|USER_NOT_FOUND
     */
    public function login($username, $password) {
        $query = $this->db->select("id, username, type, token")
                ->from("users")
                ->where("username", $username)
                ->where("password", md5(Users_Model::SALT . $password))
                ->get();
        if ($query->num_rows() > 0) {
            $out = end($query->result_array());
        } else {
            $out = Users_Model::USER_NOT_FOUND;
        }
        return $out;
    }

    /**
     * creates a guest session and returns the data
     * @return array
     */
    public function create_guest_session() {
        $out = array(
            "type" => "guest"
        );
        
        //generating the username
        do {
            $out['username'] = md5(rand(10000, 99999) . microtime(true));
        } while (!$this->is_username_available($out['username']));
        
        $out['password'] = md5($out['username']);
        $out['token'] = $this->generate_token();
        
        $this->db->set($out)->insert("users");
        
        return $out;
    }

    /**
     * checks if the username is already taken.
     * @param string $username
     * @return boolean
     */
    public function is_username_available($username) {
        $query = $this->db->select('id')
                        ->from("users")
                        ->where("username", $username)->get();
        return $query->num_rows() > 0 ? false : true;
    }
    
    /**
     * Generates a unique user token
     * @return string
     */
    public function generate_token(){
        do {
            $token = md5(Users_Model::SALT.rand(10000000, 99999999) . microtime(true));
        } while (!$this->is_token_available($token));
        return $token;
    }
    
    /**
     * Checks if a token has been used before
     * @param string $token
     * @return boolean
     */
    private function is_token_available($token) {
        $query = $this->db->select('id')
                        ->from("users")
                        ->where("token", $token)->get();
        return $query->num_rows() > 0 ? false : true;
    }

}

?>