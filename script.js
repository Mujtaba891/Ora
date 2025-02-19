// Save .Ora File
function saveOraFile() {
    const content = document.getElementById("editor").innerHTML;
    const media = JSON.parse(localStorage.getItem("media") || "[]");

    const oraData = { text: content, media: media };
    const blob = new Blob([JSON.stringify(oraData)], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "file.Ora";
    a.click();
}

/// Open .Ora File function
function openOraFile() {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
}

// Event listener for the button
document.getElementById("openOraFileButton").addEventListener("click", openOraFile);

// Handling file input change event
document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        // Check for .Ora file extension
        if (!file.name.endsWith('.Ora')) {
            alert('Please select a valid .Ora file.');
            return;
        }

        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                // Make sure the necessary properties exist in the data
                if (data.text) {
                    document.getElementById("editor").innerHTML = data.text;
                } else {
                    console.error('Missing text in .Ora file');
                }

                if (data.media) {
                    localStorage.setItem("media", JSON.stringify(data.media));
                    loadMedia(); // Ensure loadMedia function is implemented
                } else {
                    console.error('Missing media data in .Ora file');
                }
            } catch (error) {
                console.error('Error reading .Ora file:', error);
            }
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };
    } else {
        console.error('No file selected');
    }
});

//add media to side bar
function addMedia(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    
    reader.onload = function (e) {
        let mediaElement;
        if (file.type.startsWith("image")) {
            mediaElement = `<img src="${e.target.result}" width="200">`;
        } else if (file.type.startsWith("video")) {
            mediaElement = `<video src="${e.target.result}" width="200" controls></video>`;
        }
        document.getElementById("editor").innerHTML += mediaElement;
    };

    reader.readAsDataURL(file);
}

// Media Upload
document.getElementById("uploadMedia").addEventListener("change", function (event) {
    const files = event.target.files;
    let mediaArray = JSON.parse(localStorage.getItem("media") || "[]");

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const mediaUrl = e.target.result;
            mediaArray.push(mediaUrl);
            localStorage.setItem("media", JSON.stringify(mediaArray));
            loadMedia();
        };
        reader.readAsDataURL(file);
    }
});

// Remove Media
function removeMedia(index) {
    let mediaArray = JSON.parse(localStorage.getItem("media") || "[]");
    mediaArray.splice(index, 1);
    localStorage.setItem("media", JSON.stringify(mediaArray));
    loadMedia();
}


// Load Media from Local Storage
function loadMedia() {
    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = "";
    const mediaArray = JSON.parse(localStorage.getItem("media") || "[]");

    mediaArray.forEach((mediaUrl, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("media-wrapper");

        const mediaItem = document.createElement(mediaUrl.includes("image") ? "img" : "video");
        mediaItem.src = mediaUrl;
        mediaItem.classList.add("media-item");
        if (mediaItem.tagName === "VIDEO") {
            mediaItem.controls = true;
        }

        mediaItem.style.resize = "both";
        mediaItem.style.overflow = "auto";

        const removeIcon = document.createElement("i");
        removeIcon.className = "fas fa-trash-alt remove-icon";
        removeIcon.onclick = () => removeMedia(index);

        wrapper.appendChild(mediaItem);
        wrapper.appendChild(removeIcon);
        mediaContainer.appendChild(wrapper);
    });
}

// Load media on startup
loadMedia();







// Change Text Color
function changeTextColor(color) {
    document.execCommand("foreColor", false, color);
}


function formatText(command, value = null) {
    if (command === "fontsize") {
        document.execCommand("fontSize", false, "7"); // Compatibility ke liye
        document.querySelectorAll("font[size='7']").forEach(font => {
            font.removeAttribute("size");
            font.style.fontSize = value; // Custom font-size apply karo
        });
    }  
    else if (command === "fontname") {
        document.execCommand("fontName", false, value); // Font family apply karega
    }  
    else if (command === "heading") {
        let selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        let range = selection.getRangeAt(0);
        let selectedText = range.extractContents();

        let newElement = document.createElement(value); // Heading tag create karega
        newElement.appendChild(selectedText);

        range.deleteContents(); // Purana content delete karo
        range.insertNode(newElement);

        // Selection ko maintain rakhne ke liye
        selection.removeAllRanges();
        let newRange = document.createRange();
        newRange.selectNodeContents(newElement);
        selection.addRange(newRange);
    }  
    else {
        document.execCommand(command, false, value);
    }
}

// Remove media from localStorage and UI
function removeMedia(index) {
    let mediaArray = JSON.parse(localStorage.getItem("media")) || [];
    mediaArray.splice(index, 1);
    localStorage.setItem("media", JSON.stringify(mediaArray));
    loadMedia(); // Refresh the UI
}

