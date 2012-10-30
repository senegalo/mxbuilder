<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of websites_model
 *
 * @author senegalo
 */
class Websites_Model extends CI_Model {

    const WEBSITE_NOT_FOUND = "WEBSITE_NOT_FOUND";

    public function __construct() {
        parent::__construct();
    }

    public function get($user) {
        $query = $this->db->select("*")
                        ->from($user['type'] == "guest" ? "guest_websites" : "registered_websites")
                        ->where("user_id", $user['id'])->get();
        if ($query->num_rows() > 0) {
            return end($query->result_array());
        }
        return Websites_Model::WEBSITE_NOT_FOUND;
    }

    public function update($user, $content) {
        $sql = 'INSERT INTO ' . ($user['type'] == "guest" ? "guest_websites" : "registered_websites") . ' (user_id, content, created_on, last_saved_on)
        VALUES (?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
            content=VALUES(content), 
            last_saved_on=VALUES(last_saved_on)';

        $this->db->query($sql, array($user['id'], $content));
    }

    public function get_publish_folder($username) {
        $websites_loc = str_replace("/application/models", "/public/websites", __DIR__) . "/" . $username;
        if (!is_dir($websites_loc)) {
            mkdir($websites_loc);
        } else {
            $this->clean_folder($websites_loc);
        }
        return $websites_loc;
    }

    private function clean_folder($folder, $first_run = true) {
        $res = opendir($folder);
        while ($item = readdir($res)) {
            if ($item == "." || $item == "..") {
                continue;
            }

            if (is_dir($folder . "/" . $item)) {
                $this->clean_folder($folder . "/" . $item,false);
            } else {
                unlink($folder . "/" . $item);
            }
        }
        closedir($res);
        if (!$first_run) {
            rmdir($folder);
        }
    }

}

?>
