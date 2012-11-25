<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="public/css/blitzer/jquery-ui-1.9.1.custom.css" type="text/css"/>
        <link rel="stylesheet" href="public/css/reset.css" type="text/css" />
        <link rel="stylesheet" href="public/css/flexly.css" type="text/css" />
        <link rel="stylesheet" href="public/css/menu-pages-tab.css" type="text/css" />
        <link rel="stylesheet" href="public/css/jquery.mCustomScrollbar.css" type="text/css" />
        <link rel="stylesheet" href="public/css/context-menu.css" type="text/css"/>
        <link rel="stylesheet" href="public/css/main.css" type="text/css"/>



        <title>Builder</title>
        <!-- Loading Libs -->
        <script type="text/javascript" src="public/js-libs/jquery-1.8.1.min.js"></script>
        <script type="text/javascript" src="public/js-libs/jquery-ui-1.9.2.custom.min.js"></script>
        <script type="text/javascript" src="public/js-libs/ckeditor/ckeditor.js"></script>
        <script type="text/javascript">
            CKEDITOR.disableAutoInline = true;
        </script>
        <script type="text/javascript" src="public/js-libs/plupload/plupload.full.js"></script>
        <script type="text/javascript" src="public/js-libs/jsdiff.js"></script>
        <script type="text/javascript" src="public/js-libs/jquery.mousewheel.min.js"></script>
        <script type="text/javascript" src="public/js-libs/jquery.mCustomScrollbar.js"></script>

        <!--Loading Framework-->
        <script type="text/javascript" src="public/js/mxbuilder.js"></script>
        <script type="text/javascript" src="public/js/config.js"></script>
        <script type="text/javascript" src="public/js/utils.js"></script>
        <script type="text/javascript" src="public/js/layout.js"></script>
        <script type="text/javascript" src="public/js/activestack.js"></script>
        <script type="text/javascript" src="public/js/ctx-menu.js"></script>
        <script type="text/javascript" src="public/js/page_manager.js"></script>
        <script type="text/javascript" src="public/js/components-instance-manager.js"></script>
        <script type="text/javascript" src="public/js/components-alignment.js"></script>
        <script type="text/javascript">
            mxBuilder.uploaderSettings = {
                runtimes : 'gears,html5,flash,silverlight,browserplus',
                browse_button : 'assets-select-files',
                container : 'assets-upload-container',
                max_file_size : '<?php print $upload_mb; ?>mb',
                url : mxBuilder.config.baseURL+'/assets/upload',
                flash_swf_url : 'js-libs/plupload/plupload.flash.swf',
                silverlight_xap_url : 'js-libs/plupload/plupload.silverlight.xap',
                filters : [{
                        title : "Image files", 
                        extensions : "jpg,jpeg,gif,png"
                    },
                    {
                        title : "Document files", 
                        extensions : "doc,docx,txt,pdf"
                    }]
            };
        </script>
        <script type="text/javascript" src="public/js/assets-manager.js"></script>
        <script type="text/javascript" src="public/js/selection.js"></script>
        <script type="text/javascript" src="public/js/components.js"></script>
        <script type="text/javascript" src="public/js/save.js"></script>
        <script type="text/javascript" src="public/js/publish.js"></script>
        <script type="text/javascript" src="public/js/z-index-manager.js"></script>
        <script type="text/javascript" src="public/js/api.js"></script>
        <script type="text/javascript" src="public/js/layout-background.js"></script>
        <script type="text/javascript" src="public/js/menu-manager.js"></script>

        <!--Loading Menu Tabs-->
        <script type="text/javascript" src="public/js/menu-tabs/pages.js"></script>
        <script type="text/javascript" src="public/js/menu-tabs/pages-add-edit.js"></script>


        <!--Loading Components-->
        <!--<script type="text/javascript" src="public/js/components/simple-div-component.js"></script>-->
        <script type="text/javascript" src="public/js/components/text-component.js"></script>
        <script type="text/javascript" src="public/js/components/box-component.js"></script>
        <script type="text/javascript" src="public/js/components/horizontal-line-component.js"></script>
        <script type="text/javascript" src="public/js/components/vertical-line-component.js"></script>
        <script type="text/javascript" src="public/js/components/strip-component.js"></script>
        <script type="text/javascript" src="public/js/components/image-component.js"></script>

        <!--Loading Dialogs-->
        <script type="text/javascript" src="public/js/dialogs/linkto.js"></script>
        <script type="text/javascript" src="public/js/dialogs/components-delete.js"></script>
        <script type="text/javascript" src="public/js/dialogs/components-border.js"></script>
        <script type="text/javascript" src="public/js/dialogs/components-background.js"></script>
        <script type="text/javascript" src="public/js/dialogs/image-component-settings.js"></script>
        <!--<script type="text/javascript" src="public/js/dialogs/pages-add-edit-dialog.js"></script>-->
        <script type="text/javascript" src="public/js/dialogs/alert-dialog.js"></script>
        <script type="text/javascript" src="public/js/dialogs/progress-dialog.js"></script>
        <script type="text/javascript" src="public/js/dialogs/asset-properties-dialog.js"></script>
        <script type="text/javascript" src="public/js/dialogs/image-default-properties-dialog.js"></script>

        <script type="text/javascript" src="public/js/init.js"></script>
    </head>
    <body>

        <!--        <div id="menu" style="border: 1px solid black;position:fixed;top:50%;left:10px;width:200px;height:300px;margin-top:-150px;z-index:30000009;background-color:#e4e4e4;">
                    <div class="menu-item">
                        <select id="website-pages" style="width:190px"></select>
                    </div>
                    <div id="add-page" class="menu-item" style="font-weight:bold;cursor:pointer">Add Page</div>
                    <div id="edit-page" class="menu-item" style="font-weight:bold;cursor:pointer">Edit Page</div>
                    <div id="delete-page" class="menu-item" style="font-weight:bold;cursor:pointer">Delete Page</div>
                    <div id="save" class="menu-item" style="font-weight:bold;cursor:pointer">Save</div>
                    <div id="publish" class="menu-item" style="font-weight:bold;cursor:pointer">Publish</div>
                    <div id="header-background" class="menu-item" style="font-weight:bold;cursor:pointer">Header Background</div>
                    <div id="body-background" class="menu-item" style="font-weight:bold;cursor:pointer">Body Background</div>
                    <div id="footer-background" class="menu-item" style="font-weight:bold;cursor:pointer">Footer Background</div>
                </div>-->

        <div class="flexly-main-bar">
            <div class="flexly-buttons">
                <div class="flexly-icon flexly-logo">
                </div>	


                <div class="flexly-sub-bar " style="margin-top:0px;">

                    <div class="flexly-icon flexly-icon-page flexly-button flexly-active-icon">
                    </div>

                    <div class="flexly-icon flexly-icon-wizard flexly-button flexly-active-icon">
                    </div>

                </div>

                <div class="flexly-sub-bar">

                    <div class="flexly-icon flexly-icon-photos flexly-button flexly-active-icon">
                    </div>

                    <div class="flexly-icon flexly-icon-clipart flexly-button flexly-active-icon">
                    </div>   

                    <div class="flexly-icon flexly-icon-docs flexly-button flexly-active-icon">
                    </div>       

                    <div class="flexly-icon flexly-icon-widgets flexly-button flexly-active-icon">
                    </div>                       

                </div>

                <div class="flexly-sub-bar">

                    <div class="flexly-icon flexly-icon-preview flexly-button flexly-active-icon">
                    </div>

                </div>

                <div class="flexly-sub-bar">

                    <div class="flexly-icon flexly-icon-settings flexly-button flexly-active-icon">
                    </div>    

                    <div class="flexly-icon flexly-icon-publish flexly-button flexly-active-icon">
                    </div>                      

                </div>   

            </div>     


            <div class="flexly-tab" style="display:none;">

                <div class="flexly-tab-content-border"></div>
                <div class="flexly-tab-header">
                    <div class="flexly-tab-title"></div>
                    <div class="flexly-icon flexly-icon-close-black flexly-tab-close"></div>
                    <div style="clear:both;"></div>
                </div>
                <div class="flexly-tab-content" style="text-align: justify;"></div>
                <div class="flexly-tab-footer"></div>
            </div>
            <div style="clear:both;"></div>
        </div>

        <div id="editor-area" style="width: 100%;height:100%;">
            <div id="header" style="height: 200px;width:100%;">

            </div>
            <div id="body" style="height: 300px;width:100%;">

            </div>
            <div id="footer" style="height: 200px;width:100%;">

            </div>
            <div id="container">
                <div id="header-content">
                    <div class="header-outline" style="position:relative;border:6px solid orange;height:100%;overflow: hidden;display:none;z-index:2000000;"></div>
                </div>
                <div id="body-content">
                    <div class="body-outline" style="position:relative;border:6px solid red;height:100%;overflow: hidden;display:none;z-index:2000000;"></div>
                </div>

                <div id="footer-content">
                    <div class="footer-outline" style="position:relative;border:6px solid orange;height:100%;overflow: hidden;display:none;z-index:2000000;"></div>
                </div>
            </div>
        </div>

        <div id="selection-safe">

        </div>

        <div id="templates" style="display:none;">

            <div class="save-tooltip" style="position:fixed;top:5px;left:5px;z-index:20000009;background-color:green;display:none;color:#ffffff;padding:10px;"></div>

            <div class="assets-properties-dialog">
                <label for="asset-name-input">Name:</label>
                <input type="text" id="asset-name-input"/>
            </div>

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
                    <div id="assets-images-container" style="height: 300px;overflow:auto;">
                        <div id="assets-images-insertion-marker" style="clear:both;"></div>
                    </div>
                    <div id="assets-document-container" style="height: 300px;overflow:auto;">
                        <div id="assets-document-insertion-marker" style="clear:both;"></div>
                    </div>
                </div>
            </div>

            <div class="image-component-instance">
                <div class="image"><img src="" alt="" title=""/></div>
            </div>

            <div class="assets-image-template" style="float:left;width:140px;height:120px;outline: 1px solid black;margin:10px;">
                <img src="" alt="" title="" style="margin-right:auto;margin-left:auto;display:block;margin-top:5px;"/>
                <div class="name"></div>
                <button class="delete-asset">Del.</button>
                <button class="edit-name">E.N</button>
                <button class="default-properties">Def.</button>
            </div>

            <div class="assets-document-template" style="float:left;width:120px;height:120px;outline: 1px solid black;margin:10px;">
                <img src="public/images/document.png" style="height:60px;width:auto;margin-right:auto;margin-left:auto;display:block;margin-top:5px;" alt="" title=""/>
                <div class="name"></div>
                <button class="delete-asset">Del.</button>
                <button class="edit-name">E.N</button>
            </div>

            <div class="image-default-properties-dialog">
                <div>
                    <label for="image-default-title">Default Title:</label>
                    <input type="text" id="image-default-title"/>
                </div>
                <div>
                    <label for="image-default-caption">Caption:</label>
                    <textarea id="image-default-caption" rows="8" cols="40"></textarea>
                </div>
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
                        <input type="radio" name="link_type" class="link-type" value="external" id="linkto-external">
                        <label for="linkto-external">External Link</label>
                    </div>
                    <div style="display:inline-block;">
                        <select id="linkto-protocol">
                            <option value="http://">http://</option>
                            <option value="https://">https://</option>
                        </select>
                        <input type="text" name="external_link" class="link-input"/>
                    </div>
                </div>
                <div>
                    <div style="display:inline-block;">
                        <input type="radio" name="link_type" class="link-type" value="page" id="linkto-page">
                        <label for="linkto-page">Link to a page</label>
                    </div>
                    <div style="display:inline-block;">
                        <select name="page" class="link-input">
                            <option value="">Select a page</option>
                        </select>
                    </div>
                </div>

                <div class="lightbox">
                    <input type="radio" name="link_type" class="link-type" value="lightbox" id="linkto-lightbox">
                    <label for="linkto-lightbox">Open in a Lightbox</label>
                </div>

                <div style="margin-top:6px;">
                    <input type="checkbox" id="linkto-new-window"/>
                    <label for="linkto-new-window">Open in a new window</label>
                </div>
            </div>

            <div class="pages-add-edit-tab">
                <ul class="form menu-form">
                    <li>
                        <label for="page-title">Page Title</label>
                        <input type="text" id="page-title"/>
                    </li>
                    <li>
                        <label for="page-html-title">Title bar Text</label>
                        <input type="text" id="page-html-title"/>
                    </li>
                    <li>
                        <label for="page-address">Page Address Name</label>
                        <input type="text" id="page-address"/>
                    </li>
                    <li>
                        <label for="page-desc">Page Description</label>
                        <textarea cols="20" rows="4" id="page-desc" style="width:244px;height:96px"></textarea>
                    </li>
                    <li>
                        <label for="page-keywords">Page Keywords</label>
                        <input type="text" id="page-keywords"/>
                    </li>
                    <li>
                        <input type="checkbox" id="page-show-in-menu" checked="checked"/>
                        <label for="page-show-in-menu" class="checkbox-label">Show in menu</label>
                    </li>
                    <li class="page-as-homepage">
                        <input type="checkbox" id="page-as-homepage" checked="checked"/>
                        <label for="page-as-homepage" class="checkbox-label">Set as homepage</label>
                    </li>
                    <li class="page-is-homepage" style="margin:6px 0 6px 0;">
                        <i>Current homepage</i>
                    </li>
                </ul>

            </div>
            <div class="box-component-instance" style="width:300px;height:200px;background-color:rgba(0,0,0,1);border-radius:6px;"></div>
            <div class="hline-component-instance" style="width:300px;height:1px;background-color:black;"></div>
            <div class="strip-component-instance" style="width:900px;height:100px;background-color:rgba(0,0,0,1)"></div>
            <div class="text-component-instance" style="width:300px;padding:5px;z-index:10000;">
                <div class="content" style="word-wrap: break-word;">
                    <h2>Paragraph title</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue nisi at turpis elementum convallis. Aenean congue mauris ac dolor rutrum bibendum. Fusce ornare euismod dignissim. Vestibulum posuere ultrices mi, id volutpat velit aliquet ornare. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eleifend condimentum adipiscing. Sed gravida, tellus id molestie tincidunt, odio velit facilisis metus, eu accumsan eros sapien vehicula enim.
                    </p>
                </div>
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
            <div class="progress-dialog">

            </div>
            <ul class="flexly-menu-pages-list">
                <li>
                    <div class="flexly-menu-pages-drag-handle">
                        <div class="flexly-icon flexly-icon-drag"></div>
                    </div>
                    <div class="flexly-menu-page-title"></div>
                    <div class="flexly-menu-page-controls" style="display:none;">
                        <div class="flexly-icon flexly-icon-close-black flexly-delete-page" style="display:inline-block;"></div>
                        <div class="flexly-icon flexly-icon-gear-black flexly-edit-page" style="display:inline-block;"></div>
                        <div class="flexly-icon flexly-icon-arrow-e-black flexly-goto-page" style="display:inline-block;"></div>
                    </div>
                    <div style="clear:both;"></div>
                </li>
            </ul>
        </div>

    </body>
</html>
