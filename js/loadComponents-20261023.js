document.addEventListener("DOMContentLoaded", async () => {
    async function loadHTML(url, elementId) {
        const targetElement = document.getElementById(elementId);
        if (!targetElement) return;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} Could not load ${url}`);
            }
            const html = await response.text();
            targetElement.innerHTML = html;
        } catch (error) {
            console.error(`Error loading component from ${url}:`, error);
        }
    }

    loadHTML("/components/nav.html", "nav");
    loadHTML("/components/footer.html", "footer");

    const elA = document.querySelector(".typedA");
    const elB = document.querySelector(".typedB");
    if (elA && elB) {
        const data = [
            { a: "First is Best!", b: "Best is First!" },
            { a: "Best is First!", b: "First is Best!" },
        ];

        let setIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function syncTick() {
            const current = data[setIndex];
            const maxLen = Math.max(current.a.length, current.b.length);

            if (!isDeleting) {
                charIndex++;
                elA.textContent = current.a.slice(0, charIndex);
                elB.textContent = current.b.slice(0, charIndex);

                if (charIndex >= maxLen) {
                    isDeleting = true;
                    setTimeout(syncTick, 1800);
                    return;
                }
                setTimeout(syncTick, 100);
            } else {
                charIndex--;
                elA.textContent = current.a.slice(0, charIndex);
                elB.textContent = current.b.slice(0, charIndex);

                if (charIndex <= 0) {
                    isDeleting = false;
                    setIndex = (setIndex + 1) % data.length;
                    setTimeout(syncTick, 300);
                    return;
                }
                setTimeout(syncTick, 50);
            }
        }

        setTimeout(syncTick, 300);
    }

    const homeProjectsContainer = document.getElementById("homeProjects");
    if (homeProjectsContainer) {
        const swiperEl = homeProjectsContainer.querySelector(".swiper");
        const swiperWrapper = homeProjectsContainer.querySelector(".swiper-wrapper");
        if (swiperEl && swiperWrapper) {
            if (typeof Swiper === "undefined") {
                try {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement("script");
                        script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                } catch (error) {
                    console.error("Swiper 라이브러리 로드 실패:", error);
                }
            }

            const projects = [];
            let i = 0;
            let consecutiveMisses = 0;

            while (consecutiveMisses < 4) {
                try {
                    const response = await fetch(`/Projects/${i}/info.json`);
                    if (response.ok) {
                        const info = await response.json();
                        projects.push({
                            id: i,
                            name: info.name || "",
                            image: `/Projects/${i}/image-0.jpg`,
                            url: `/Projects/${i}/`,
                        });
                        consecutiveMisses = 0;
                    } else {
                        consecutiveMisses++;
                    }
                } catch {
                    consecutiveMisses++;
                }
                i++;
                if (i > 100) break;
            }

            if (projects.length > 0) {
                projects.sort((a, b) => b.id - a.id);

                swiperWrapper.innerHTML = projects
                    .map(
                        (p) => `
                    <div class="swiper-slide">
                        <div class="info"><h3>${p.name}</h3></div>
                        <a href="${p.url}">
                            <img src="${p.image}" alt="${p.name}" />
                            <div class="clickBox"><img src="/src/mouse-left.svg" /><span>프로젝트 보기</span></div>
                        </a>
                    </div>
                `
                    )
                    .join("");

                const imgElements = swiperWrapper.querySelectorAll("img");
                await Promise.all(
                    Array.from(imgElements).map((img) => {
                        if (img.complete) return Promise.resolve();
                        return new Promise((resolve) => {
                            img.addEventListener("load", resolve, { once: true });
                            img.addEventListener("error", resolve, { once: true });
                        });
                    })
                );

                if (typeof Swiper !== "undefined") {
                    new Swiper(swiperEl, {
                        speed: 1200,
                        slidesPerView: "auto",
                        centeredSlides: true,
                        spaceBetween: 32,

                        loop: projects.length >= 3,

                        observer: true,
                        observeParents: true,
                        resizeObserver: true,

                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true,
                        },
                        autoplay: projects.length >= 2 ? {
                            delay: 3600,
                            disableOnInteraction: false,
                        } : false,

                        on: {
                            init: function () {
                                this.update();
                            },
                        },
                    });
                }
            }
        }
    }

    const projectsContainer = document.getElementById("projects");
    if (projectsContainer) {
        try {
            const projectList = [];
            let i = 0;
            let consecutiveMisses = 0;

            while (consecutiveMisses < 4) {
                try {
                    const response = await fetch(`/Projects/${i}/info.json`);
                    if (response.ok) {
                        const info = await response.json();
                        projectList.push({
                            id: i,
                            name: info.name || `프로젝트 ${i}`,
                        });
                        consecutiveMisses = 0;
                    } else {
                        consecutiveMisses++;
                    }
                } catch {
                    consecutiveMisses++;
                }
                i++;
                if (i > 500) break;
            }

            projectList.reverse();

            if (projectList.length > 0) {
                let projectsHtml = "";
                for (const project of projectList) {
                    projectsHtml += `
                        <a href="/Projects/${project.id}/">
                            <img src="/Projects/${project.id}/image-0.jpg" />
                            <h4>${project.name}</h4>
                        </a>
                    `;
                }
                projectsContainer.innerHTML = projectsHtml;
            }
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    }

    const projectPlaceholder = document.getElementById("project");
    if (projectPlaceholder) {
        await loadHTML("/components/project.html", "project");

        let validImageCount = 0;

        try {
            const response = await fetch("./info.json");
            if (response.ok) {
                const info = await response.json();

                if (info.name) {
                    const el = projectPlaceholder.querySelector(".title");
                    if (el) el.textContent = info.name;
                    document.title = `FIRST C&D | ${info.name}`;
                }

                if (info.tag) {
                    const el = projectPlaceholder.querySelector(".tagBox");
                    if (el) {
                        let tagHtml = "";

                        info.tag.forEach((v) => {
                            tagHtml += `<div class="tag">${v}</div>`;
                        });

                        el.innerHTML = tagHtml;
                    }
                }

                const infoGroup = projectPlaceholder.querySelector(".infoGroup");
                if (info.addr) {
                    const el = projectPlaceholder.querySelector(".addr");
                    if (el) el.textContent = info.addr;
                    if (infoGroup) infoGroup.innerHTML += "<div>위치</div>";
                }

                if (info.use) {
                    const el = projectPlaceholder.querySelector(".use");
                    if (el) el.textContent = info.use;
                    if (infoGroup) infoGroup.innerHTML += "<div>용도</div>";
                }

                if (info.size) {
                    const el = projectPlaceholder.querySelector(".size");
                    if (el) el.textContent = info.size;
                    if (infoGroup) infoGroup.innerHTML += "<div>규모</div>";
                }

                if (info.area) {
                    const el = projectPlaceholder.querySelector(".area");
                    if (el) el.textContent = info.area;
                    if (infoGroup) infoGroup.innerHTML += "<div>면적</div>";
                }

                if (info.note) {
                    const el = projectPlaceholder.querySelector(".note");
                    if (el) el.textContent = info.note;
                    if (infoGroup) infoGroup.innerHTML += "<div>비고</div>";
                }

                const swiperWrapper = projectPlaceholder.querySelector(".swiper-wrapper");
                if (swiperWrapper) {
                    let slideHtml = "";
                    let i = 0;
                    let consecutiveMisses = 0;

                    while (consecutiveMisses < 4) {
                        try {
                            const imgRes = await fetch(`./image-${i}.jpg`);
                            if (imgRes.ok) {
                                slideHtml += `
                                    <div class="swiper-slide">
                                        <img src="./image-${i}.jpg" alt="${info.name || '프로젝트 이미지'} ${i + 1}" />
                                    </div>
                                `;
                                validImageCount++;
                                consecutiveMisses = 0;
                            } else {
                                consecutiveMisses++;
                            }
                        } catch {
                            consecutiveMisses++;
                        }

                        i++;
                        if (i > 100) break;
                    }

                    swiperWrapper.innerHTML = slideHtml;

                    const imgEl = swiperWrapper.querySelectorAll("img");
                    await Promise.all(
                        Array.from(imgEl).map((img) => {
                            if (img.complete) return Promise.resolve();
                            return new Promise((resolve) => {
                                img.addEventListener("load", resolve, { once: true });
                                img.addEventListener("error", resolve, { once: true });
                            });
                        })
                    );

                    const loadingEl = projectPlaceholder.querySelector(".loading");
                    loadingEl.innerHTML = "";
                }
            }
        } catch (error) {
            console.error("Error loading info.json or images:", error);
        }

        if (typeof Swiper !== "undefined" && validImageCount > 0) {
            const swiper = new Swiper("#project .swiper", {
                initialSlide: 0,
                speed: 1200,
                slidesPerView: "auto",
                centeredSlides: true,
                centeredSlidesBounds: false,
                slideToClickedSlide: true,
                spaceBetween: 32,

                observer: true,
                observeParents: true,
                resizeObserver: true,
                updateOnImagesReady: true,

                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                autoplay: {
                    delay: 3600,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    0: {
                        enabled: false,
                    },
                    769: {
                        enabled: true,
                    },
                },
                on: {
                    init: function () {
                        this.update();
                        this.slideTo(0, 0, false);
                    },
                },
            });
        }
    }

    const newsContainer = document.getElementById("news");
    if (newsContainer) {
        try {
            const newsList = [];
            let i = 0;
            let consecutiveMisses = 0;

            while (consecutiveMisses < 4) {
                try {
                    const response = await fetch(`/News/news-${i}.md`);
                    if (response.ok) {
                        const mdText = await response.text();
                        newsList.push(mdText);
                        consecutiveMisses = 0;
                    } else {
                        consecutiveMisses++;
                    }
                } catch {
                    consecutiveMisses++;
                }
                i++;
                if (i > 100) break;
            }

            newsList.reverse();

            if (newsList.length > 0) {
                let newsHtml = "";
                for (const mdText of newsList) {
                    const htmlContent =
                        typeof marked !== "undefined"
                            ? (typeof marked.parse === "function"
                                ? marked.parse(mdText)
                                : marked(mdText))
                            : mdText;

                    newsHtml += `
                        <article class="newsCard">
                            ${htmlContent}
                        </article>
                    `;
                }
                newsContainer.innerHTML = newsHtml;

                newsContainer.querySelectorAll("a").forEach((a) => {
                    a.setAttribute("target", "_blank");
                    a.setAttribute("rel", "noopener noreferrer");
                });
            }
        } catch (error) {
            console.error("Error loading news:", error);
        }
    }
});