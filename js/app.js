var pdfUrl = window.pdfUrl;

if (!pdfUrl || pdfUrl.trim() === "") {
    document.addEventListener("DOMContentLoaded", function() {
        var loader = document.querySelector('.terminal-loader');
        if (loader) {
            loader.innerHTML = "<span style='color: #ff7b72;'>Error: Resume file not found.</span>";
            loader.style.color = "#ff7b72";
        }
    });
} else {
    var redirected = false;
    function redirectToPdf() {
        if (redirected) return;
        redirected = true;
        
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            var fullUrl = new URL(pdfUrl, window.location.href).href;
            var viewerUrl = "https://docs.google.com/viewer?url=" + encodeURIComponent(fullUrl) + "&embedded=true";
            document.body.innerHTML = '<iframe src="' + viewerUrl + '" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe>';
        } else {
            window.location.replace(pdfUrl);
        }
    }

    fetch(pdfUrl)
        .then(function(response) { return response.blob(); })
        .then(redirectToPdf)
        .catch(redirectToPdf);

    setTimeout(redirectToPdf, 6000);
}

document.addEventListener("DOMContentLoaded", function() {
    document.body.childNodes.forEach(function(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes("---")) {
            node.nodeValue = "";
        }
    });
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.history.back();
        
        var loader = document.querySelector('.terminal-loader');
        if (loader) {
            loader.innerHTML = "~ ./resume_fetched.sh<br><br><span style='font-size: 0.8em; color: #8b949e;'>Resume loaded. Click here to open again.</span>";
        }
    }
});
