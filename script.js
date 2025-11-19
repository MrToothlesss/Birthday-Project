// script.js

const CORRECT_PASSWORD = "Zambak";
let currentAudio = null;

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
        }
    });

    const button = document.querySelector(`[onclick="playMusic('${trackId}')"]`);
    if (audio.paused) {
        audio.play().catch(error => {
            console.error("Müzik çalma engellendi: ", error);
            if (button) button.textContent = "Müzik Başlatılamadı";
        });
        if (button) button.textContent = "Çalıyor... Duraklat";
        currentAudio = audio;
    } else {
        audio.pause();
        if (button) button.textContent = "Müziği Başlat / Duraklat";
        currentAudio = null;
    }
}

// =======================================================
// Sayfa Geçiş Fonksiyonu
// =======================================================
function changePage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden-page');
        page.classList.remove('active-page');
    });
    
    const nextPage = document.getElementById('page' + pageNumber);
    if (nextPage) {
        nextPage.classList.remove('hidden-page');
        nextPage.classList.add('active-page');
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
    // 1. Gizlenen ana içeriği göster
    const container = document.getElementById('container');
    if (container) {
        container.style.display = 'block';
    } 
    
    // 2. Arka planı koyudan açık renge çevir
    document.body.classList.add('page-loaded');

    // 3. KRİTİK: URL'yi temizle (Yenilemede tekrar şifre sorması için)
    const cleanUrl = window.location.pathname;
    history.replaceState(null, '', cleanUrl); 
}


// =======================================================
// Şifre Kontrolü Fonksiyonu (Sayfa Girişi)
// =======================================================
function checkPassword() {
    
    // 1. URL KONTROLÜ: Eğer adreste "?passed=true" varsa (animasyondan dönüldüyse)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('passed') === 'true') {
        showMainContent(); // İçeriği göster ve URL'yi temizle
        return; 
    }

    // 2. ŞİFRE İSTEME: Orijinal prompt mesajı korundu
    let passwordAttempt = prompt("Merhaba Beyza, burası sadece sana özel. Lütfen kodu girerek içeri gir. İpucu: En sevdiğin çiçek. :)");

    if (passwordAttempt === CORRECT_PASSWORD) {
        // İSTENEN DÜZELTME: Başarı alert'i ve tekrar butona basma kaldırıldı
        window.location.replace("animation.html"); 
    } else if (passwordAttempt !== null && passwordAttempt !== "") {
        alert("Üzgünüm, kod yanlış. Lütfen tekrar dene.");
        checkPassword(); // Yanlışsa tekrar sor
    } else {
        // Kullanıcı İptal'e bastıysa
        document.body.innerHTML = "<h1 style='text-align:center; padding-top: 100px; color: #ff69b4;'>Bu sayfa gizlidir.</h1><p style='text-align:center; color: #f0f0f0;'>Lütfen doğru kodu bilerek tekrar deneyin.</p>";
    }
}

// Sayfa yüklendiğinde şifre kontrolünü hemen başlat (Erken çalışması için)
document.addEventListener('DOMContentLoaded', checkPassword);