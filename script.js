document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const canvas2 = document.getElementById("myCanvas2");
  const clearBtn = document.getElementById("clearBtn");
  const submitBtn = document.getElementById("submitBtn");

  // Set the internal drawing size (in pixels) for a crisp drawing.
  // This can differ from the CSS to handle scaling.
  canvas.width = 800;
  canvas.height = 600;
  canvas2.width = 800;
  canvas2.height = 600;

  const ctx = canvas.getContext("2d");
  const ctx2 = canvas2.getContext("2d");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // ---- Drawing Functions ----
  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = "#000"; // Drawing color
    ctx.lineWidth = 2; // Pen thickness
    ctx.lineCap = "round"; // Smooth edges for lines

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  function stopDrawing() {
    isDrawing = false;
  }

  // ---- Attach Event Listeners for Canvas ----
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // ---- Clear Button ----
  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  });

  // ---- Submit Button ----
  submitBtn.addEventListener("click", () => {
    // Convert the canvas to a data URL (base64 PNG)
    const dataURL = canvas.toDataURL("image/png");

    // Send to backend via fetch
    fetch("http://localhost:3000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageData: dataURL }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("Canvas submitted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
