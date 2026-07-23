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
            
            document.body.innerHTML = '<div id="pdf-container" style="width: 100%; display: flex; flex-direction: column; align-items: center; background-color: #525659; overflow-y: auto; height: 100vh; padding-top: 10px;"></div>';
            var container = document.getElementById('pdf-container');
            
            var loadingTask = pdfjsLib.getDocument(fullUrl);
            loadingTask.promise.then(function(pdf) {
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    let wrapper = document.createElement('div');
                    wrapper.style.width = "95%";
                    wrapper.style.maxWidth = "800px";
                    wrapper.style.marginBottom = "10px";
                    container.appendChild(wrapper);
                    
                    pdf.getPage(pageNum).then(function(page) {
                        var scale = window.devicePixelRatio || 1.5;
                        var viewport = page.getViewport({scale: scale});
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        canvas.style.width = "100%";
                        canvas.style.boxShadow = "0 4px 8px rgba(0,0,0,0.5)";
                        
                        wrapper.appendChild(canvas);
                        
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                }
            }).catch(function(error) {
                console.error("PDF.js Error: ", error);
                window.location.replace(pdfUrl); // fallback
            });
            
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
