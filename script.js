// script.js

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const CORRECT_PASSWORD = "Zambak"; 
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let currentTrack = null;
let isMusicPlaying = false; // Müzik durumunu takip etmek için yeni değişken

// =======================================================
// Müzik Çalma Fonksiyonu
// =======================================================
function playMusic(trackId) {
    const audio = document.getElementById(trackId);
    
    // Diğer sesleri durdurmak ve butonu güncellemek için...
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
            isMusicPlaying = true; // Müzik çalıyor
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
        isMusicPlaying = false; // Müzik durdu
    }
}

// =======================================================
// Müzik Durumunu Kaydetme Fonksiyonu
// =======================================================
function saveMusicState() {
    if (currentTrack && !currentTrack.paused) {
        localStorage.setItem('playbackTime', currentTrack.currentTime);
    }
}

// =======================================================
// Müzik Durumunu Geri Yükleme Fonksiyonu
// =======================================================
function restoreMusicState() {
    const trackId = localStorage.getItem('playingTrackId');
    const time = parseFloat(localStorage.getItem('playbackTime'));
    
    if (trackId && !isNaN(time) && document.getElementById(trackId)) {
        const audio = document.getElementById(trackId);
        const button = document.querySelector(`[onclick="playMusic('${trackId}')"]`);
        
        audio.currentTime = time;
        audio.play().then(() => {
            currentTrack = audio;
            isMusicPlaying = true; // Geri yüklendi
            if (button) button.textContent = "Çalıyor... Duraklat";
        }).catch(error => {
            console.warn("Otomatik müzik geri yükleme engellendi (Mobil Kısıtlama): ", error);
            if (button) button.textContent = "Devam Etmek İçin Tekrar Tıklayın";
            isMusicPlaying = false; // Başarısız oldu
        });
    }
}

// =======================================================
// Sayfa Geçiş Fonksiyonu (KRİTİK GÜNCELLEME)
// =======================================================
function changePage(pageNumber) {
    
    // Eğer Sayfa 3'ten Sayfa 4'e geçiliyorsa, müziği kontrol et
    if (pageNumber === 4 && document.getElementById('page3').classList.contains('active-page')) {
        // Kontrol: Müzik çalıyor mu? Veya müzik çalmayı denedik mi?
        const currentAudioElement = document.getElementById(localStorage.getItem('playingTrackId'));
        
        // Müzik çalmayı deneyen veya çalan bir element yoksa
        if (!isMusicPlaying || (currentAudioElement && currentAudioElement.paused)) {
            // Uyarıyı Sayfa 3'teki başlığın altına yazdır
            const musicContainer = document.querySelector('#page3 .content-box');
            let warning = document.getElementById('music-warning-message');
            
            if (!warning) {
                 warning = document.createElement('p');
                 warning.id = 'music-warning-message';
                 warning.style.color = '#ff69b4';
                 warning.style.fontWeight = 'bold';
                 warning.textContent = "Lütfen önce bir müzik seçin ve başlatın. Bu, mesajın duygusal akışı için önemlidir!";
                 musicContainer.insertBefore(warning, musicContainer.querySelector('.music-player-container'));
            }
            
            // Eğer müzik çalmayı denedi ama başarısız olduysa bile geçişe izin verme
            return; 
        } else {
            // Uyarı mesajını temizle (varsa)
            const warning = document.getElementById('music-warning-message');
            if (warning) warning.remove();
        }
    }
    
    // Diğer sayfa geçiş işlemleri
    saveMusicState();
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden-page');
        page.classList.remove('active-page');
    });
    
    const nextPage = document.getElementById('page' + pageNumber);
    if (nextPage) {
        nextPage.classList.remove('hidden-page');
        nextPage.classList.add('active-page');
        
        // Müzik sayfasına (page 3) dönerken durumu geri yükle
        if (pageNumber === 3) {
            restoreMusicState();
        }
    }
    
    window.scrollTo({
        top: 0,
        behavior: 'instant' 
    });
}

// =======================================================
// Diğer Fonksiyonlar (Aynı Kalır)
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
        audio.play().then(() => {
            currentTrack = audio;
            isMusicPlaying = true;
            if (button) button.textContent = "Çalıyor... Duraklat";
        }).catch(error => {
            console.warn("Otomatik müzik geri yükleme engellendi (Mobil Kısıtlama): ", error);
            if (button) button.textContent = "Devam Etmek İçin Tekrar Tıklayın";
            isMusicPlaying = false;
        });
    }
}

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

function checkPassword() {
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('passed') === 'true') {
        showMainContent(); 
        return; 
    }

    let passwordAttempt = prompt("Merhaba Beyza, burası sadece sana özel. Lütfen kodu girerek içeri gir. İpucu: En sevdiğin çiçek. :)");

    if (passwordAttempt === CORRECT_PASSWORD) { 
        window.location.replace("animation.html"); 
    } else if (passwordAttempt !== null && passwordAttempt !== "") {
        alert("Üzgünüm, kod yanlış. Lütfen tekrar dene.");
        checkPassword(); 
    } else {
        document.body.innerHTML = "<h1 style='text-align:center; padding-top: 100px; color: #ff69b4;'>Bu sayfa gizlidir.</h1><p style='text-align:center; color: #f0f0f0;'>Lütfen doğru kodu bilerek tekrar deneyin.</p>";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    if (container) {
        container.style.display = 'none';
    }
    checkPassword();
});