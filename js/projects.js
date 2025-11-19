AOS.init({
    duration: 800,
    once: true,
});

document.addEventListener("DOMContentLoaded", function () {
    //프로젝트
    const url = "https://docs.google.com/spreadsheets/d/1uVES6yn2785CfIa1XhozH8pQ4ejVl0zqmumjfQcqULM/gviz/tq?tqx=out:json&gid=1925241063";
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const json = JSON.parse(text.slice(47, -2));
            const keys = json.table.cols.map((c) => c.label);
            const data = json.table.rows.map((r) => Object.fromEntries(keys.map((key, i) => [key, r.c[i]?.v ?? ""]))).reverse();

            const wrapper = document.querySelector(".projectsContainer");
            data.forEach((project) => {
                const item = document.createElement("a");
                item.classList.add("projectItem");
                item.setAttribute('data-aos', 'fade-up');
                item.href = `${project.id}`;

                const img = document.createElement("img");
                img.classList.add("projectItemImg");
                img.src = `/src/project-${project.id}-0.jpg`;
                img.alt = project.name;
                item.appendChild(img);

                const content = document.createElement("div");
                content.classList.add("projectContent");

                const status = document.createElement("small");
                status.classList.add("projectStatus");
                status.textContent = project.status;
                content.appendChild(status);

                const title = document.createElement("div");
                title.classList.add("projectTitle");

                const h = document.createElement("h5");
                h.textContent = project.name;
                title.appendChild(h);

                const hl = document.createElement("div");
                hl.classList.add("hl");
                title.appendChild(hl);

                content.appendChild(title);

                item.appendChild(content);

                wrapper.appendChild(item);
            });
        })
        .catch((error) => console.error("Error:", error));
});
