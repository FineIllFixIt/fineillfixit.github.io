const imageInput = document.getElementById("image");
const xStart = document.getElementById("xCoord");
const yStart = document.getElementById("yCoord");
const plainTextInput = document.getElementById("plainText");
const cipherTextInput = document.getElementById("cipherText");
const alphabet = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32)).join('');
const imageDim = alphabet.length + 255

let image;
let imageArray = [];
imageInput.addEventListener('input', () => {
    if (imageInput.files.length > 0) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            image = new Image();
            image.src = e.target.result
            image.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = imageDim;
                canvas.height = imageDim;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                for (r = 0; r < imageDim; r++) {
                    imageArray[r] = []
                    for (c = 0; c < imageDim; c++) {
                        imageArray[r][c] = []
                        for (i = 0; i < 3; i++) {
                            imageArray[r][c][i] = pixels[(r * imageDim) + (c * 4) + i]
                        }
                    }
                }
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        image = null;
    }
});

plainTextInput.addEventListener("input", () => {
    if (xStart.value != "" && yStart.value != "" && imageArray != []) {
        cipherTextInput.value = encrypt(plainTextInput.value, imageArray);
        document.querySelectorAll(".form-error").forEach(element => {
            element.classList.add("hidden");
        });
    } else {
        document.querySelectorAll(".form-error").forEach(element => {
            element.classList.remove("hidden");
        });
    }
});

cipherTextInput.addEventListener("input", () => {
    if (xStart.value != "" && yStart.value != "" && imageArray != []) {
        plainTextInput.value = decrypt(cipherTextInput.value, imageArray);
        document.querySelectorAll(".form-error").forEach(element => {
            element.classList.add("hidden");
        });
    } else {
        document.querySelectorAll(".form-error").forEach(element => {
            element.classList.remove("hidden");
        });
    }
});

function encrypt(text, img) {
    let cipher = "";
    let x = parseInt(xStart.value);
    let y = parseInt(yStart.value);
    for (i = 0; i < text.length; i += 2) {
        let currPixel = img[x][y];
        let red = parseInt(currPixel[0]);
        let green = parseInt(currPixel[1]);
        let blue = parseInt(currPixel[2]);
        let charVal = alphabet.indexOf(text[i]);
        let cipherVal = (charVal + red) % alphabet.length;
        cipher += alphabet[cipherVal];
        if (i+1 < text.length) {
            let charVal2 = alphabet.indexOf(text[i+1]);
            let cipherVal2 = (charVal2 + green) % alphabet.length;
            cipher += alphabet[cipherVal2];
            x = (charVal + blue) % imageDim;
            y = (charVal2 + blue) % imageDim;
        }
    }
    return cipher;
}

function decrypt(text, img) {
    const mod = (n, d) => ((n % d) + d) % d;
    let plain = "";
    let x = parseInt(xStart.value);
    let y = parseInt(yStart.value);
    for (i = 0; i < text.length; i += 2) {
        let currPixel = img[x][y];
        let red = parseInt(currPixel[0]);
        let green = parseInt(currPixel[1]);
        let blue = parseInt(currPixel[2]);
        let charVal = alphabet.indexOf(text[i]);
        let plainVal = mod((charVal - red), alphabet.length);
        plain += alphabet[plainVal];
        if (i+1 < text.length) {
            let charVal2 = alphabet.indexOf(text[i+1]);
            let plainVal2 = mod((charVal2 - green), alphabet.length);
            plain += alphabet[plainVal2];
            x = (plainVal + blue) % imageDim;
            y = (plainVal2 + blue) % imageDim;
        }
    }
    return plain;
}