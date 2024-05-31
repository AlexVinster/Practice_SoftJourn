var cropper;

function previewImage(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var dataURL = reader.result;
        var output = document.getElementById('cropperImage');
        output.src = dataURL;
        output.onload = function () {
            // Initialize cropper
            cropper = new Cropper(output, {
                aspectRatio: 1 / 1,
                viewMode: 1,
                autoCropArea: 1,
                background: false,
                rounded: {
                    top: false, // Rounded top edge
                    bottom: false // Straight bottom edge
                },
                cropBoxOptions: {
                    // Adjust crop box options as needed
                }
            });
        };
        document.getElementById('cropperContainer').style.display = 'block';
        document.querySelector('button').style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
}

function saveImage() {
    if (cropper) {
        cropper.getCroppedCanvas().toBlob(function (blob) {
            var croppedImage = new File([blob], 'croppedImage.png');
            var formData = new FormData();
            formData.append('croppedImage', croppedImage);

            // Display the cropped image
            var resultImage = document.getElementById('croppedResult');
            resultImage.src = URL.createObjectURL(croppedImage);
            resultImage.style.display = 'block';

            // Hide the original image
            var originalImage = document.getElementById('cropperImage');
            originalImage.style.display = 'none';

            // Reset cropper
            cropper.destroy();
            document.getElementById('fileInput').value = ''; // Reset file input
            document.querySelector('button').style.display = 'none';
        });
    }
}