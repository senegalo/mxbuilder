CKEDITOR.plugins.add('customlink',{
    init: function(editor)
    {
        var pluginName = 'customlink';
            
        editor.addCommand(pluginName, {
            exec: function(editor){
                mxBuilder.dialogs.linkto.show("cke",editor);
            }
        });
            
        editor.ui.addButton('LinkExtra',
        {
            label: 'Link to internal or external page',
            command: pluginName
        });
    }
});