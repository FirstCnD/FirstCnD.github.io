// Google tag (gtag.js) - 비동기 스크립트 로드
(function () {
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-KZR18FMNE4";
    document.head.appendChild(script);
})();

// dataLayer 설정 및 gtag 함수 정의
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}

// 기본 설정
gtag("js", new Date());
gtag("config", "G-KZR18FMNE4");