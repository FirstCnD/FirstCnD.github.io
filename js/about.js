import orgList from "../src/orgList.json" with { type: "json" };

document.addEventListener("DOMContentLoaded", function () {
    //회사연혁
    const historyUrl = "https://docs.google.com/spreadsheets/d/1WB8OPBkD9od20Bykf24ohgM8KUO_P3IobzAQpWWAE8A/gviz/tq?tqx=out:json&gid=510425057";
    fetch(historyUrl)
        .then((response) => response.text())
        .then((text) => {
            const json = JSON.parse(text.slice(47, -2));
            const keys = json.table.cols.map((c) => c.label);
            const data = json.table.rows.map((r) => Object.fromEntries(keys.map((key, i) => [key, r.c[i]?.v ?? ""])));
            const grouped = Object.values(
                data.reduce((acc, cur) => {
                    if (!acc[cur.year]) acc[cur.year] = { year: cur.year, items: [] };
                    acc[cur.year].items.push(cur);
                    return acc;
                }, {})
            );

            const wrapper = document.querySelector(".swiper-history .swiper-wrapper");
            grouped.forEach((yearGroup) => {
                const slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                slide.classList.add("historySlide");

                const year = document.createElement("h2");
                year.classList.add("historyYear");
                year.textContent = yearGroup.year;
                slide.appendChild(year);

                const line = document.createElement("div");
                line.classList.add("historyLine");
                slide.appendChild(line);

                const events = document.createElement("div");
                events.classList.add("historyEvents");

                yearGroup.items.forEach((event, i) => {
                    const item = document.createElement("div");
                    item.classList.add("historyEvent");

                    const lines = document.createElement("div");
                    lines.classList.add("historyLines");

                    const up = document.createElement("div");
                    up.classList.add("historyLineUp");
                    lines.appendChild(up);

                    if (i !== yearGroup.items.length - 1) {
                        const dn = document.createElement("div");
                        dn.classList.add("historyLineDn");
                        lines.appendChild(dn);
                    }

                    item.appendChild(lines);

                    const date = document.createElement("p");
                    date.textContent = `${event.year}.${String(event.month).padStart(2, "0")}`;
                    item.appendChild(date);

                    const subItem = document.createElement("div");

                    const title = document.createElement("p");
                    title.textContent = event.title;
                    subItem.appendChild(title);

                    const content = document.createElement("small");
                    content.textContent = event.content;
                    subItem.appendChild(content);

                    item.appendChild(subItem);

                    events.appendChild(item);
                });

                slide.appendChild(events);

                wrapper.appendChild(slide);
            });

            const historySwiper = new Swiper(".swiper-history", {
                direction: "horizontal",
                loop: true,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false
                },
                effect: "slide",
                speed: 4000,
                slidesPerView: 1,
                breakpoints: {
                    768: { slidesPerView: 2, },
                    1200: { slidesPerView: 3, },
                },
                resistanceRatio: 0,
                allowTouchMove: true,
            });
            historySwiper.on("touchStart", () => { historySwiper.autoplay.stop(); });
            historySwiper.on("touchEnd", () => { setTimeout(() => { historySwiper.autoplay.start(); }, 4000); });
        })
        .catch((error) => console.error("Error:", error));

    //회사조직
    const orgContainer = document.querySelector(".orgContainer");
    const orgGroup = createOrgGroup(orgList.name, orgList.works, orgList.teams, false, false);
    orgContainer.appendChild(orgGroup);

    //관계사
    const subsidiaryUrl = "https://docs.google.com/spreadsheets/d/1ebrTsuUboGFem5HwOZ5MANewG6um47ALxqi5Gh8gvE8/gviz/tq?tqx=out:json&gid=95387645";
    fetch(subsidiaryUrl)
        .then((response) => response.text())
        .then((text) => {
            const json = JSON.parse(text.slice(47, -2));
            const keys = json.table.cols.map((c) => c.label);
            const data = json.table.rows.map((r) => Object.fromEntries(keys.map((key, i) => [key, r.c[i]?.v ?? ""]))).reverse();

            const container = document.querySelector(".subsidiary");
            data.forEach((item) => {
                const element = document.createElement("p");
                element.textContent = item.name;
                container.appendChild(element);
            });
        })
        .catch((error) => console.error("Error:", error));
});

function createOrgGroup(name, works, teams = [], isLast = false, hasLine = true) {
    const element = document.createElement("div");
    element.classList.add("orgElement");

    if (hasLine) {
        const lines = document.createElement("div");
        lines.classList.add("orgLines");

        const up = document.createElement("div");
        up.classList.add("orgLineUp");
        lines.appendChild(up);

        if (!isLast) {
            const dn = document.createElement("div");
            dn.classList.add("orgLineDn");
            lines.appendChild(dn);
        }

        element.appendChild(lines);
    }

    const team = document.createElement("div");
    team.classList.add("orgTeam");

    const teamName = document.createElement("h6");
    teamName.textContent = name;
    team.appendChild(teamName);

    const worksList = document.createElement("div");
    worksList.classList.add("orgWork");
    works.forEach(work => {
        const workItem = document.createElement("p");
        workItem.textContent = work;
        worksList.appendChild(workItem);
    });
    team.appendChild(worksList);

    element.appendChild(team);

    teams.forEach((team, i) => {
        const teamElement = createOrgGroup(team.name, team.works, team.teams, i === teams.length - 1);
        element.appendChild(teamElement);
    });

    return element;
}