// Load media when the page loads
document.addEventListener("DOMContentLoaded", loadMedia);


// Remove Media
function removeMedia(index) {
    let mediaArray = JSON.parse(localStorage.getItem("media") || "[]");
    mediaArray.splice(index, 1);
    localStorage.setItem("media", JSON.stringify(mediaArray));
    loadMedia();
}


// Save or Update Ora File
function saveOraFile() {
    const content = document.getElementById("editor").innerHTML;
    let fileName = prompt("Enter project name:", "NewFile");

    if (!fileName) return;

    if (localStorage.getItem(fileName)) {
        if (!confirm(`"${fileName}" already exists. Do you want to update it?`)) return;
    }

    const oraData = { name: fileName, text: content };
    localStorage.setItem(fileName, JSON.stringify(oraData));

    alert("File saved successfully!");
    
    // ✅ Save hone ke baad recent files update karo
    loadRecentFiles();
}

// Rename File
function renameFile(oldName) {
    let newName = prompt("Enter new file name:", oldName);
    if (!newName || oldName === newName) return;

    let fileData = JSON.parse(localStorage.getItem(oldName));
    fileData.name = newName;

    localStorage.setItem(newName, JSON.stringify(fileData));
    localStorage.removeItem(oldName);

    loadRecentFiles();
}

// Delete File
function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
        localStorage.removeItem(fileName);
        loadRecentFiles();
    }
}

// Share File (Copy to Clipboard)
function shareFile(fileData) {
    const fileContent = JSON.stringify(fileData);
    navigator.clipboard.writeText(fileContent).then(() => {
        alert("File copied to clipboard! Share it with others.");
    });
}

// ✅ Page load hone ke saath recent files load karo
document.addEventListener("DOMContentLoaded", loadRecentFiles);

function downloadOraFile() {
    const content = document.getElementById("editor").innerHTML;
    const fileName = prompt("Enter file name to download:", "NewFile");

    if (!fileName) return;

    const oraData = { name: fileName, text: content };
    const fileBlob = new Blob([JSON.stringify(oraData)], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(fileBlob);
    link.download = fileName + ".Ora";
    link.click();

    URL.revokeObjectURL(link.href);
}

// Drag and Drop Media
document.getElementById("editor").ondrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            let mediaElement;
            if (file.type.startsWith("image/")) {
                mediaElement = `<img src="${e.target.result}" width="100">`;
            } else if (file.type.startsWith("video/")) {
                mediaElement = `<video src="${e.target.result}" width="100" controls></video>`;
            } else {
                alert("Unsupported file type! Please drop an image or video.");
                return;
            }

            document.getElementById("editor").innerHTML += mediaElement;

            // Save to localStorage
            let mediaArray = JSON.parse(localStorage.getItem("media")) || [];
            mediaArray.push({ url: e.target.result, type: file.type });
            localStorage.setItem("media", JSON.stringify(mediaArray));

            loadMedia(); // Refresh the sidebar
        };
        reader.readAsDataURL(file);
    }
};
// Remove media from localStorage and UI
function removeMedia(index) {
    let mediaArray = JSON.parse(localStorage.getItem("media")) || [];
    mediaArray.splice(index, 1);
    localStorage.setItem("media", JSON.stringify(mediaArray));
    loadMedia(); // Refresh the UI
}

// Function to Open File in Editor
function openFileInEditor(fileName) {
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || {};
    const fileContent = savedFiles[fileName];

    if (fileContent) {
        sessionStorage.setItem("currentFileName", fileName); // Store file name for retrieval
        sessionStorage.setItem("currentFileContent", fileContent); // Store content for editor

        window.location.href = "editor.html"; // Redirect to Editor Page
    } else {
        alert("File not found!");
    }
}

// Attach Event Listener to Edit Buttons
document.querySelectorAll(".editButton").forEach((button) => {
    button.addEventListener("click", function() {
        const fileName = this.dataset.filename; // Get filename from data attribute
        openFileInEditor(fileName);
    });
});


function toggleCase() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    let selectedText = range.toString();

    if (!selectedText) return;

    let newText;
    if (selectedText === selectedText.toUpperCase()) {
        newText = selectedText.toLowerCase();
    } else {
        newText = selectedText.toUpperCase();
    }

    let newSpan = document.createElement("span");
    newSpan.textContent = newText;

    range.deleteContents();
    range.insertNode(newSpan);
}

// Function to Open File in Editor
function openFileInEditor(fileName) {
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || {};
    const fileContent = savedFiles[fileName];

    if (fileContent) {
        sessionStorage.setItem("currentFileName", fileName); // Store file name for retrieval
        sessionStorage.setItem("currentFileContent", fileContent); // Store content for editor

        window.location.href = "editor.html"; // Redirect to Editor Page
    } else {
        alert("File not found!");
    }
}