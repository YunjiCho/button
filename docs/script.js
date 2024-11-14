document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button[data-audio]');
    let currentAudio = null;
    
    // 모든 버튼에 대한 이벤트 리스너
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function() {
            // 멈추기 버튼인 경우
            if (this.querySelector('span').textContent === '멈추기') {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentAudio = null;
                }
                return;
            }

            // 오디오 재생 버튼인 경우
            const audioFile = this.dataset.audio;
            if (audioFile) {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                currentAudio = new Audio(`audio/${audioFile}`);
                
                currentAudio.onerror = function() {
                    console.error(`오디오 파일을 로드할 수 없습니다: ${audioFile}`);
                    alert('죄송합니다. 음성 파일을 재생할 수 없습니다.');
                };
                
                currentAudio.play().catch(error => {
                    console.error('재생 중 오류 발생:', error);
                    alert('음성 재생 중 오류가 발생했습니다.');
                });
            }
        });
    });
});