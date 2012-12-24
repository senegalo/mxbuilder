<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of assets_model
 *
 * @author senegalo
 */
class Assets_Model extends CI_Model {

    const SALT = "134!HJ1erlhkj1rf1oij%^!u1406jg!%GQERFGHQEJ5g20i5jqRGAFSGjqoie5jg45og9j0uyjqerlfqjf";
    const UPLOAD_ERROR = "UPLOAD_ERROR";
    const SERVER_ERROR = "SERVER_ERROR";
    const ASSET_NOT_FOUND = "ASSET_NOT_FOUND";

    public function __construct() {
        parent::__construct();
    }

    public function store($user, $file, $type) {

        $extension = isset($file['flicker_obj']) ? $file['flicker_obj']['originalformat'] : preg_replace("/.*\./", "", $file['name']);

        $this->db->set("user_id", $user['id'])
                ->set("name", $file['name'])
                ->set("type", $type)
                ->set("extension", $extension)
                ->set("upload_date", "NOW()", false)
                ->insert("assets");

        $asset_id = $this->db->insert_id();
        $asset_filename = $this->get_filename($asset_id) . "." . $extension;
        $upload_dir = $this->get_upload_path();

        if (!$upload_dir) {
            return Assets_Model::SERVER_ERROR;
        }

        if (isset($file['flicker_obj'])) {
            file_put_contents($upload_dir . "/" . $asset_filename, $file['data']);
        } else if (!is_dir($upload_dir . "/" . $asset_filename) || !move_uploaded_file($file['tmp_name'], $upload_dir . "/" . $asset_filename)) {
            $this->db->where("id", $asset_id)->delete("assets");
            return Assets_Model::UPLOAD_ERROR;
        }

        $out = array(
            "type" => "other",
            "location" => $this->get_upload_url(),
            "id" => $asset_id,
            "name" => $file['name']
        );

        if ($type == "image") {
            $generated_sizes = $this->generate_sizes($upload_dir, $asset_filename);
            $out = array_merge($out, $generated_sizes);
            $out['type'] = "image";
            $out['caption'] = "";
            $out['title'] = "";

            unset($generated_sizes['ratio']);
            $generated_sizes = array_keys($generated_sizes);
            $extras = array(
                "sizes" => $generated_sizes,
                "ratio" => $out['ratio'],
                "caption" => "",
                "title" => "",
                "is_flicker" => 0
            );
            
            if(isset($file['flicker_obj'])){
                $extras['owner_name'] = $file['flicker_obj']['ownername'];
                $extras['flicker_id'] = $file['flicker_obj']['id'];
                $extras['is_flicker'] = 1;
            }
            
            $this->db->set("extra", serialize($extras))
                    ->where("id", $asset_id)
                    ->update("assets");
        } else {
            $out['type'] = "other";
            $out['filename'] = $asset_filename;
        }

        return $out;
    }

    public function generate_sizes($path, $filename) {

        $out = array();

        $image_info = getimagesize($path . "/" . $filename);
        $image_type = $image_info[2];

        switch ($image_type) {
            case IMAGETYPE_JPEG:
                $image = imagecreatefromjpeg($path . "/" . $filename);
                break;
            case IMAGETYPE_GIF:
                $image = imagecreatefromgif($path . "/" . $filename);
                break;
            case IMAGETYPE_PNG:
                $image = imagecreatefrompng($path . "/" . $filename);
                break;
        }

        $image_dim = array(
            imagesx($image),
            imagesy($image)
        );
        $out['ratio'] = $image_dim[0] / $image_dim[1];

        $sizes = array(
            "full" => array(900, 675),
            "medium" => array(500, 375),
            "small" => array(300, 225),
            "thumb" => array(114, 85)
        );

        $work_with = $out['ratio'] > 1 ? 0 : 1;
        $no_resize = true;

        foreach ($sizes as $size => $metrics) {
            if ($image_dim[$work_with] > $metrics[$work_with]) {
                $no_resize = false;
                if ($work_with === 0 || $size == "thumb") {
                    $width = $metrics[0];
                    $height = $metrics[0] / $out['ratio'];
                } else {
                    $width = $metrics[1] * $out['ratio'];
                    $height = $metrics[1];
                }

                $new_image = imagecreatetruecolor($width, $height);
                imagecopyresampled($new_image, $image, 0, 0, 0, 0, $width, $height, $image_dim[0], $image_dim[1]);

                $new_image_name = preg_replace("/(.*)\./", "$1-" . $size . ".", $filename);

                switch ($image_type) {
                    case IMAGETYPE_JPEG:
                        imagejpeg($new_image, $path . "/" . $new_image_name, 80);
                        break;
                    case IMAGETYPE_GIF:
                        imagegif($new_image, $path . "/" . $new_image_name);
                        break;
                    case IMAGETYPE_PNG:
                        imagepng($new_image, $path . "/" . $new_image_name);
                        break;
                }
                $out[$size] = $new_image_name;
            }
        }

        if ($no_resize) {
            $new_image_name = preg_replace("/(.*)\./", "$1-thumb.", $filename);
            $out["thumb"] = $new_image_name;
            rename($path . "/" . $filename, $path . "/" . $new_image_name);
        } else {
            unlink($path . "/" . $filename);
        }
        return $out;
    }

