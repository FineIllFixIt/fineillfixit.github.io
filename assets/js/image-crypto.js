const imageInput = document.getElementById("image");
const xStart = document.getElementById("xCoord");
const yStart = document.getElementById("yCoord");
const plainTextInput = document.getElementById("plainText");
const cipherTextInput = document.getElementById("cipherText");

let image;
let imageArray;
imageInput.addEventListener('input', () => {
    if (imageInput.files.length > 0) {
        const file = event.target.files[0];
        if (!file) return;

        // 2. Read the file as a data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            image = new Image();
            image.onload = function() {
                
                // 3. Create an off-screen canvas matching the image size
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;

                // 4. Draw image and capture pixel data
                ctx.drawImage(image, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data; // This is a Uint8ClampedArray

                // 5. Example: Read the top-left pixel (x=0, y=0)
                const r = pixels[0];
                const g = pixels[1];    
                const b = pixels[2];
                const a = pixels[3];

                console.log(`Top-Left Pixel Color: rgba(${r}, ${g}, ${b}, ${a})`);
                console.log(`Total array length (width * height * 4): ${pixels.length}`);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        image = null;
    }
});