var count = 0;
const threshold = 7;
const android = document.getElementById("android");
const cursor = document.getElementById("android-cursor");

if (cursor) {
  document.addEventListener("pointermove", function(event) {
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
  });

  document.addEventListener("pointerdown", function() {
    cursor.classList.add("clicking");
  });

  document.addEventListener("pointerup", function() {
    cursor.classList.remove("clicking");
  });

  document.addEventListener("pointerleave", function() {
    cursor.classList.add("hidden");
  });

  document.addEventListener("pointerenter", function() {
    cursor.classList.remove("hidden");
  });
}

if (android) {
  android.onclick = function () {
      count++;
      if (count === threshold) {
          count = 0;
          alert("You are now a developer!");
      }
  };
}