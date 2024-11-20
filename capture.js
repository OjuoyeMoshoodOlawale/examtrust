const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const captureBtn = document.getElementById("captureBtn");
const ctx = canvas.getContext("2d");

// Load Face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"), // Path to your models
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startVideo);

// Ask for camera permission and start video feed
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      alert("Camera permission is required to use this feature.");
      console.error("Error accessing camera:", err);
    });
}

// Detect faces and enable the capture button
video.addEventListener("play", async () => {
  const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
  canvas.width = displaySize.width;
  canvas.height = displaySize.height;

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detections.length > 0) {
      const faceBox = detections[0].detection.box;
      const { width, height, x, y } = faceBox;

      // Draw rectangle around the face
      ctx.strokeStyle = "green";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      captureBtn.disabled = false; // Enable the button when a face is detected
    } else {
      captureBtn.disabled = true; // Disable the button when no face is detected
    }
  }, 100);
});

// Capture and alert success
captureBtn.addEventListener("click", () => {
  const snapshotCanvas = document.createElement("canvas");
  snapshotCanvas.width = video.videoWidth;
  snapshotCanvas.height = video.videoHeight;
  snapshotCanvas.getContext("2d").drawImage(video, 0, 0);

  // Alert success
  alert("Yes, image captured successfully!");
});
