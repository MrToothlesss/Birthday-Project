// script.js

// 1. Şifre Tanımlaması (Lütfen çiçek adıyla güncelleyin)
const CORRECT_PASSWORD = "zambak"; // Şifre güncellendi: "zambak"

// Hangi sesin çaldığını takip etmek için değişken
let currentAudio = null;

// Müzik çalma/durdurma fonksiyonu
function playMusic(trackId) {
    const audio = document.getElementById(trackId);

    // Başka bir ses çalıyorsa onu durdur
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
    }

    // Seçili sesi çal veya durdur (toggle)
    if (audio.paused) {
        // Tüm sesleri sıfırla (baştan çalması için)
        document.querySelectorAll('.music-track').forEach(track => {
            if (track !== audio) {
                track.currentTime = 0;
            }
        });
        
        // Mobil cihazın çalmaya izin vermesi için play komutu
        audio.play().catch(error => {
            console.error("Müzik çalma engellendi: ", error);
        });
        currentAudio = audio;
    } else {
        audio.pause();
        currentAudio = null;
    }
}


// Sayfa geçiş fonksiyonu
function changePage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden-page');
        page.classList.remove('active-page');
    });
    
    const nextPage = document.getElementById('page' + pageNumber);
    nextPage.classList.remove('hidden-page');
    nextPage.classList.add('active-page');

    // !!! ÖNEMLİ DÜZELTME: Sayfayı en üste kaydırır (Mobil Sorunu Çözümü) !!!
    window.scrollTo(0, 0); 
    
    // Bu satır, sayfa içi konteyneri kaydırıyordu, artık tüm tarayıcılar için window kullanıyoruz.
    // document.getElementById('container').scrollTop = 0;
}

// Şifre kontrolünü yapacak fonksiyon
function checkPassword() {
    let passwordAttempt = prompt("Merhaba Beyza, burası sadece sana özel. Lütfen kodu girerek içeri gir. Ben biliyorum Ama söylemicem İpucu en Sevdiğiniz Çiçek :)");

    if (passwordAttempt === CORRECT_PASSWORD) {
        document.getElementById('main-content').style.display = 'block'; 
        alert("Giriş başarılı. İyi eğlenceler! ❤️");
    } else if (passwordAttempt !== null && passwordAttempt !== "") {
        alert("Üzgünüm, kod yanlış. Lütfen tekrar dene.");
        checkPassword(); 
    } else {
        document.body.innerHTML = "<h1 style='text-align:center; padding-top: 100px; color: #ff69b4;'>Bu sayfa gizlidir.</h1><p style='text-align:center; color: #333;'>Lütfen doğru kodu bilerek tekrar deneyin.</p>";
    }
}

// Sayfa yüklendiğinde şifre kontrolünü otomatik başlat
window.onload = checkPassword;