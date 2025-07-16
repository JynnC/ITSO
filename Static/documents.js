document.addEventListener("DOMContentLoaded", function () {
    const addAuthonBtn = document.getElementById("addAuthor");
    const authorContainer = document.getElementById("authors");

    addAuthonBtn.addEventListener("click", function () {
        const authorFields = document.querySelector(".author");

        if (authorFields) {
            const newAuthor = authorFields.cloneNode(true);

            newAuthor.querySelectorAll("input, select").forEach(input => {
                input.value = "";
            });

            const authorWrapper = document.createElement("div");
            authorWrapper.classList.add("author-wrapper");
            authorWrapper.style.position = "relative";
            authorWrapper.style.padding = "10px 0";

            const separator = document.createElement("hr");
            separator.style.width = "100%";
            separator.style.border = "1px solid #ccc";
            separator.style.margin = "20px 0";

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "❌";
            removeBtn.classList.add("remove-author");
            removeBtn.style.position = "absolute";
            removeBtn.style.right = "10px";
            removeBtn.style.top = "10px";
            removeBtn.style.background = "transparent";
            removeBtn.style.color = "white";
            removeBtn.style.border = "none";
            removeBtn.style.fontSize = "14px";
            removeBtn.style.cursor = "pointer";

            removeBtn.addEventListener("click", function () {
                authorWrapper.remove();
            });

            authorWrapper.appendChild(separator)
            authorWrapper.appendChild(newAuthor)
            authorWrapper.appendChild(removeBtn)

            authorContainer.appendChild(authorWrapper);
        }
    });

    initProfileDropdown();

});

function initProfileDropdown() {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (profileBtn && dropdownContent) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function() {
            dropdownContent.style.display = 'none';
        });

        dropdownContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}
