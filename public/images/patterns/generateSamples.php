<?php

$files = glob("*.png");
$width = 214;
$height = 60;
if ($files) {
    $cnt = count($files);
    $new_image = imagecreatetruecolor($width, $height * $cnt);
    imagealphablending($new_image, false);
    $col = imagecolorallocatealpha($new_image, 0, 0, 0, 127);
    imagefilledrectangle($new_image, 0, 0, $width, $height * $cnt, $col);
    imagealphablending($new_image, true);
    for ($i = 0; $i < $cnt; $i++) {
        $image = imagecreatefrompng($files[$i]);
        $pattern_width = imagesx($image);
        $pattern_height = imagesy($image);

        $repeat_x = $width > $pattern_width ? ceil($width / $pattern_width) : 1;
        $repeat_y = $height > $pattern_height ? ceil($height / $pattern_height) : 1;
        print "repeatx: ".$repeat_x." repeaty: ".$repeat_y."\n";
        for ($x = 0; $x < $repeat_x; $x++) {
            for ($y = 0; $y < $repeat_y; $y++) {
                print ($x * $pattern_width).'x'.($height * $i + $y * $pattern_height)."\n";
                $srcWidth = $width-$x * $pattern_width > $pattern_width?$pattern_width:$width-$x * $pattern_width;
                $srcHeight = $height-$y * $pattern_height > $height ? $pattern_height : $height-$y * $pattern_height;
                imagecopy($new_image, $image, $x * $pattern_width, $height * $i + $y * $pattern_height, 0, 0, $srcWidth, $srcHeight);
                imagealphablending($image, true);
            }
        }
        imagedestroy($image);
    }
}
imagealphablending($new_image, false);
imagesavealpha($new_image, true);
imagepng($new_image, "../patterns.png", 0);
?>