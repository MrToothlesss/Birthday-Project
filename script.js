// script.js

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
            // Başarılı çalma durumunda bilgileri kaydet
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
// Müzik Durumunu Geri Yükleme Fonksiyonu (OTOMATİK OYNATMAYI ENGELLEMEK İÇİN GÜNCELLENDİ)
// =======================================================
function restoreMusicState() {
    const trackId = localStorage.getItem('playingTrackId');
    const time = parseFloat(localStorage.getItem('playbackTime'));
    
    if (trackId && !isNaN(time) && document.getElementById(trackId)) {
        const audio = document.getElementById(trackId);
        const button = document.querySelector(`[onclick="playMusic('${trackId}')"]`);
        
        audio.currentTime = time;
        // audio.play() komutu kaldırıldı! Sadece zamanı yükle ve butonu hazırla.
        
        currentTrack = audio;
        isMusicPlaying = false; // Kullanıcı tıklamadığı sürece FALSE kalmalı
        
        if (button) {
            button.textContent = "Kaldığı Yerden Başlat"; // Yeni bir prompt verelim
        }
    }
}

// =======================================================
// Sayfa Geçiş Fonksiyonu
// =======================================================
function changePage(pageNumber) {
    
    // Eğer Sayfa 3'ten Sayfa 4'e geçiliyorsa, müziği kontrol et (ZORUNLU MÜZİK KONTROLÜ)
    if (pageNumber === 4 && document.getElementById('page3').classList.contains('active-page')) {
        
        // Müzik çalmayı deneyen veya çalan bir element yoksa
        if (!isMusicPlaying) {
            
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
            
            // Geçişe izin verme
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
// Ana İçeriği Gösterme ve URL'yi Temizleme Fonksiyonu
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
// Şifre Kontrolü Fonksiyonu (Sayfa Girişi)
// =======================================================
function checkPassword() {
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('passed') === 'true') {
        showMainContent(); 
        return; 
    }

    let passwordAttempt = prompt("Merhaba Beyza, burası sadece sana özel. Lütfen kodu girerek içeri gir. İpucu: En sevdiğin çiçek. :)");

    // Şifre kontrolü case-sensitive (Büyük/Küçük harf duyarlı)
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