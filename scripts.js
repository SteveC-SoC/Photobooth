// video
const video = document.querySelector('.video');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const snap = document.querySelector('.snap');
const strip = document.querySelector('.strip'); //photo strip


function getVideo() {

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        video.srcObject = localMediaStream;
        video.play();
    })
    .catch(err => {
        console.error('User needs to provide access to camera', err)
    });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        //this is only used if i want to mess with the image on the canvas
        // let pixels = ctx.getImagedata(0,0, width, height);
        // ctx.putImageData(pixels,0,0)
    }, 16);
}

function takePhoto(){
    //this plays the sound
    snap.currentTime = 0;
    snap.play()
    
    //this takes the photo and stores it in a link
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'your photo');

    //this provides a photo preview / download link
    link.innerHTML = `<img src="${data}" alt="your photo"/>`
    strip.insertBefore(link, strip.firstChild);
}
//call video functions

getVideo();
video.addEventListener('canplay', paintToCanvas);


//speach

window.SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener("result", (e) => {
const transcript = Array.from(e.results)
  .map((result) => result[0])
  .map((result) => result.transcript)
  .join("");

if(transcript.includes('cheese')) {
  takePhoto();
}

console.log(transcript);
});

recognition.addEventListener('end', recognition.start)
recognition.start();