    public function get_filename($asset_id) {
        return md5(Assets_Model::SALT . $asset_id);
    }

    public function get_upload_path($upload_date = NULL) {
        $paths = explode("-", date("Y-m-d", $upload_date !== null ? strtotime($upload_date) : time()));
        $current_lookup = str_replace("/application/models", "/public/uploads", __DIR__);
        foreach ($paths as $path) {
            $current_lookup .= "/" . $path;
            if (!is_dir($current_lookup)) {
                if (!@mkdir($current_lookup, 0777)) {
                    return false;
                }
            }
        }
        return $current_lookup;
    }

    public function get_upload_url() {
        $this->load->helper("url");
        $this->get_upload_path();
        return base_url('/public/uploads/' . date("Y/m/d"));
    }

    private function get_asset_by_id($user, $id) {
        $query = $this->db->from("assets")
                        ->where("user_id", $user['id'])->where("id", $id)->get();
        if ($query->num_rows() > 0) {
            return end($query->result());
        } else {
            return false;
        }
    }

    public function delete_asset($user, $asset_id) {
        $row = $this->get_asset_by_id($user, $asset_id);
        if ($row !== false) {

            $upload_path = $this->get_upload_path($row->upload_date);
            if ($row->type == "image") {
                $image_data = unserialize($row->extra);
                $filename = $this->get_filename($row->id);
                $extension = $row->extension;

                array_map(function($str) use ($filename, $extension, $upload_path) {
                            unlink($upload_path . "/" . $filename . "-" . $str . "." . $extension);
                        }, $image_data['sizes']);
            } else {
                unlink($upload_path . "/" . $this->get_filename($row->id) . "." . $row->extension);
            }

            $this->db->where("user_id", $user['id'])->where("id", $asset_id)->delete("assets");
            return true;
        }
        return Assets_Model::ASSET_NOT_FOUND;
    }

    public function get_asset_upload_folder($upload_date) {
        return str_replace("-", "/", array_shift(explode(" ", $upload_date)));
    }

    public function get_assets($user) {
        $this->load->helper("url");

        $query = $this->db->select("*")
                ->from("assets")
                ->where("user_id", $user['id'])
                ->order_by("upload_date", "desc")
                ->get();

        $out = array();

        if ($query->num_rows() > 0) {
            foreach ($query->result() as $row) {
                $asset = array();
                $asset["id"] = $row->id;
                $asset["type"] = $row->type;
                $asset["location"] = base_url('/public/uploads') . "/" . $this->get_asset_upload_folder($row->upload_date);
                $asset["name"] = $row->name;
                if ($row->type == "image") {
                    $image_data = unserialize($row->extra);
                    $asset["ratio"] = $image_data["ratio"];
                    $asset["title"] = $image_data["title"];
                    $asset["caption"] = $image_data["caption"];

                    $filename = $this->get_filename($row->id);
                    $extension = $row->extension;

                    array_map(function($str) use ($filename, $extension, &$asset) {
                                $asset[$str] = $filename . "-" . $str . "." . $extension;
                            }, $image_data['sizes']);
                } else {
                    $asset['filename'] = $this->get_filename($row->id) . "." . $row->extension;
                }
                $out[] = $asset;
            }
        }
        $out[] = array("id" => 0,
            "type" => "image",
            "location" => base_url('/public/images'),
            "name" => "error",
            "ratio" => 1.09,
            "title" => "Couldn't load the image",
            "caption" => "",
            "medium" => "error-medium.png",
            "small" => "error-small.png",
            "thumb" => "error-thumb.png");
        return $out;
    }

    public function update_photo_properties($user, $image_id, $args) {
        $row = $this->get_asset_by_id($user, $image_id);
        if ($row !== false) {
            $extra = unserialize($row->extra);
            $extra["caption"] = $args['caption'];
            $extra["title"] = $args['title'];
            $extra = serialize($extra);
            $this->db->where("id", $image_id)
                    ->where("user_id", $user['id'])
                    ->set("name", $args['name'])
                    ->set('extra', $extra)
                    ->update("assets");
        }
    }

    public function change_asset_name($user, $asset_id, $new_name) {
        $this->db->set("name", $new_name)
                ->where("user_id", $user['id'])
                ->where("id", $asset_id)
                ->update("assets");
    }

    public function move_assets_to_publish_dir($user, $assets, $destination) {
        $query = $this->db->from("assets")
                ->where_in("id", array_keys($assets))
                ->where("user_id", $user['id'])
                ->get();
        foreach ($query->result() as $row) {
            $upload_path = $this->get_upload_path($row->upload_date);
            foreach ($assets[$row->id] as $size) {
                $filename = $this->get_filename($row->id) . "-" . $size . "." . $row->extension;
                copy($upload_path . "/" . $filename, $destination . "/" . $filename);
            }
        }
    }

}

?>