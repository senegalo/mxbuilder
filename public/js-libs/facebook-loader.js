(function($){
    
    window.fbAsyncInit = function(){
        FB.init({
            status     : false, // check the login status upon init?
            cookie     : false, // set sessions cookies to allow your server to access the session?
            xfbml      : false  // parse XFBML tags on this page?
        });
        $(document.body).trigger("fbReady");
    }
    
    $(function(){
        $(document.body).append('<div id="fb-root"></div>');
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/all.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
    
}(jQuery));