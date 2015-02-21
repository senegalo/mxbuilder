MXbuilder
=========

MXbuilder is an HTML5 website builder that lets you build your pages with draggable components on the client WYSIWYG style.
It enable users to easily edit the layout of their website and add dynamic features such as photo galleries, cliparts, facebook twitter and google plus social features, youtube videos.

Demo:
http://senegalo.com/mxbuilder

Installation Insturctions
=========================

Create a MySQL database and run the db_structure.sql script to create the tables.

Edit the following configuration files:

    application/config/config.phhp
    application/config/database.php
    public/js/config.js
  
Create 2 folders in for the uploads and published websites:

    public/uploads
    public/websites
  
Make sure your apache/nginx user is allowed to write files into those folder or else the uploads won't work.
