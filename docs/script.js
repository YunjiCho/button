document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button[data-audio]');
    let currentVideo = null;
    let currentButton = null;
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

            currentVideo = new Audio(`audio/${audioFile}`);
            currentVideo.preload = 'auto';
            
            const source = audioContext.createMediaElementSource(currentVideo);
            gainNode = audioContext.createGain();

            if (audioFile === '4.mp3') {
                gainNode.gain.value = 0.6;
            } else {
                gainNode.gain.value = 0.8;
            }

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            currentButton = this;
            buttonSpan.textContent = pauseIcon;
            
            currentVideo.addEventListener('canplaythrough', function() {
                currentVideo.play().catch(error => {
                    console.error('재생 중 오류 발생:', error);
                    buttonSpan.textContent = playIcon;
                });
            }, { once: true });

            currentVideo.onerror = function() {
                console.error(`파일을 로드할 수 없습니다: ${audioFile}`);
                buttonSpan.textContent = playIcon;
            };

            currentVideo.onended = function() {
                buttonSpan.textContent = playIcon;
                currentVideo = null;
                currentButton = null;
            };
        });
    });
});