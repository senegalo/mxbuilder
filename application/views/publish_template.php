<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <title><?php print $title; ?></title>

        <link rel="stylesheet" href="<?php print base_url("public/css/smoothness/jquery-ui-1.9.2.custom.css"); ?>" type="text/css"/>
        <link rel="stylesheet" href="<?php print base_url("public/css/reset.css"); ?>" type="text/css" />

        <style>
            html {
                font-size: 12px;
                overflow-x: hidden;
                font-family:Arial,Verdana,Sans-serif;
                overflow-y: scroll;
            }
            .mx-component, .mx-component .content {
                outline: 0px solid transparent;
            }
            .ui-selected,.ui-selected:focus {
                outline: 1px dashed #444 !important;
            }

            #container {
                width:980px;
                height: 100%;
                position:absolute;
                top:0;
                left:50%;
                margin-left: -490px;
            }

            .flexly-background-image {
                overflow: hidden;
            }

        </style>

        <?php
        if (isset($head_includes, $head_includes["css"])):
            foreach ($head_includes["css"] as $element):
                ?>
                <link href="<?php print !stristr($element,"http")?base_url($element):$element; ?>" media="screen" rel="stylesheet" type="text/css" />
                <?php
            endforeach;
        endif;
        ?>

        <!--External Libs-->
        <link rel="stylesheet" href="<?php print base_url("public/js-libs/lightbox/css/jquery.lightbox-0.5.css"); ?>" type="text/css" />

        <script type="text/javascript" src="<?php print base_url("public/js-libs/jquery-1.8.3.min.js"); ?>"></script>
        <script type="text/javascript" src="<?php print base_url("public/js-libs/lightbox/jquery.lightbox-0.5.pack.js"); ?>"></script>

        <!--init-->
        <script type="text/javascript">
            $(function(){
                $(".lightbox").lightBox({
                    imageLoading: "<?php print base_url("public/js-libs/lightbox/images/lightbox-ico-loading.gif"); ?>",
                    imageBtnClose: "<?php print base_url("public/js-libs/lightbox/images/lightbox-btn-close.gif"); ?>",
                    imageBlank: "<?php print base_url("public/js-libs/lightbox/images/lightbox-blank.gif"); ?>"
                });
                var containers = ["header","body","footer"];
                for(var c in containers){
                    var container = containers[c];
                    var className = container+"-background-image";
            
                    if(container == "header"){
                        container = $("#header");
                    } else if (container == "body") {
                        container = $(document.body);
                    } else {
                        container = $("#footer");
                    }
            
                    var theDiv = container.children("."+className);
                                    
                    var theImg = theDiv.find("img");
                                    
                    var wDiv = theDiv.width();
                    var hDiv = theDiv.height();
                
                    var ratioDiv = wDiv/hDiv;
            
                    var wImg, hImg, ratioImg = theImg.data("ratio");
                    if(ratioImg > 0){
                        wImg = wDiv;
                        hImg = ratioImg/wImg;
                    } else {
                        wImg = hDiv*ratioImg;
                        hImg = hDiv;
                    }
            
                                    
                    if (ratioDiv < ratioImg) {
                        hImg = hDiv;
                        wImg = hDiv * ratioImg;
                    } else if (ratioDiv > ratioImg) {
                        wImg = wDiv;
                        hImg = wDiv / ratioImg;
                    } else {
                        wImg = wDiv;
                        hImg = hDiv;
                    }
                                    
                    theImg.css({
                        position: "absolute",
                        width: wImg,
                        height: hImg,
                        top: ((hDiv - hImg) / 2) + 'px', 
                        left: ((wDiv - wImg) / 2) + 'px'
                    });
                }
            });
        </script>

        <?php
        if (isset($head_includes, $head_includes["scripts"])):
            foreach ($head_includes["scripts"] as $element):
                ?>
                <script type="text/javascript" src="<?php print !stristr($element,"http")?base_url($element):$element;?>"></script>
                <?php
            endforeach;
        endif;
        ?>

    </head>
    <body>
        <?php
        if (isset($background['bodyImage']['image'])):
            ?>
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:1" class="body-background-image flexly-background-image">
                <img src="./images/<?php print $background['bodyImage']['image']; ?>" data-ratio="<?php print $background['bodyImage']['ratio'];?>"/>
            </div>
            <?php
        endif;
        ?>
        <div id="editor-area" style="width:100%;height:100%;">

            <div id="header" style="position:relative;<?php
        foreach ($background['header'] as $p => $v) {
            print $p . ":" . $v . ";";
        }
        ?>height:<?php print $height['header']; ?>px">
                 <?php
                 if (isset($background['headerImage']['image'])):
                     ?>
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1" class="header-background-image flexly-background-image">
                        <img src="./images/<?php print $background['headerImage']['image']; ?>" data-ratio="<?php print $background['headerImage']['ratio'];?>"/>
                    </div>
                    <?php
                endif;
                ?>
            </div>
            <div id="body" style="<?php
                foreach ($background['body'] as $p => $v) {
                    print $p . ":" . $v . ";";
                }
                ?>height:<?php print $content_height; ?>px">
            </div>
            <div id="footer"  style="position:relative;<?php
                 foreach ($background['footer'] as $p => $v) {
                     print $p . ":" . $v . ";";
                 }
                ?>height:<?php print $height['footer']; ?>px">
                 <?php
                 if (isset($background['footerImage']['image'])):
                     ?>
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1" class="footer-background-image flexly-background-image">
                        <img src="./images/<?php print $background['footerImage']['image']; ?>" data-ratio="<?php print $background['footerImage']['ratio'];?>">
                    </div>
                    <?php
                endif;
                ?>
            </div>

            <div id="container">
                <?php
                $containers = array("header", "body", "footer");
                foreach ($containers as $container):
                    ?>
                    <div id="<?php print $container; ?>-content" style="height:<?php print $container == "body" ? $content_height : $height[$container]; ?>px">
                        <?php
                        if (isset($components[$container])) {
                            foreach ($components[$container] as $component) {
                                print $component;
                            }
                        }
                        ?>
                    </div>
                    <?php
                endforeach;
                unset($components);
                ?>
            </div>
        </div>
    </body>
</html>