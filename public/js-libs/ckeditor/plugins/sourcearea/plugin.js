﻿/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
*/
(function(){CKEDITOR.plugins.add("sourcearea",{lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh",icons:"source,source-rtl",init:function(a){function d(){this.hide();this.setStyle("height",this.getParent().$.clientHeight+"px");this.setStyle("width",this.getParent().$.clientWidth+"px");this.show()}if(a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE){var e=
CKEDITOR.plugins.sourcearea;a.addMode("source",function(e){var b=a.ui.space("contents").getDocument().createElement("textarea");b.setStyles(CKEDITOR.tools.extend({width:CKEDITOR.env.ie7Compat?"99%":"100%",height:"100%",resize:"none",outline:"none","text-align":"left"},CKEDITOR.tools.cssVendorPrefix("tab-size",a.config.sourceAreaTabSize||4)));b.setAttribute("dir","ltr");b.addClass("cke_source cke_reset cke_enable_context_menu");a.ui.space("contents").append(b);b=a.editable(new c(a,b));b.setData(a.getData(1));
CKEDITOR.env.ie&&(b.attachListener(a,"resize",d,b),b.attachListener(CKEDITOR.document.getWindow(),"resize",d,b),CKEDITOR.tools.setTimeout(d,0,b));a.fire("ariaWidget",this);e()});a.addCommand("source",e.commands.source);a.ui.addButton&&a.ui.addButton("Source",{label:a.lang.sourcearea.toolbar,command:"source",toolbar:"mode,10"});a.on("mode",function(){a.getCommand("source").setState("source"==a.mode?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF)})}}});var c=CKEDITOR.tools.createClass({base:CKEDITOR.editable,
proto:{setData:function(a){this.setValue(a);this.editor.fire("dataReady")},getData:function(){return this.getValue()},insertHtml:function(){},insertElement:function(){},insertText:function(){},setReadOnly:function(a){this[(a?"set":"remove")+"Attribute"]("readOnly","readonly")},detach:function(){c.baseProto.detach.call(this);this.clearCustomData();this.remove()}}})})();
CKEDITOR.plugins.sourcearea={commands:{source:{modes:{wysiwyg:1,source:1},editorFocus:!1,readOnly:1,exec:function(c){"wysiwyg"==c.mode&&c.fire("saveSnapshot");c.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);c.setMode("source"==c.mode?"wysiwyg":"source")},canUndo:!1}}};