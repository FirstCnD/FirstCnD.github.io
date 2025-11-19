document.addEventListener("DOMContentLoaded", function () {
    //타이핑효과
    new Typed("#typed-slogan", {
        strings: ["First is Best", "Best is First"],
        typeSpeed: 70,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        loopCount: Infinity,
        showCursor: true,
        cursorChar: "!",
    });

    //페이지스크롤
    new Swiper(".swiper", {
        direction: "vertical",
        effect: "slide",
        speed: 800,
        slidesPerView: "auto",
        spaceBetween: 0,
        mousewheel: true,
        resistanceRatio: 0,
    });

    //프로젝트
    const url = "https://docs.google.com/spreadsheets/d/1uVES6yn2785CfIa1XhozH8pQ4ejVl0zqmumjfQcqULM/gviz/tq?tqx=out:json&gid=1925241063";
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const json = JSON.parse(text.slice(47, -2));
            const keys = json.table.cols.map((c) => c.label);
            const data = json.table.rows.map((r) => Object.fromEntries(keys.map((key, i) => [key, r.c[i]?.v ?? ""]))).reverse();

            const wrapper = document.querySelector(".swiper-mainProjects .swiper-wrapper");
            data.forEach((project) => {
                const slide = document.createElement("a");
                slide.classList.add("swiper-slide");
                slide.classList.add("mainProjectSlide");
                slide.href = `Projects/${project.id}`;

                const img = document.createElement("img");
                img.classList.add("slideBackgroundImg");
                img.src = `/src/project-${project.id}-0.jpg`;
                img.alt = project.name;
                slide.appendChild(img);

                const content = document.createElement("div");
                content.classList.add("mainProjectContent");

                const status = document.createElement("small");
                status.classList.add("mainProjectStatus");
                status.textContent = project.status;
                content.appendChild(status);

                const title = document.createElement("div");
                title.classList.add("mainProjectTitle");

                const h = document.createElement("h5");
                h.textContent = project.name;
                title.appendChild(h);

                const hl = document.createElement("div");
                hl.classList.add("hl");
                title.appendChild(hl);

                content.appendChild(title);

                slide.appendChild(content);

                wrapper.appendChild(slide);
            });

            const projectSwiper = new Swiper(".swiper-mainProjects", {
                direction: "horizontal",
                effect: "slide",
                speed: 800,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                slidesPerView: 1,
                spaceBetween: 0,
                breakpoints: {
                    1200: { slidesPerView: 3 }
                },
                resistanceRatio: 0,
            });
            if (typeof projectSwiper !== "undefined" && projectSwiper.update) projectSwiper.update();
            else console.warn("Swiper instance not found or not ready for update. Ensure Swiper is initialized after data loading.");
        })
        .catch((error) => console.error("Error:", error));
});
