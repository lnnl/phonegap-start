// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

var gScore = 0;

(function () {
    "use strict";

    // for use unchanged on the web
    if (window.WinJS) {

        WinJS.Binding.optimizeBindingReferences = true;

        var app = WinJS.Application;
        var activation = Windows.ApplicationModel.Activation;

        app.onactivated = function (args) {
            if (args.detail.kind === activation.ActivationKind.launch) {
                if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                    // TODO: This application has been newly launched. Initialize
                    // your application here.

                    // we could make the game init here instead

                } else {
                    // TODO: This application has been reactivated from suspension.
                    // Restore application state here.

                    // we could unpause the game here?

                }
                args.setPromise(WinJS.UI.processAll());
            }
        };

        app.oncheckpoint = function (args) {
            // TODO: This application is about to be suspended. Save any state
            // that needs to persist across suspensions here. You might use the
            // WinJS.Application.sessionState object, which is automatically
            // saved and restored across suspension. If you need to complete an
            // asynchronous operation before your application is suspended, call
            // args.setPromise().

            // we could pause the game here

        };

        var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dtm.ondatarequested = function (e) {
            e.request.data.properties.title = "GameName";

            var applicationData = Windows.Storage.ApplicationData.current;
            var localFolder = applicationData.localFolder;
            var Imaging = Windows.Graphics.Imaging;

            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            var stream = null;
            localFolder.createFileAsync("screen.png", Windows.Storage.CreationCollisionOption.replaceExisting)
            .then(function (x)
            {
                return x.openAsync(Windows.Storage.FileAccessMode.readWrite);
            })
            .then(function (x)
            {
                stream = x;
                return Imaging.BitmapEncoder.createAsync(Imaging.BitmapEncoder.pngEncoderId, x);
            })
            .then(function (x)
            {
                x.setPixelData(Imaging.BitmapPixelFormat.rgba8, Imaging.BitmapAlphaMode.straight, canvas.width, canvas.height, 96, 96, new Uint8Array(imgData.data));
                return x.flushAsync();
            })
            .done(function ()
            {
                stream.close();
            });

            //var img = "ms-appx:///images/SplashScreen.png";
            var img = "ms-appdata:///local/screen.png";
            var html = "<div><img src='" + img + "'/><p>I just achieved a high score of " + gScore + " in this game.</p></div>";
            var htmlFormat = Windows.ApplicationModel.DataTransfer.HtmlFormatHelper.createHtmlFormat(html);
            e.request.data.setHtmlFormat(htmlFormat);
            var reference = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(new Windows.Foundation.Uri(img));
            e.request.data.resourceMap[img] = reference;
        };

        app.start();

    }

})();
