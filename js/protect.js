// Chặn tải ảnh/video: tắt chuột phải, kéo thả và giữ lâu trên điện thoại
(function () {
  var st = document.createElement('style');
  st.textContent = 'img,video,picture{-webkit-user-drag:none;user-drag:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}';
  document.head.appendChild(st);
  function media(t) { return t && t.closest && t.closest('img,video,picture,figure,[style*="background-image"]'); }
  document.addEventListener('contextmenu', function (e) { if (media(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { if (media(e.target)) e.preventDefault(); });
  function lockVideos() {
    document.querySelectorAll('video').forEach(function (v) {
      v.setAttribute('controlsList', 'nodownload noremoteplayback');
      v.setAttribute('disablePictureInPicture', '');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lockVideos); else lockVideos();
})();
