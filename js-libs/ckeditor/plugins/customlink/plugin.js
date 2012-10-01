CKEDITOR.plugins.add('customlink',{
    init: function(editor)
    {
        var pluginName = 'customlink';
            
        editor.addCommand(pluginName, {
            exec: function(editor){
                mxBuilder.dialogs.linkto.show({
                    link: function(url){
                        editor.focus();
                        var style = new CKEDITOR.style({
                            element: 'a',
                            attributes: {
                                href: url
                            }
                        });
                        style.type = CKEDITOR.STYLE_INLINE;
                        style.apply(editor);
                    }
                });
            }
        });
            
        editor.ui.addButton('LinkExtra',
        {
            label: 'Link to internal or external page',
            command: pluginName
        });
    }
});