// script.js

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// KULLANICININ ŞİFRE DEĞERİ KORUNDU
const CORRECT_PASSWORD = "Zambak"; 
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let currentTrack = null;

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
        }).catch(error => {
            console.error("Müzik çalma engellendi: ", error);
            if (button) button.textContent = "Müzik Başlatılamadı (Tekrar Deneyin)";
        });
    } else {
        audio.pause();
        localStorage.removeItem('playingTrackId');
        if (button) button.textContent = "Müziği Başlat / Duraklat";
        currentTrack = null;
    }
}

// =======================================================
// Müzik Durumunu Kaydetme Fonksiyonu (Sayfadan Ayrılırken)
// =======================================================
function saveMusicState() {
    // Sadece aktif olarak çalan bir parça varsa zamanı kaydet
    if (currentTrack && !currentTrack.paused) {
        localStorage.setItem('playbackTime', currentTrack.currentTime);
    }
}

// =======================================================
// Müzik Durumunu Geri Yükleme Fonksiyonu (Müzik sayfasına dönerken)
// =======================================================
function restoreMusicState() {
    const trackId = localStorage.getItem('playingTrackId');
    const time = parseFloat(localStorage.getItem('playbackTime'));
    
    // Daha önce çalmakta olan bir parça varsa
    if (trackId && !isNaN(time) && document.getElementById(trackId)) {
        const audio = document.getElementById(trackId);
        const button = document.querySelector(`[onclick="playMusic('${trackId}')"]`);
        
        audio.currentTime = time;
        audio.play().then(() => {
            currentTrack = audio;
            if (button) button.textContent = "Çalıyor... Duraklat";
        }).catch(error => {
            // Mobil cihazlarda otomatik çalma engellenirse butonu bilgilendir
            console.warn("Otomatik müzik geri yükleme engellendi (Mobil Kısıtlama): ", error);
            if (button) button.textContent = "Devam Etmek İçin Tekrar Tıklayın";
        });
    }
}

// =======================================================
// Sayfa Geçiş Fonksiyonu (KRİTİK GÜNCELLEME)
// =======================================================
function changePage(pageNumber) {
    // Sayfadan ayrılırken müzik durumunu kaydet
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
    
    // İçerik gösterildikten sonra Sayfa 1'e geç
    changePage(1); 
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

    // KRİTİK NOT: Şifre kontrolü case-sensitive (Büyük/Küçük harf duyarlı)
    if (passwordAttempt === CORRECT_PASSWORD) { 
        // Başarılıysa alert'i ve ana içeriği gösterme komutlarını kaldırıp DİREKT yönlendiriyoruz.
        window.location.replace("animation.html"); 
    } else if (passwordAttempt !== null && passwordAttempt !== "") {
        alert("Üzgünüm, kod yanlış. Lütfen tekrar dene.");
        checkPassword(); // Yanlışsa tekrar sor
    } else {
        // Kullanıcı İptal'e bastıysa
        document.body.innerHTML = "<h1 style='text-align:center; padding-top: 100px; color: #ff69b4;'>Bu sayfa gizlidir.</h1><p style='text-align:center; color: #f0f0f0;'>Lütfen doğru kodu bilerek tekrar deneyin.</p>";
    }
}

// Sayfa yüklendiğinde şifre kontrolünü hemen başlat
document.addEventListener('DOMContentLoaded', () => {
    // Container'ın varsayılan olarak gizlenmesi, şifre sorulmadan içeriğin görünmesini engeller.
    const container = document.getElementById('container');
    if (container) {
        container.style.display = 'none';
    }
    
    // Şifre kontrolünü başlat
    checkPassword();
});