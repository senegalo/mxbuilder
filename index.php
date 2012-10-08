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
                overflow-x: hidden;
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
            .ui-resizable-se { cursor: se-resize; width: 7px; height: 7px; right: 0px; bottom: 0px; }
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
        <!-- Loading Libs -->
        <script type="text/javascript" src="js-libs/less.js"></script>
        <script type="text/javascript" src="js-libs/jquery-1.8.1.min.js"></script>
        <script type="text/javascript" src="js-libs/jquery-ui-1.8.23.custom.min.js"></script>
        <script type="text/javascript" src="js-libs/ckeditor/ckeditor.js"></script>
        <script type="text/javascript">
            CKEDITOR.disableAutoInline = true;
        </script>
        <script type="text/javascript" src="js-libs/plupload/plupload.full.js"></script>

        <!--Loading Framework-->
        <script type="text/javascript" src="js/mxbuilder.js"></script>
        <script type="text/javascript" src="js/utils.js"></script>
        <script type="text/javascript" src="js/layout.js"></script>
        <script type="text/javascript" src="js/activestack.js"></script>
        <script type="text/javascript" src="js/ctx-menu.js"></script>
        <script type="text/javascript" src="js/page_manager.js"></script>
        <script type="text/javascript" src="js/components-instance-manager.js"></script>
        <script type="text/javascript" src="js/components-alignment.js"></script>
        <script type="text/javascript" src="js/assets-manager.js"></script>
        <script type="text/javascript" src="js/selection.js"></script>
        <script type="text/javascript" src="js/components.js"></script>

        <!--Loading Components-->
        <script type="text/javascript" src="js/simple-div-component.js"></script>
        <script type="text/javascript" src="js/text-component.js"></script>
        <script type="text/javascript" src="js/box-component.js"></script>
        <script type="text/javascript" src="js/horizontal-line-component.js"></script>
        <script type="text/javascript" src="js/vertical-line-component.js"></script>
        <script type="text/javascript" src="js/strip-component.js"></script>
        <script type="text/javascript" src="js/image-component.js"></script>

        <!--Loading Dialogs-->
        <script type="text/javascript" src="js/dialogs/linkto.js"></script>
        <script type="text/javascript" src="js/dialogs/components-delete.js"></script>
        <script type="text/javascript" src="js/dialogs/components-border.js"></script>
        <script type="text/javascript" src="js/dialogs/components-background.js"></script>
        <script type="text/javascript" src="js/dialogs/image-component-settings.js"></script>
        <script type="text/javascript" src="js/dialogs/pages-add-edit-dialog.js"></script>
        <script type="text/javascript" src="js/dialogs/alert-dialog.js"></script>

        <script type="text/javascript" src="js/init.js"></script>
    </head>
    <body>

        <div id="menu" style="border: 1px solid black;position:fixed;top:50%;left:10px;width:200px;height:250px;margin-top:-125px;z-index:10000009;background-color:#e4e4e4;">
            <div class="menu-item">
                <select id="website-pages" style="width:190px"></select>
            </div>
            <div id="add-page" class="menu-item" style="font-weight:bold;cursor:pointer">Add Page</div>
            <div id="edit-page" class="menu-item" style="font-weight:bold;cursor:pointer">Edit Page</div>
            <div id="delete-page" class="menu-item" style="font-weight:bold;cursor:pointer">Delete Page</div>
        </div>

        <div id="editor-area" style="width: 100%;height:100%;">
            <div id="header" style="height: 100px;" ></div>        
            <div id="body" style="height: 300px;"></div>
            <div id="footer" style="height: 100px;" ></div>
            <div id="container">
                <div id="header-content">
                    <!--                <div class="an-item strip" style="background-color:#333;width:100%;height:100px;"></div>
                                    <h1 id="site-title" class="an-item site-title">Lawyer & Lawyer</h1>
                                    <div class="an-item slogan" id="slogan">attorneys at law</div>
                    
                                    <div class="an-item menu" id="menu01">
                    
                                        <a class="menu-item" href="index.html">Home</a>
                                        <a class="menu-item" href="about.html">About</a>
                                        <a class="menu-item" href="contact.html">Contact</a>
                    
                                    </div>-->

                </div>
                <div id="body-content">
                    <!--                <div class="an-item" style="height:384px;width:980px;">
                                        <img id="img01" src="images/img01l.jpg"  />
                                    </div>-->


                    <!--                <div class="an-item p" id="p01">
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
                                    </a>-->

                </div>

                <div id="footer-content">
                    <!--                <div class="an-item strip" style="background-color:#333;width:100%;height:100px;top:768px;"></div>
                                    <div class="an-item footer-text" id="footer1">© 2012 by Lawyer & Lawyer.</div>
                                    <div class="an-item footer-text" id="footer2"><a href="#"> Contact US</div>-->
                </div>
            </div>
        </div>

        <div id="selection-safe">

        </div>

        <div id="templates" style="display:none;">

            <div class="assets-upload-dialog">
                <div id="assets-upload-container">
                    <a href="javascript:void(0);" id="assets-select-files">[select files]</a>
                    <a href="javascript:void(0);" id="assets-upload-files">[upload files]</a>
                </div>
                <hr/>
                <div id="assets-upload-files-info"></div>
                <hr/>

                <div class="assets-tabs">
                    <ul>
                        <li><a href="#assets-images-container">Images</a></li>
                        <li><a href="#assets-document-container">Documents</a></li>
                    </ul>
                    <div id="assets-images-container"></div>
                    <div id="assets-document-container"></div>
                    <div style="clear:both;"></div>
                </div>
            </div>

            <div class="image-component-instance" style="z-index:10000000000;">
                <img src="" alt="" title=""/>
                <div class="caption"></div>
            </div>

            <div class="assets-image-template" style="float:left;width:100px;height:100px;margin:10px;">
                <img src="" alt="" title=""/>
                <div class="name"></div>
                <button class="delete-asset">Delete</button>
            </div>

            <div class="assets-document-template" style="float:left;width:100px;height:100px;margin:10px;">
                <img src="images/document.png" style="height:60px;width:auto;" alt="" title=""/>
                <div class="name"></div>
                <button class="delete-asset">Delete</button>
            </div>

            <div class="image-component-chtitle-dialog">
                <div>
                    <label for="image-component-settings-title">Title:</label>
                    <input type="text" id="image-component-settings-title"/>
                </div>
            </div>

            <div class="component-border-dialog">
                <div class="component-sim" style="margin-right:auto;margin-left:auto;text-align:center;height:135px">
                    <div data-sim="1001" style="border-width: 3px 0px 0px 3px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div>
                    <div data-sim="1100" style="border-width: 3px 3px 0px 0px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div><br/>
                    <div data-sim="0011" style="border-width: 0px 0px 3px 3px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div>
                    <div data-sim="0110" style="border-width: 0px 3px 3px 0px;border-style: solid;border-color:black;display:inline-block;width:20px;height:20px;margin:10px;"></div>
                </div>

                <div style="margin-bottom: 10px;">
                    <label for="component-border-corner-radius">Corners:</label>
                    <input type="number" id="component-border-corner-radius" min="0" max="20" style="width:33px;"/> px
                    <div class="corner-slider"></div>
                </div>

                <div style="margin-bottom: 10px;">
                    <label for="component-border-width">Width:</label>
                    <input type="number" id="component-border-width" min="0" max="20" style="width:33px;"/> px
                    <div class="border-width"></div>
                </div>

                <div style="margin-bottom: 10px;">
                    <label for="component-border-color">Color:</label>
                    <input type="text" id="component-border-color"/>
                </div>

                <div style="margin-bottom: 10px;">
                    <label for="component-border-color">Opacity:</label>
                    <input type="number" min="0" max="100" step="1" id="component-border-opacity"/>%
                </div>
            </div>

            <div class="linkto-dialog">
                <div>
                    <div style="display:inline-block;">
                        <input type="radio" name="link_type" value="external" id="linkto-external">
                        <label for="linkto-external">External Link</label>
                    </div>
                    <div style="display:inline-block;">
                        http://<input type="text" name="external_link"/>
                    </div>
                </div>
                <div>
                    <div style="display:inline-block">
                        <input type="radio" name="link_type" value="email" id="linkto-email">
                        <label for="linkto-external">Email</label>
                    </div>
                    <div style="display:inline-block">
                        <input type="text" name="email"/>
                    </div>
                </div>
                <div>
                    <div style="display:inline-block;">
                        <input type="radio" name="link_type" value="page" id="linkto-page">
                        <label for="linkto-external">Link to a page</label>
                    </div>
                    <div style="display:inline-block;">
                        <select name="page">
                            <option value="">Select a page</option>
                        </select>
                    </div>
                </div>
                <div>
                    <input type="radio" name="link_type" value="lightbox" id="linkto-lightbox">
                    <label for="linkto-external">Open in a Lightbox</label>
                </div>
            </div>
            <div class="pages-add-edit-dialog">
                <div>
                    <label for="page-title">Title:</label>
                    <input type="text" id="page-title"/>
                </div>
                <div>
                    <label for="page-html-title">HTML Title:</label>
                    <input type="text" id="page-html-title"/>
                </div>
                <div>
                    <label for="page-parent">Parent Page: </label>
                    <select id="page-parent">

                    </select>
                </div>
                <div>
                    <label for="page-show-in-menu">Show in menu:</label>
                    <input type="checkbox" id="page-show-in-menu" checked="checked"/>
                </div>
                <div>
                    <label for="page-address">Address:</label>
                    <input type="text" name="page-address"/>
                </div>
                <div>
                    <label for="page-desc">Description</label>
                    <input type="text" id="page-desc"/>
                </div>
                <div>
                    <label for="page-keywords">Keywords</label>
                    <input type="text" id="page-keywords"/>
                </div>
            </div>
            <div class="box-component-instance" style="width:300px;height:200px;background-color:rgba(0,0,0,1);border-radius:6px;"></div>
            <div class="hline-component-instance" style="width:300px;height:1px;background-color:black;"></div>
            <div class="simple-div" style="height:100px;width:400px;padding:5px;overflow:hidden;z-index:10000;">
                I’ve had to work with jQuery UI’s Resizable plugin on a recent project.  I wanted to use custom handles to drag the element for resize, but the documentation page is a bit sparse when it comes to specifying a DOM Element to use for your custom handle.  For the sanity of others, here is the correct syntax to use when trying to add a custom handle to the jQuery UI Resize plugin.
            </div>
            <div class="strip-component-instance" style="width:900px;height:200px;background-color:rgba(0,0,0,1)"></div>
            <div class="text-component-instance" style="width:300px;padding:5px;z-index:10000;">
                <div class="content" style="word-wrap: break-word;">I’ve had to work with jQuery UI’s Resizable plugin on a recent project.  I wanted to use custom handles to drag the element for resize, but the documentation page is a bit sparse when it comes to specifying a DOM Element to use for your custom handle.  For the sanity of others, here is the correct syntax to use when trying to add a custom handle to the jQuery UI Resize plugin.</div>
            </div>
            <div class="vline-component-instance" style="height:200px;width:1px;background-color:black;"></div>
            <div class="alert-dialog"></div>
            <div class="component-background-dialog">
                <div style="margin-bottom: 10px;">
                    <label for="component-border-color">Color:</label>
                    <input type="text" id="component-background-color"/>
                </div>

                <div style="margin-bottom: 10px;">
                    <label for="component-border-color">Opacity:</label>
                    <input type="number" min="0" max="100" step="1" id="component-background-opacity"/>%
                </div>

            </div>
        </div>

    </body>
</html>
