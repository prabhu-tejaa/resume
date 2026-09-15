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
    var cachedBlob = null;

    function redirectToPdf() {
        if (redirected) return;
        redirected = true;
        
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
                
                // Derive clean filename
                var filename = "Prabhu_Teja_Resume.pdf";
                if (pdfUrl) {
                    var cleanUrl = pdfUrl.split('?')[0].split('#')[0];
                    var parts = cleanUrl.split('/');
                    var last = parts[parts.length - 1];
                    if (last && last.toLowerCase().endsWith('.pdf')) {
                        filename = decodeURIComponent(last);
                    }
                }

                function triggerBlobDownload(blob) {
                    try {
                        // Using application/octet-stream forces iOS Safari and other mobile browsers
                        // to trigger the native download manager rather than an inline viewer tab.
                        var octetBlob = new Blob([blob], { type: 'application/octet-stream' });
                        var blobUrl = URL.createObjectURL(octetBlob);
                        var a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = filename;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function() {
                            if (a.parentNode) a.parentNode.removeChild(a);
                            URL.revokeObjectURL(blobUrl);
                        }, 4000);
                    } catch (e) {
                        console.error("Blob download failed:", e);
                        window.location.href = pdfUrl;
                    }
                }

                // Create floating download button
                var downloadBtn = document.createElement('a');
                downloadBtn.href = pdfUrl;
                downloadBtn.download = filename;
                downloadBtn.setAttribute('aria-label', 'Download Resume');
                downloadBtn.title = "Download Resume";
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
                downloadBtn.style.cursor = "pointer";
                downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
                
                downloadBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (cachedBlob) {
                        triggerBlobDownload(cachedBlob);
                    } else {
                        fetch(pdfUrl)
                            .then(function(res) { return res.blob(); })
                            .then(function(blob) {
                                cachedBlob = blob;
                                triggerBlobDownload(blob);
                            })
                            .catch(function() {
                                window.location.href = pdfUrl;
                            });
                    }
                });

                document.body.appendChild(downloadBtn);

                // If Web Share API is available (supported on iOS Safari 14+), add a dedicated Share / Save to Files button
                if (navigator.share) {
                    var shareBtn = document.createElement('button');
                    shareBtn.setAttribute('aria-label', 'Share or Save to Files');
                    shareBtn.title = "Share or Save to Files";
                    shareBtn.style.position = "fixed";
                    shareBtn.style.bottom = "92px";
                    shareBtn.style.right = "29px";
                    shareBtn.style.backgroundColor = "rgba(33, 38, 45, 0.92)";
                    shareBtn.style.border = "1px solid rgba(255, 255, 255, 0.25)";
                    shareBtn.style.color = "white";
                    shareBtn.style.width = "48px";
                    shareBtn.style.height = "48px";
                    shareBtn.style.borderRadius = "24px";
                    shareBtn.style.display = "flex";
                    shareBtn.style.justifyContent = "center";
                    shareBtn.style.alignItems = "center";
                    shareBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
                    shareBtn.style.backdropFilter = "blur(8px)";
                    shareBtn.style.webkitBackdropFilter = "blur(8px)";
                    shareBtn.style.zIndex = "999999";
                    shareBtn.style.cursor = "pointer";
                    // Apple iOS Share icon (box with upward arrow)
                    shareBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>';

                    shareBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        function doShare(blob) {
                            try {
                                var file = new File([blob], filename, { type: 'application/pdf' });
                                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                    navigator.share({
                                        files: [file],
                                        title: filename
                                    }).catch(function(err) {
                                        if (err.name !== 'AbortError') {
                                            console.warn("File share aborted or failed:", err);
                                        }
                                    });
                                    return;
                                }
                            } catch (err) {
                                console.warn("File object share failed, attempting link share:", err);
                            }

                            // Fallback to URL share
                            navigator.share({
                                title: 'Prabhu Teja Pamula - Resume',
                                url: fullUrl
                            }).catch(function() {});
                        }

                        if (cachedBlob) {
                            doShare(cachedBlob);
                        } else {
                            fetch(pdfUrl)
                                .then(function(res) { return res.blob(); })
                                .then(function(blob) {
                                    cachedBlob = blob;
                                    doShare(blob);
                                })
                                .catch(function() {
                                    navigator.share({
                                        title: 'Prabhu Teja Pamula - Resume',
                                        url: fullUrl
                                    }).catch(function() {});
                                });
                        }
                    });

                    document.body.appendChild(shareBtn);
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
        .then(function(response) {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.blob();
        })
        .then(function(blob) {
            cachedBlob = blob;
            redirectToPdf();
        })
        .catch(function(err) {
            console.warn("Pre-fetch blob error:", err);
            redirectToPdf();
        });

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
