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

        </style>

        <?php
        if (isset($head_includes, $head_includes["css"])):
            foreach ($head_includes["css"] as $element):
                ?>
                <link href="<?php print base_url($element); ?>" media="screen" rel="stylesheet" type="text/css" />
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
            });
        </script>

        <?php
        if (isset($head_includes, $head_includes["scripts"])):
            foreach ($head_includes["scripts"] as $element):
                ?>
                <script type="text/javascript" src="<?php print base_url($element); ?>"></script>
                <?php
            endforeach;
        endif;
        ?>

    </head>
    <body>

        <div id="editor-area" style="width:100%;height:100%;">

            <div id="header" style="<?php
        foreach ($background['header'] as $p => $v) {
            print $p . ":" . $v . ";";
        }
        ?>height:<?php print $height['header']; ?>px">
            </div>
            <div id="body" style="<?php
                 foreach ($background['body'] as $p => $v) {
                     print $p . ":" . $v . ";";
                 }
        ?>height:<?php print $content_height; ?>px">
            </div>
            <div id="footer"  style="<?php
                 foreach ($background['footer'] as $p => $v) {
                     print $p . ":" . $v . ";";
                 }
        ?>height:<?php print $height['footer']; ?>px">
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