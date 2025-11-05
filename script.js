// script.js

// SADECE BEYZA'NIN BİLDİĞİ ŞİFREYİ BURAYA YAZIN
const CORRECT_PASSWORD = "12ocak"; 

// Sayfa geçiş fonksiyonu (Mevcut fonksiyonunuz korunmuştur)
function changePage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden-page');
        page.classList.remove('active-page');
    });
    const nextPage = document.getElementById('page' + pageNumber);
    nextPage.classList.remove('hidden-page');
    nextPage.classList.add('active-page');
    // Sayfayı yukarı kaydır (okunabilirliği artırmak için)
    document.getElementById('container').scrollTop = 0;
}

// Şifre kontrolünü yapacak fonksiyon
function checkPassword() {
    // Tarayıcının açtığı şifre penceresi
    let passwordAttempt = prompt("Merhaba Beyza, burası sadece sana özel. Lütfen kodu girerek içeri gir.");

    // Şifre kontrolü
    if (passwordAttempt === CORRECT_PASSWORD) {
        // Doğru şifre girilirse içeriği göster
        document.getElementById('main-content').style.display = 'block'; 
        document.getElementById('container').style.display = 'flex'; 
        alert("Giriş başarılı. İyi eğlenceler! ❤️");
    } else if (passwordAttempt !== null && passwordAttempt !== "") {
        // Yanlış şifre girilirse tekrar denemesini iste
        alert("Üzgünüm, kod yanlış. Lütfen tekrar dene.");
        checkPassword(); // Tekrar denemesi için fonksiyonu yeniden çağır
    } else {
        // Kullanıcı İptal'e bastıysa veya boş bıraktıysa
        document.body.innerHTML = "<h1 style='text-align:center; padding-top: 100px; color: #ff69b4;'>Bu sayfa gizlidir.</h1><p style='text-align:center; color: #333;'>Lütfen doğru kodu bilerek tekrar deneyin.</p>";
    }
}

// Sayfa yüklendiğinde şifre kontrolünü otomatik başlat
window.onload = checkPassword;