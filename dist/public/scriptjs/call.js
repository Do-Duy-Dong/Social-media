// call.js
const callSocket = io('/call');
const peer = new Peer();
let myVideoStream;
let myId;

function openStream(attempts = 3, delay = 2000) {
  const config = { audio: false, video: true };
  
  function attempt() {
    return navigator.mediaDevices.getUserMedia(config)
      .catch(err => {
        console.error("Attempt failed:", err.name, err.message);
        if (err.name === 'AbortError' && attempts > 1) {
          console.log(`Retrying in ${delay}ms... (${attempts - 1} attempts left)`);
          return new Promise(resolve => {
            setTimeout(() => resolve(attempt()), delay);
          });
        } else {
          throw err;
        }
      });
  }

  return attempt()
    .catch(err => {
      alert("Lỗi cuối cùng: " + err.name + " - " + err.message);
      throw err; // Ném lỗi để hàm gọi biết thất bại
    });
}

function playStream(id, stream) {
  const video = document.getElementById(id);
  video.srcObject = stream;
  video.play().catch(e => console.error("Error playing video:", e));
}

peer.on('open', id => {
  myId = id;
  document.getElementById('my-peer').textContent = `Your_id: ${id}`;
  console.log("My peer ID:", id);
});

function press() {
  const id = document.getElementById('remoteId').value;
  openStream()
    .then(stream => {
      myVideoStream = stream;
      playStream('localStream', stream);
      const call = peer.call(id, stream);
      call.on('stream', remoteStream => playStream("remoteStream", remoteStream));
      call.on('error', err => console.error("Call error:", err));
    })
    .catch(err => console.error("Failed to open stream:", err));
}

peer.on("call", call => {
  openStream()
    .then(stream => {
      myVideoStream = stream;
      call.answer(stream);
      playStream('localStream', stream);
      call.on('stream', remoteStream => playStream("remoteStream", remoteStream));
      call.on('error', err => console.error("Call error:", err));
    })
    .catch(err => console.error("Failed to answer call:", err));
});