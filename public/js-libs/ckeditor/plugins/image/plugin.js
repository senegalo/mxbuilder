﻿/*
 Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
*/
(function(){function e(b,a){if(!a)var g=b.getSelection(),a=g.getType()==CKEDITOR.SELECTION_ELEMENT&&g.getSelectedElement();if(a&&a.is("img")&&!a.data("cke-realelement")&&!a.isReadOnly())return a}function f(b){var a=b.getStyle("float");if("inherit"==a||"none"==a)a=0;a||(a=b.getAttribute("align"));return a}CKEDITOR.plugins.add("image",{requires:"dialog",lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh",
icons:"image",init:function(b){CKEDITOR.dialog.add("image",this.path+"dialogs/image.js");b.addCommand("image",new CKEDITOR.dialogCommand("image"));b.ui.addButton&&b.ui.addButton("Image",{label:b.lang.common.image,command:"image",toolbar:"insert,10"});b.on("doubleclick",function(a){var b=a.data.element;b.is("img")&&(!b.data("cke-realelement")&&!b.isReadOnly())&&(a.data.dialog="image")});b.addMenuItems&&b.addMenuItems({image:{label:b.lang.image.menu,command:"image",group:"image"}});b.contextMenu&&b.contextMenu.addListener(function(a){if(e(b,
a))return{image:CKEDITOR.TRISTATE_OFF}})},afterInit:function(b){function a(a){var d=b.getCommand("justify"+a);if(d){if("left"==a||"right"==a)d.on("exec",function(d){var c=e(b),h;c&&(h=f(c),h==a?(c.removeStyle("float"),a==f(c)&&c.removeAttribute("align")):c.setStyle("float",a),d.cancel())});d.on("refresh",function(d){var c=e(b);c&&(c=f(c),this.setState(c==a?CKEDITOR.TRISTATE_ON:"right"==a||"left"==a?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED),d.cancel())})}}a("left");a("right");a("center");a("block")}})})();
CKEDITOR.config.image_removeLinkByEmptyURL=!0;