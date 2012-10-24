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
                element = $(element.$);
                var  urlObj  = {
                    type: element.data("type"),
                    url: element.data("url")
                }
            }
        }
        
        mxBuilder.dialogs.linkTo.show({
            urlObj: urlObj,
            link: function(urlObj){
                var style = new CKEDITOR.style({
                    element: 'a',
                    attributes: {
                        href: "javascript:void(0);",
                        "data-url": urlObj.url,
                        "data-type": urlObj.type
                    }
                });
                style.type = CKEDITOR.STYLE_INLINE;
                style.apply(editor);
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
                editor.focus();
            }
        });
    }
}