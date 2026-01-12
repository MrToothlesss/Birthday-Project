// script.js - ŞİFRE KALDIRILMIŞ, ANİMASYON AKIŞI KORUNMUŞ TAM SÜRÜM

let currentTrack = null;
let isMusicPlaying = false; 

// =======================================================
// 1. Müzik Çalma Fonksiyonu
// =======================================================
function playMusic(trackId) {
    const audio = document.getElementById(trackId);
    
    // Diğer sesleri durdurmak ve butonları güncellemek için
    document.querySelectorAll('.music-track').forEach(t => {
        const button = document.querySelector(`[onclick="playMusic('${t.id}')"]`);
        if (t !== audio && !t.paused) {
            t.pause();
            t.currentTime = 0;
            if (button) button.textContent = "Müziği Başlat / Duraklat";
            localStorage.removeItem('playingTrackId');
        }
    });

    const button = document.querySelector(`[onclick="playMusic('${trackId}')"]`);
    if (audio.paused) {
        audio.play().then(() => {
            localStorage.setItem('playingTrackId', trackId);
            localStorage.setItem('playbackTime', audio.currentTime);
            if (button) button.textContent = "Çalıyor... Duraklat";
            currentTrack = audio;
            isMusicPlaying = true; 
        }).catch(error => {
            console.error("Müzik çalma engellendi: ", error);
            if (button) button.textContent = "Müzik Başlatılamadı (Tekrar Deneyin)";
            isMusicPlaying = false;
        });
    } else {
        audio.pause();
        localStorage.removeItem('playingTrackId');
        if (button) button.textContent = "Müziği Başlat / Duraklat";
        currentTrack = null;
        isMusicPlaying = false; 
    }
}

// =======================================================
// 2. Müzik Durumunu Kaydetme ve Geri Yükleme
// =======================================================
function saveMusicState() {
    if (currentTrack && !currentTrack.paused) {
        localStorage.setItem('playbackTime', currentTrack.currentTime);
    }
}

function restoreMusicState() {
    const trackId = localStorage.getItem('playingTrackId');
    const time = parseFloat(localStorage.getItem('playbackTime'));
    
    if (trackId && !isNaN(time) && document.getElementById(trackId)) {
        const audio = document.getElementById(trackId);
        const button = document.querySelector(`[onclick="playMusic('${trackId}')"]`);
        
        audio.currentTime = time;
        currentTrack = audio;
        
        if (button) {
            button.textContent = "Kaldığı Yerden Başlat"; 
        }
    }
}

// =======================================================
// 3. Sayfa Geçiş Fonksiyonu
// =======================================================
function changePage(pageNumber) {
    // Sayfa 4'e geçerken Müzik Kontrolü
    if (pageNumber === 4 && document.getElementById('page3').classList.contains('active-page')) {
        if (!isMusicPlaying) {
            const musicContainer = document.querySelector('#page3 .content-box');
            let warning = document.getElementById('music-warning-message');
            
            if (!warning) {
                 warning = document.createElement('p');
                 warning.id = 'music-warning-message';
                 warning.style.color = '#ff69b4';
                 warning.style.fontWeight = 'bold';
                 warning.style.textAlign = 'center';
                 warning.textContent = "Lütfen önce bir müzik seçin ve başlatın. Bu, mesajın duygusal akışı için önemlidir!";
                 musicContainer.insertBefore(warning, musicContainer.querySelector('.music-player-container'));
            }
            return; 
        } else {
            const warning = document.getElementById('music-warning-message');
            if (warning) warning.remove();
        }
    }
    
    saveMusicState();
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden-page');
        page.classList.remove('active-page');
    });
    
    const nextPage = document.getElementById('page' + pageNumber);
    if (nextPage) {
        nextPage.classList.remove('hidden-page');
        nextPage.classList.add('active-page');
        
        if (pageNumber === 3) {
            restoreMusicState();
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// =======================================================
// 4. Ana İçeriği Gösterme Fonksiyonu
// =======================================================
function showMainContent() {
    const container = document.getElementById('container');
    if (container) {
        container.style.display = 'block'; 
    } 
    document.body.classList.add('page-loaded');

    const cleanUrl = window.location.pathname;
    history.replaceState(null, '', cleanUrl); 
    
    changePage(1); 
}

// =======================================================
// 5. Başlangıç ve Otomatik Akış Yönetimi
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Eğer animasyon bitti ve parametreyle geri döndüyse ana içeriği aç
    if (urlParams.get('passed') === 'true') {
        showMainContent(); 
    } else {
        // İlk kez giriyorsa şifre sormadan DİREKT animasyona gönder
        window.location.replace("animation.html"); 
    }
});