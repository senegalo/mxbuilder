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
class websites extends MX_Controller {

    public function __construct() {
        parent::__construct();
        $this->authenticate();
    }

    public function save() {
        $this->load->model("websites_model");

        $website_content = $this->input->post("website_content");

        if ($website_content == false) {
            error(Constants::INVALID_PARAMETERS, "Missing website_content variable.");
        }

        //is it a valid json !?
        if (json_decode($website_content) === null) {
            error(Constants::INVALID_PARAMETERS, "Unable to parse the given json string...");
        }

        $this->websites_model->update($this->user, $website_content);
        success();
    }

    public function get() {
        $this->load->model("websites_model");
        $websiteData = $this->websites_model->get($this->user);
        if ($websiteData != Websites_Model::WEBSITE_NOT_FOUND) {
            success($websiteData);
        }
        error($websiteData, "User has not created a website yet");
    }

    /**
     * @todo Needs to be redone from scratch ...
     */
    public function publish() {
        $this->load->model("websites_model");
        $this->load->model("assets_model");
        $this->load->helper("url");

        $user_dir = $this->websites_model->get_publish_folder($this->user['username']);
        $pages = $this->input->post("pages");
        $layout = $this->input->post("layout");
        $assets = $this->input->post("assets");

        //copy required assets
        if (is_array($assets)) {
            mkdir($user_dir . "/images");
            $this->assets_model->move_assets_to_publish_dir($this->user, $assets, $user_dir . "/images");
        }

        foreach ($pages as $page) {
            touch($user_dir . "/" . $page['address'] . ".html");
            if (!isset($page['components'])) {
                $page['components'] = array();
            }
            $page['components'] = array_merge(array("header" => array(), "body" => array(), "footer" => array()), $page['components']);
            $merge = array_merge($layout, $page);
            $content = $this->load->view('publish_template', $merge, true);
            file_put_contents($user_dir . "/" . $page['address'] . ".html", $content);
        }
        if ($this->input->post("has_forms") == 1) {
            file_put_contents($user_dir . "/mail.php", $this->websites_model->get_mail_page($this->user['email']));
            copy("public/images/loading.gif", $user_dir . "/images/loading.gif");
        }
        success(array("website" => base_url('/public/websites/' . $this->user['username'])));
    }

}

?>