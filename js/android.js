var count = 0;
const threshold = 7;
const android = document.getElementById("android");

android.onclick = function () {
    count++;
    if (count === threshold) {
        count = 0;
        alert("You are now a developer!");
    }
}