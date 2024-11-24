document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button[data-audio]');
    let currentVideo = null;
    let currentButton = null;
    let audioContext = null;
    let gainNode = null;
    
    const playIcon = '▶';
    const pauseIcon = '❚❚';
    
    buttons.forEach((button, index) => {
        button.querySelector('span').textContent = playIcon;
        
        button.addEventListener('click', function() {
            const audioFile = this.dataset.audio;
            const buttonSpan = this.querySelector('span');
            
            if (currentButton === this) {
                if (currentVideo && !currentVideo.paused) {
                    currentVideo.pause();
                    buttonSpan.textContent = playIcon;
                } else if (currentVideo) {
                    currentVideo.play();
                    buttonSpan.textContent = pauseIcon;
                }
                return;
            }

            if (currentVideo) {
                currentVideo.pause();
                if (currentButton) {
                    currentButton.querySelector('span').textContent = playIcon;
                }
            }

            if (audioContext) {
                audioContext.close();
            }

            currentVideo = document.createElement('audio');
            currentVideo.style.display = 'none';
            currentVideo.src = `audio/${audioFile}`;
            
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaElementSource(currentVideo);
            gainNode = audioContext.createGain();

            // 각 버튼별 볼륨 설정
            switch(audioFile) {
                case '1.mp3':
                    gainNode.gain.value = 2.4;  // 1번 파일 2.4배로 수정
                    break;
                case '2.mp3':
                    gainNode.gain.value = 2.4;  // 2번 파일 2.4배로 수정
                    break;
                case '3.mp3':
                    gainNode.gain.value = 1.0;  // 3번 파일 기본 볼륨
                    break;
                case '4.mp3':
                    gainNode.gain.value = 1.6;  // 4번 파일 1.6배로 수정
                    break;
                default:
                    gainNode.gain.value = 1.0;
            }

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            document.body.appendChild(currentVideo);
            
            currentButton = this;
            buttonSpan.textContent = pauseIcon;
            
            currentVideo.play().catch(error => {
                console.error('재생 중 오류 발생:', error);
                buttonSpan.textContent = playIcon;
            });

            currentVideo.onended = function() {
                buttonSpan.textContent = playIcon;
                document.body.removeChild(currentVideo);
                currentVideo = null;
                currentButton = null;
                if (audioContext) {
                    audioContext.close();
                    audioContext = null;
                }
            };
        });
    });
});