<?php

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Editor extends CI_Controller {

    public function index() {
        $this->load->helper('url');
        
        $data = array();
        
        $max_upload = (int) (ini_get('upload_max_filesize'));
        $max_post = (int) (ini_get('post_max_size'));
        $memory_limit = (int) (ini_get('memory_limit'));
        $data['upload_mb'] = min($max_upload, $max_post, $memory_limit);
        
        $this->load->view('editor',$data);
    }

}
