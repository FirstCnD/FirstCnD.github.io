AOS.init({
    duration: 800,
    once: true,
});

document.addEventListener("DOMContentLoaded", function () {
    //회사소식
    const url = "https://docs.google.com/spreadsheets/d/1dZL16-g_qtiOfsyO6JzoAhDQMmayCJXsI_UgVKN3Odc/gviz/tq?tqx=out:json&gid=504485254";
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const json = JSON.parse(text.slice(47, -2));
            const keys = json.table.cols.map((c) => c.label);
            const data = json.table.rows.map((r) => Object.fromEntries(keys.map((key, i) => [key, r.c[i]?.v ?? ""]))).reverse();

            const wrapper = document.querySelector(".newsContainer");
            data.forEach((data) => {
                const card = document.createElement("div");
                card.classList.add("newsCard");
                card.setAttribute('data-aos', 'fade-up');

                const title = document.createElement("h5");
                title.classList.add("newsTitle");
                title.textContent = data.title;
                card.appendChild(title);

                const date = document.createElement("small");
                date.classList.add("newsDate");
                date.textContent = `${data.year}.${String(data.month).replace(/^(\d)$/, '0$1')}.${String(data.day).replace(/^(\d)$/, '0$1')}`;
                card.appendChild(date);

                if (data.link) {
                    card.appendChild(document.createElement("br"));

                    const link = document.createElement("a");
                    link.classList.add("newsLink");
                    link.href = data.link;
                    link.target = "_blank";
                    link.textContent = "󰀸 기사보기";
                    card.appendChild(link);
                }

                const text = document.createElement("p");
                text.classList.add("newsText");
                text.textContent = data.text;
                card.appendChild(text);

                const pageNum = document.createElement("small");
                pageNum.textContent = `- ${data.num} -`;
                card.appendChild(pageNum);

                wrapper.appendChild(card);
            });
        })
        .catch((error) => console.error("Error:", error));
});
