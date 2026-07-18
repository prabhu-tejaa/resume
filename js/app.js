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
    fetch(pdfUrl)
        .then(function(response) { return response.blob(); })
        .then(function() { 
            window.location.replace(pdfUrl); 
        })
        .catch(function() { 
            window.location.replace(pdfUrl); 
        });

    setTimeout(function() { window.location.replace(pdfUrl); }, 6000);
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
