const track = document.getElementById("image-track");
const trackWrapper = document.getElementById("track-container");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
}


const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  let touchDevice;
  if ('ontouchstart' in document.documentElement) {
    touchDevice = 1;
  } else {
    touchDevice = 2;
  }

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / touchDevice;
  
  const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
  
  track.dataset.percentage = nextPercentage;
  
  track.animate({
    transform: `translate(${nextPercentage}%, -50%)`
  }, { duration: 1200, fill: "forwards" });
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1200, fill: "forwards" });
  }
}

/* -- Had to add extra lines for touch events -- */

trackWrapper.onmousedown = e => handleOnDown(e);

trackWrapper.ontouchstart = e => handleOnDown(e.touches[0]);

trackWrapper.onmouseup = e => handleOnUp(e);

trackWrapper.ontouchend = e => handleOnUp(e.touches[0]);

trackWrapper.onmousemove = e => handleOnMove(e);

trackWrapper.ontouchmove = e => handleOnMove(e.touches[0]);