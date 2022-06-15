const audio = document.getElementById('audioBtn');
const playBtn = document.getElementById('playBtn')
const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });
        audio.innerHTML = 'Record Audio'
        audio.setAttribute('data-state', 'stale')
        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
let audioFile = null;
async function getRecorder() {
  const recorder = await recordAudio();
  return recorder
}
getRecorder().then(recorder => {



  async function handleClick() {
    console.log(audio.attributes['data-state'].value)
    if (audio.attributes['data-state'].value === 'stale') {
      audio.innerHTML = 'Stop Recording'
      audio.setAttribute('data-state', 'recording')
      await recorder.start()
    } else if (audio.attributes['data-state'].value === 'recorded') {
      audio.innerHTML = 'Record Audio'
      audio.setAttribute('data-state', 'stale')
    } else if (audio.attributes['data-state'].value === 'recording') {
      audioFile = await recorder.stop()
    }
  }

  playBtn.addEventListener('click', () => {
    if (audioFile) {
      audioFile.play()
    }
  })

  audio.addEventListener('click', handleClick)

})
