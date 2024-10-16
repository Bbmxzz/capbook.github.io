const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');
let button = document.querySelector('.button');
let input = document.querySelector('input[type="file"]');
let file;

button.onclick = () => {
    input.click();
};

// when browse
input.addEventListener('change', function() {
    file = this.files[0];
    if (file) {
        console.log('Selected file:', file); // Log selected file
        dragArea.classList.add('active');
        displayFile();
    }
});

// when file is inside the drag area
dragArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragText.textContent = 'Release to Upload';
    dragArea.classList.add('active');
});

// when file leaves the drag area
dragArea.addEventListener('dragleave', () => {
    dragText.textContent = 'Drag & Drop';
    dragArea.classList.remove('active');
});

// when the file is dropped in the drag area
dragArea.addEventListener('drop', (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    if (file) {
        console.log('Dropped file:', file); // Log dropped file
        displayFile();
    }
});

function displayFile() {
    let fileType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();

        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let imgTag = `<img src="${fileURL}" alt="">`;
            dragArea.innerHTML = imgTag;
        };
        fileReader.readAsDataURL(file);
    } else {
        alert('This file is not an Image');
        dragArea.classList.remove('active');
    }
}

// Get the modal
var modal = document.getElementById("myModal");
var modalMessage = document.getElementById('modalMessage');

// Handle form submission
const form = document.getElementById('uploadForm');
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    
    if (!file) {
        modalMessage.textContent = 'Please select a file to upload'; // Show message in modal
        modal.style.display = "block"; // Show modal
        return;
    }

    // แสดงข้อความ "กำลังอัปโหลด" เฉพาะตอนที่มีไฟล์
    document.getElementById('uploadStatus').style.display = 'flex'; 
    
    const formData = new FormData(form);
    formData.append('file', file); // Add file to FormData
    console.log('FormData before sending:', Array.from(formData.entries())); // Log FormData entries

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        document.getElementById('uploadStatus').style.display = 'none'; // ซ่อนข้อความ "กำลังอัปโหลด" หลังอัปโหลดเสร็จสิ้น
        if (response.ok) {
            return response.json(); // Parse the JSON response
        } else {
            return response.json().then(err => { throw new Error(err.error || 'Upload failed'); });
        }
    })
    .then(data => {
        modalMessage.textContent = data.message; // Set the message in modal
        modal.style.display = "block"; // Show the modal on success
        dragArea.innerHTML = ''; // Clear the drag area
        input.value = ''; // Clear file input
        file = null; // Clear the file variable
    })
    .catch(error => {
        document.getElementById('uploadStatus').style.display = 'none'; // ซ่อนข้อความ "กำลังอัปโหลด" เมื่อเกิดข้อผิดพลาด
        console.error('Error:', error);
        modalMessage.textContent = 'An error occurred during the upload'; // Set error message in modal
        modal.style.display = "block"; // Show modal
    });
});

// Close modal logic
const closeModalButton = document.getElementsByClassName("button-close")[0];

closeModalButton.onclick = function() {
    modal.style.display = "none"; // Close the modal
    modalMessage.textContent = ''; // Clear the modal message
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"; // Close the modal
        modalMessage.textContent = ''; // Clear the modal message
    }
};
