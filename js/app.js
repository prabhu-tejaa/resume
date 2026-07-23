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
                
                // Create floating download button
                var downloadBtn = document.createElement('a');
                downloadBtn.href = pdfUrl;
                downloadBtn.download = "Resume.pdf";
                downloadBtn.style.position = "fixed";
                downloadBtn.style.bottom = "25px";
                downloadBtn.style.right = "25px";
                downloadBtn.style.backgroundColor = "#2ea043";
                downloadBtn.style.color = "white";
                downloadBtn.style.width = "56px";
                downloadBtn.style.height = "56px";
                downloadBtn.style.borderRadius = "28px";
                downloadBtn.style.display = "flex";
                downloadBtn.style.justifyContent = "center";
                downloadBtn.style.alignItems = "center";
                downloadBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
                downloadBtn.style.zIndex = "999999";
                downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
                
                document.body.appendChild(downloadBtn);
                
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
