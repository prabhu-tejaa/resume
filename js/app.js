var pdfUrl = window.pdfUrl;

if (!pdfUrl || pdfUrl.trim() === "") {
    document.addEventListener("DOMContentLoaded", function() {
        var loader = document.querySelector('.terminal-loader');
        if (loader) {
            loader.innerHTML = "<span style='color: #ff7b72;'>Error: Resume file not found in repository.</span>";
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
