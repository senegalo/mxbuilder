<?php

function json_out($data) {
    print json_encode($data);
    exit();
}

function error($code, $description = "", $extra_info = array()) {
    $out = array("error" => $code);
    if($description != ""){
        $out["description"] = $description;
    }
    if(count($extra_info) > 0){
        $out = array_merge($out,$extra_info);
    }
    json_out($out);
}

function success($out = array()) {
    json_out(array_merge(array("success" => 1), $out));
}

?>
