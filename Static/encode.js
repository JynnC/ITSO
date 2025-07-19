document.addEventListener("DOMContentLoaded", function () {

    initProfileDropdown();
    

    setupTabs();
    

    setupPatentForm();
    

    setupTrademarkFileUpload();
    setupTrademarkForm();
    

    setupCopyrightForm();
    

    document.querySelector(".upload-document").addEventListener("click", submitActiveForm);
});


function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            openTab(e, tabName);
        });
    });
}

function openTab(evt, tabName) {

    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }


    const tabLinks = document.getElementsByClassName('tab-link');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
    }


    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}


function setupPatentForm() {
    const patentForm = document.getElementById('patent-form');
    if (!patentForm) return;
    

    const patentTypeSelect = document.getElementById('patent-type');
    if (patentTypeSelect) {
        patentTypeSelect.addEventListener('change', function() {
            const divisionalInfo = document.getElementById('divisional-info');
            divisionalInfo.style.display = this.value === 'divisional' ? 'block' : 'none';
        });
    }
    

    const applicantTypeSelect = document.getElementById('applicant-type');
    if (applicantTypeSelect) {
        applicantTypeSelect.addEventListener('change', function() {
            const companyNameField = document.getElementById('company-name-field');
            companyNameField.style.display = this.value !== 'individual' ? 'block' : 'none';
        });

        document.getElementById('company-name-field').style.display = 
            applicantTypeSelect.value !== 'individual' ? 'block' : 'none';
    }
    

    const applicantIsInventor = document.getElementById('applicant-is-inventor');
    if (applicantIsInventor) {
        applicantIsInventor.addEventListener('change', function() {
            const inventorSection = document.getElementById('inventor-section');
            inventorSection.style.display = this.checked ? 'none' : 'block';
            
            if (this.checked) {

                const fieldsToCopy = [
                    'lastname', 'firstname', 'middlename', 'gender',
                    'address', 'town', 'province', 'zipcode',
                    'country', 'phone', 'email', 'nationality'
                ];
                
                fieldsToCopy.forEach(field => {
                    const applicantValue = document.getElementById(`applicant-${field}`).value;
                    document.getElementById(`inventor-${field}`).value = applicantValue;
                });
            }
        });
    }
}

document.getElementById('trademark-form').addEventListener('submit', function(e) {
  const fileInput = document.getElementById('mark-image');
  if (fileInput.files.length === 0) {
    alert('Please select a trademark image file');
    e.preventDefault();
    return false;
  }
  return true;
});


function setupTrademarkForm() {
    const tmForm = document.getElementById('trademark-form');
    if (!tmForm) return;
    

    const priorityClaim = document.getElementById('tm-priority-claim');
    if (priorityClaim) {
        priorityClaim.addEventListener('change', function() {
            document.getElementById('tm-priority-info').style.display = 
                this.value === 'yes' ? 'block' : 'none';
        });
    }
    

    const colorClaim = document.getElementById('tm-color-claim');
    if (colorClaim) {
        colorClaim.addEventListener('change', function() {
            document.getElementById('tm-color-description-field').style.display = 
                this.value === 'yes' ? 'block' : 'none';
        });
    }
    

    const disclaimer = document.getElementById('tm-disclaimer');
    if (disclaimer) {
        disclaimer.addEventListener('change', function() {
            document.getElementById('tm-disclaimer-text-field').style.display = 
                this.value === 'yes' ? 'block' : 'none';
        });
    }
    

    const translation = document.getElementById('tm-translation');
    if (translation) {
        translation.addEventListener('change', function() {
            document.getElementById('tm-translation-text-field').style.display = 
                this.value === 'yes' ? 'block' : 'none';
        });
    }
}

function setupTrademarkFileUpload() {
    const markImageInput = document.getElementById('mark-image');
    const markBoxContent = document.querySelector('.mark-box-content');

    if (!markImageInput || !markBoxContent) return;


    markBoxContent.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        markBoxContent.classList.add('dragover');
    });

    markBoxContent.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        markBoxContent.classList.remove('dragover');
    });

    markBoxContent.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        markBoxContent.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        handleFileUpload(files[0]);
    });


    markBoxContent.addEventListener('click', () => {
        markImageInput.click();
    });


    markImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    });

    function handleFileUpload(file) {
        if (!file) return;


        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please upload an image (JPEG, PNG, GIF, SVG).');
            return;
        }

        if (file.size > maxSize) {
            alert('File is too large. Maximum file size is 5MB.');
            return;
        }


        const reader = new FileReader();
        reader.onload = function(event) {

            markBoxContent.innerHTML = '';
            

            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.objectFit = 'contain';
            

            const removeBtn = document.createElement('div');
            removeBtn.innerHTML = '&times;'; // × symbol
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '5px';
            removeBtn.style.right = '5px';
            removeBtn.style.backgroundColor = 'rgba(255,0,0,0.7)';
            removeBtn.style.color = 'white';
            removeBtn.style.width = '20px';
            removeBtn.style.height = '20px';
            removeBtn.style.borderRadius = '50%';
            removeBtn.style.display = 'flex';
            removeBtn.style.alignItems = 'center';
            removeBtn.style.justifyContent = 'center';
            removeBtn.style.cursor = 'pointer';
            
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetMarkBox();
            });
            

            const previewContainer = document.createElement('div');
            previewContainer.style.position = 'relative';
            previewContainer.appendChild(img);
            previewContainer.appendChild(removeBtn);
            
            markBoxContent.appendChild(previewContainer);
        };
        reader.readAsDataURL(file);
    }

    function resetMarkBox() {
        markBoxContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#3D90D7" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span style="margin-top: 10px; color: #3D90D7;">Click to upload mark image</span>
            </div>
        `;
        markImageInput.value = '';
    }


    resetMarkBox();
}



function setupCopyrightForm() {
    const crForm = document.getElementById('copyright-form');
    if (!crForm) return;
    

    const authorType = document.getElementById('cr-author-type');
    if (authorType) {
        authorType.addEventListener('change', function() {
            const companyField = document.getElementById('cr-company-name-field');
            const pseudonymField = document.getElementById('cr-pseudonym-field');
            
            companyField.style.display = this.value === 'corporate' ? 'block' : 'none';
            pseudonymField.style.display = this.value === 'pseudonymous' ? 'block' : 'none';
        });
    }
    

    const authorIsOwner = document.getElementById('cr-author-is-owner');
    if (authorIsOwner) {
        authorIsOwner.addEventListener('change', function() {
            document.getElementById('cr-owner-fields').style.display = 
                this.checked ? 'none' : 'block';
        });
    }
    

    const ownerType = document.getElementById('cr-owner-type');
    if (ownerType) {
        ownerType.addEventListener('change', function() {
            document.getElementById('cr-owner-company-field').style.display = 
                this.value === 'corporate' ? 'block' : 'none';
        });
    }
}


function initProfileDropdown() {
    const profileBtn = document.querySelector(".profile-btn");
    const dropdownContent = document.querySelector(".dropdown-content");

    if (profileBtn && dropdownContent) {
        profileBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", function () {
            dropdownContent.style.display = "none";
        });

        dropdownContent.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }
}


function submitActiveForm() {
    const activeForm = document.querySelector('.tab-content.active form');
    if (activeForm) {

        if (validateForm(activeForm)) {
            activeForm.submit();
        }
    }
}


function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'red';
            isValid = false;
            

            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '';
                }
            });
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields (marked in red)');
    }
    
    return isValid;
}