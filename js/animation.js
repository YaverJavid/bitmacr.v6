const framesContainer = document.getElementById("frames")
const frameCount = document.getElementById("frame-count")
const updateFrameCount = () => frameCount.textContent = framesContainer.children.length


function getFrameHTML(src) {
    return `<div class="frame">
                <img src="${src}" class="frame-preview" width="100">
                <div class="frame-buttons">
                    <img src="icons/up.svg" onclick="console.log(this)">
                    <img src="icons/down.svg" alt="">
                    <img src="icons/delete.svg" onclick="deleteFrame(this)">
                    <input type="number" class="frame-time" placeholder="Enter Time(ms)" />
                </div>
            </div>`
}

document.getElementById("add-frame").addEventListener("click", () => {
    let currentBuffer = buffer.getItem()
    let paintData = []
    for (let i = 0; i < currentBuffer.length; i++) {
        paintData.push(rgbaToHex(currentBuffer[i]))
    }
    let dataUrl = colorDataToImage(squareArray(paintData), cellBorderWidthSlider.value, cellBorderColorSelector.value)
    framesContainer.innerHTML += getFrameHTML(dataUrl)
    updateFrameCount()
})

function deleteFrame(elem) {
    let frameElem = elem.parentNode.parentNode
    customConfirm("Do you really want to delete this frame?",
        () => {
            framesContainer.removeChild(frameElem)
            updateFrameCount()
        })
}

async function createGIF(imageUrls, timeDurations) {
    const gifFrames = [];

    // Load each image as a frame in the GIF
    for (let i = 0; i < imageUrls.length; i++) {
        const image = await loadImage(imageUrls[i]);
        const duration = timeDurations[i] || 100; // Default duration of 100ms if not provided

        gifFrames.push({ data: image.data, delay: duration });
    }

    // Encode the GIF frames and return the binary data
    const encoder = new GIFEncoder();
    encoder.setRepeat(0);
    encoder.setDelay(100); // Default delay of 100ms if not provided
    encoder.start();

    for (let i = 0; i < gifFrames.length; i++) {
        encoder.addFrame(gifFrames[i].data, true, gifFrames[i].delay);
    }

    encoder.finish();

    return encoder.stream().getData();
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            resolve(imageData);
        };
        image.onerror = () => {
            reject(new Error(`Failed to load image: ${url}`));
        };
        image.src = url;
    });
}
var gif
document.getElementById("export-gif").addEventListener("click", () => {
    // Define the options for the GIF
    var gifOptions = {
        gifWidth: 320,
        gifHeight: 240,
        interval: 0.5,
        numFrames: 2,
        gifQuality: 10
    };

    // Get the image data for the two frames


    // Create an array of image data for the frames
    logo = Image
    logo.src = "logo.png"
    var imageArray = [logo];

    // Call the gifshot library to create the GIF
    gifshot.createGIF({
        images: imageArray,
        gifWidth: gifOptions.gifWidth,
        gifHeight: gifOptions.gifHeight,
        interval: gifOptions.interval,
        numFrames: gifOptions.numFrames,
        gifQuality: gifOptions.gifQuality
    }, function(obj) {
        if (!obj.error) {
            // Display the GIF
            var image = obj.image;
            document.getElementById('myGif').src = image;
        }
    });

})