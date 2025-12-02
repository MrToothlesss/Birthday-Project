// script.js - FLASH HATASI GİDERİLMİŞ TAM SÜRÜM

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const CORRECT_PASSWORD = "Zambak"; 
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let currentTrack = null;
let isMusicPlaying = false; 

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
        currentTrack = audio;
        isMusicPlaying = false; 
        
        if (button) {
            button.textContent = "Kaldığı Yerden Başlat"; 
        }
    }
}

// =======================================================
// Sayfa Geçiş Fonksiyonu
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
    
    window.scrollTo({
        top: 0,
        behavior: 'instant' 
    });
}

// =======================================================
// Ana İçeriği Gösterme Fonksiyonu (KRİTİK DÜZELTME)
// =======================================================
function showMainContent() {
    const container = document.getElementById('container');
    if (container) {
        // HTML'de gizlediğimiz içeriği burada AÇIYORUZ
        container.style.display = 'block'; 
    } 
    
    document.body.classList.add('page-loaded');

    const cleanUrl = window.location.pathname;
    history.replaceState(null, '', cleanUrl); 
    
    changePage(1); 
}

// =======================================================
// Şifre Kontrolü Fonksiyonu
// =======================================================
function checkPassword() {
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // Eğer animasyon bitti ve geri döndüyse
    if (urlParams.get('passed') === 'true') {
        showMainContent(); 
        return; 
    }

    // İlk girişte içerik HTML'den gizli olduğu için arka plan boştur.
    let passwordAttempt = prompt("Merhaba Beyza, burası sadece sana özel. Lütfen kodu girerek içeri gir. İpucu: En sevdiğin çiçek. :)");

    if (passwordAttempt === CORRECT_PASSWORD) { 
        window.location.replace("animation.html"); 
    } else if (passwordAttempt !== null && passwordAttempt !== "") {
        alert("Üzgünüm, kod yanlış. Lütfen tekrar dene.");
        checkPassword(); 
    } else {
        document.body.innerHTML = "<div style='display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column;'><h1 style='color: #ff69b4;'>Bu sayfa gizlidir.</h1><p style='color: #f0f0f0;'>Sayfayı yenileyip tekrar deneyebilirsin.</p></div>";
    }
}

// =======================================================
// Başlangıç
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // Burada artık gizleme yapmıyoruz çünkü HTML'de style="display:none" var.
    checkPassword();
});