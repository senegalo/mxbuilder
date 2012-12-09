(function($){
    $(function(){
        var logo = $("#flexly-logo");
        var notificationContainer = $("#flexly-notification-container");
        var canvas = notificationContainer.find(".flexly-notification-canvas");
        
        var canvasSize = {
            width: canvas.width(),
            height: canvas.height()
        }
        var context = canvas.get(0).getContext('2d');
        
        notificationContainer.hide();
        
        mxBuilder.notifications = {
            resetUploadProgress: function resetUploadProgress(){
                context.clearRect(0, 0, canvasSize.width, canvasSize.height);
                context.lineWidth = 4;
                
                context.beginPath();
                context.arc(canvasSize.width/2, canvasSize.height/2, (canvasSize.width-8)/2, 0, 2*Math.PI, true);
                context.closePath();
                context.strokeStyle = "rgba(255,255,255,0.2)";
                context.stroke();      
            },
            uploadProgress: function uploadProgress(totalPercentage,filesCompleted,totalFiles){
                notificationContainer.show();
                logo.hide();
                this.resetUploadProgress();
                
                //First the Progress Circle
                var endAngle = 2*Math.PI*totalPercentage/100;
                
                context.beginPath();
                
                context.arc(canvasSize.width/2, canvasSize.height/2, (canvasSize.width-8)/2, 0, endAngle, false);
                
                context.strokeStyle = "#f7931e";
                context.stroke();
                
                context.font = 'normal 10px Sans-Serif';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = '#f2f2f2';
                context.fillText(filesCompleted+"/"+totalFiles,canvasSize.width/2,canvasSize.height/2);
                
            },
            setIdleState: function setIdleState() {
                context.clearRect(0, 0, canvasSize.width, canvasSize.height);
                notificationContainer.hide();
                logo.show();
            }
        }
        
    });
}(jQuery))