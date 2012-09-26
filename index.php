<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.8.23.custom.css" type="text/css"/>
        <link rel="stylesheet/less" href="css/reset.css" type="text/css" />
        <link rel="stylesheet/less" href="css/layout.css" type="text/css" />
        <link rel="stylesheet/less" href="css/theme-01.css" type="text/css" />
        <link rel="stylesheet/less" href="css/font-set-01.css" type="text/css" />
        <link rel="stylesheet/less" href="css/menu-set-01.css" type="text/css" />
        <link rel="stylesheet/less" href="css/website.css" type="text/css" />
        <link rel="stylesheet/less" href="css/webpage-01.css" type="text/css" />
        <link rel="stylesheet/less" href="css/context-menu.css" type="text/css"/>



        <title>Builder</title>

        <style>
            html {
                font-size: 12px;
            }
            .mx-component, .mx-component .content {
                outline: 0px solid transparent;
            }
            .ui-selected,.ui-selected:focus {
                outline: 1px dashed #444 !important;
            }

            #selection-container{
                outline: 1px solid orange;
                cursor: move;
            }

            .component-resizable-handle {
                display:none;
            }
            .ui-resizable-handle {
                background-color: #333;
                outline: 1px solid white;
            }

            .ui-resizable-handle-resizing, .ui-resizable-handle:hover {
                background-color: grey;
            }

            .component-menu-buttons {
                position: absolute;
                top: -20px;
            }

            .ui-resizable-n { cursor: n-resize; height: 7px; width: 7px; top: -6px; left: 50%; }
            .ui-resizable-s { cursor: s-resize; height: 7px; width: 7px; bottom: -6px; left: 50%; }
            .ui-resizable-e { cursor: e-resize; width: 7px; right: -6px; top: 49%; height: 7px; }
            .ui-resizable-w { cursor: w-resize; width: 7px; left: -6px; top: 49%; height: 7px; }
            .ui-resizable-se { cursor: se-resize; width: 7px; height: 7px; right: -6px; bottom: -6px; }
            .ui-resizable-sw { cursor: sw-resize; width: 7px; height: 7px; left: -6px; bottom: -6px; }
            .ui-resizable-nw { cursor: nw-resize; width: 7px; height: 7px; left: -6px; top: -6px; }
            .ui-resizable-ne { cursor: ne-resize; width: 7px; height: 7px; right: -6px; top: -6px;}

            .ui-selectable-helper {z-index: 10000009; }
            .ui-state-disabled {opacity: 1; filter:Alpha(Opacity=100);}

            .menu-item {
                margin:6px;
                display-type: inline-block;
            }
            
            .cke {
                z-index: 100000;
            }

            #header,#body,#footer {
                outline: 1px dashed #00dbff;
            }


        </style>

        <script type="text/javascript" src="js-libs/less.js"></script>
        <script type="text/javascript" src="js-libs/jquery-1.8.1.min.js"></script>
        <script type="text/javascript" src="js-libs/jquery-ui-1.8.23.custom.min.js"></script>
        <script type="text/javascript" src="js-libs/ckeditor/ckeditor.js"></script>
        <script type="text/javascript">
            CKEDITOR.disableAutoInline = true;
        </script>

        <script type="text/javascript" src="js/mxbuilder.js"></script>
        <script type="text/javascript" src="js/utils.js"></script>
        <script type="text/javascript" src="js/layout.js"></script>
        <script type="text/javascript" src="js/activestack.js"></script>
        <script type="text/javascript" src="js/ctx-menu.js"></script>
        <script type="text/javascript" src="js/components-instance-manager.js"></script>
        <script type="text/javascript" src="js/selection.js"></script>
        <script type="text/javascript" src="js/components.js"></script>
        <script type="text/javascript" src="js/simple-div-component.js"></script>
        <script type="text/javascript" src="js/text-component.js"></script>
        <script type="text/javascript" src="js/box-component.js"></script>
        
        <script type="text/javascript" src="js/dialogs/linkto.js"></script>
        <script type="text/javascript" src="js/dialogs/components-delete.js"></script>
        <script type="text/javascript" src="js/dialogs/components-border.js"></script>
        <script type="text/javascript" src="js/dialogs/components-background.js"></script>

        <script type="text/javascript" src="js/init.js"></script>
    </head>
    <body>
        
        <div id="menu" style="border: 1px solid black;position:fixed;top:50%;left:10px;width:100px;height:200px;margin-top:-100px;z-index:10000009"></div>
        <div id="header" style="height: 100px;" ></div>        
        <div id="body" style="height: 300px;"></div>
        <div id="footer" style="height: 100px;" ></div>


        <div id="container">

            

            <div id="header-content">
                <div class="an-item strip" style="background-color:#333;width:100%;height:100px;"></div>
                <h1 id="site-title" class="an-item site-title">Lawyer & Lawyer</h1>
                <div class="an-item slogan" id="slogan">attorneys at law</div>

                <div class="an-item menu" id="menu01">

                    <a class="menu-item" href="index.html">Home</a>
                    <a class="menu-item" href="about.html">About</a>
                    <a class="menu-item" href="contact.html">Contact</a>

                </div>

            </div>
            <div id="body-content">
<!--                <div class="an-item" style="height:384px;width:980px;">
                    <img id="img01" src="images/img01l.jpg"  />
                </div>-->


                <div class="an-item p" id="p01">
                    <span class="p-title">Hello world</span>
                    I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font.
                    I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font.

                </div>

                <div class="an-item p" id="p02">
                    <span class="p-title">About ...</span>
                    I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font.
                    I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font.

                </div>

                <div class="an-item box" id="box01">
                </div>

                <div class="an-item p" id="p03">
                    <span style="color:white">
                        I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text”.
                    </span>
                </div>

                <a href="#" id="b01" class="an-item button">
                    MORE
                </a>

            </div>

            <div id="footer-content">
                <div class="an-item strip" style="background-color:#333;width:100%;height:100px;top:768px;"></div>
                <div class="an-item footer-text" id="footer1">© 2012 by Lawyer & Lawyer.</div>
                <div class="an-item footer-text" id="footer2"><a href="#"> Contact US</div>
            </div>
        </div>
    </body>
</html>
