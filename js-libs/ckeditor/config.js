/**
 * Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.stylesSet.add( 'mx_styles',
[
    // Block-level styles
    { name : 'Blue Title', element : 'h2', styles : { 'color' : 'Blue' } },
    { name : 'Red Title' , element : 'h3', styles : { 'color' : 'Red' } },
 
    // Inline styles
    { name : 'CSS Style', element : 'span', attributes : { 'class' : 'my_style' } },
    { name : 'Marker: Yellow', element : 'span', styles : { 'background-color' : 'Yellow' } }
]);

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    
    config.extraPlugins = "customlink";
    
    
    config.toolbar = [['Styles'], 
        ['TextColor'],
        ['Bold', 'Italic', 'Underline','-', 'RemoveFormat'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl'],
        ['NumberedList', 'BulletedList','-' , '-', 'LinkExtra', 'Unlink']]; 
    
    config.stylesSet = "mx_styles";
    
};