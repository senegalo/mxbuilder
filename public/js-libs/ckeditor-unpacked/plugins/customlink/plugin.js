CKEDITOR.plugins.add('customlink',{
    init: function(editor)
    {
        var pluginName = 'customlink';
            
        editor.addCommand(pluginName, {
            exec: function(editor){
                CKEDITOR.plugins.customlink.openDialog(editor);
            }
        });
            
        if ( editor.ui.addButton ) {
            editor.ui.addButton('LinkExtra', {
                label: 'Link to internal or external page',
                command: pluginName
            });
        }
    }
});

CKEDITOR.plugins.customlink = {
    __currentElement: null,
    getSelectedLink: function( editor ) {
        var selection = editor.getSelection();
        var selectedElement = selection.getSelectedElement();
        if ( selectedElement && selectedElement.is( 'a' ) )
            return selectedElement;

        var range = selection.getRanges( true )[ 0 ];
        range.shrink( CKEDITOR.SHRINK_TEXT );
        return editor.elementPath( range.getCommonAncestor() ).contains( 'a', 1 );
    },
    openDialog: function(editor){
        var element = CKEDITOR.plugins.customlink.getSelectedLink( editor );
        if ( element && !element.isReadOnly() ) {
            if ( element.is( 'a' ) ) {
                this.__currentElement = element;
                var  urlObj  = {
                    type: element.getAttribute("data-type")
                }
                if(urlObj.type == "page"){
                    urlObj.pageID = element.getAttribute("data-url");
                } else {
                    urlObj.url = element.getAttribute("data-url");
                }
            }
        }
        
        mxBuilder.dialogs.linkTo.show({
            urlObj: urlObj,
            link: function(urlObj){
                var selection = editor.getSelection();
                var element = CKEDITOR.plugins.customlink.__currentElement;
                if(!element){
                    var ranges = selection.getRanges( true );
                    if ( ranges.length == 1 && ranges[ 0 ].collapsed ) {
                        var urlText = urlObj.type != "page" ? urlObj.url : mxBuilder.pages.getPageObj(urlObj.pageID).title;
                        var text = new CKEDITOR.dom.text( urlText , editor.document );
                        ranges[ 0 ].insertNode( text );
                        ranges[ 0 ].selectNodeContents( text );
                        selection.selectRanges( ranges );
                    }
                    var style = new CKEDITOR.style({
                        element: 'a',
                        attributes: {
                            href: "javascript:void(0);",
                            "data-url": urlObj.type == "page" ? urlObj.pageID : urlObj.url,
                            "data-type": urlObj.type,
                            "class": "inline-links"
                        }
                    });
                    style.type = CKEDITOR.STYLE_INLINE;
                    style.apply(editor);
                } else {
                    element.setAttributes({
                        "data-type": urlObj.type,
                        "data-url": urlObj.type == "page" ? urlObj.pageID : urlObj.url
                    });                  
                    //selection.selectElement(element);
                }
            },
            unlink: function(){
                var style = new CKEDITOR.style( {
                    element:'a',
                    type:CKEDITOR.STYLE_INLINE,
                    alwaysRemoveElement:1
                } );
                editor.removeStyle( style );
            },
            close: function(){
                console.log("All Done...");
                editor.focus();
                CKEDITOR.plugins.customlink.__currentElement = false;
            }
        });
    }
}