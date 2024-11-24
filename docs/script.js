document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button[data-audio]');
    let currentVideo = null;
    let currentButton = null;
    let audioContext = null;
    let gainNode = null;
    
    const playIcon = '▶';
    const pauseIcon = '⏸';
    
    buttons.forEach(button => {
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
            
            // 오디오 컨텍스트 생성
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaElementSource(currentVideo);
            gainNode = audioContext.createGain();

            // 4번 파일의 경우 볼륨을 크게
            if (audioFile === '4.mp3') {
                gainNode.gain.value = 5.0;  // 소리를 5배로 증폭
            } else {
                gainNode.gain.value = 1.0;  // 다른 파일들은 기본 볼륨
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