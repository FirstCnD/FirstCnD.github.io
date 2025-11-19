document.addEventListener("DOMContentLoaded", function () {
    const projectPage = document.getElementById("projectPage");
    const id = Number(projectPage.className.replace("projectId-", ""));
    if (projectPage) {
        //프로젝트가져오기
        const url = "https://docs.google.com/spreadsheets/d/1uVES6yn2785CfIa1XhozH8pQ4ejVl0zqmumjfQcqULM/gviz/tq?tqx=out:json&gid=1925241063";
        fetch(url)
            .then((response) => response.text())
            .then((text) => {
                const json = JSON.parse(text.slice(47, -2));
                const keys = json.table.cols.map((c) => c.label);
                const data = json.table.rows.map((r) => Object.fromEntries(keys.map((key, i) => [key, r.c[i]?.v ?? ""])));
                const project = data.find(element => element.id === id);

                const titleContainer = document.createElement("div");
                titleContainer.classList.add("container");

                const title = document.createElement("h1");
                title.textContent = project.name;
                titleContainer.appendChild(title);

                const status = document.createElement("p");
                status.textContent = project.status;
                titleContainer.appendChild(status);

                projectPage.appendChild(titleContainer);

                const imgContainer = document.createElement("div");
                imgContainer.classList.add("container");

                const img = document.createElement("img");
                img.classList.add("projectImg");
                img.src = `/src/project-${project.id}-0.jpg`;
                img.alt = project.name;
                imgContainer.appendChild(img);

                projectPage.appendChild(imgContainer);

                const contentContainer = document.createElement("div");
                contentContainer.classList.add("container");

                const table = document.createElement("table");
                const tbody = document.createElement("tbody");
                if (project.address) tbody.appendChild(createRow("위치", project.address));
                if (project.use) tbody.appendChild(createRow("용도", project.use));
                if (project.size) tbody.appendChild(createRow("규모", project.size));
                if (project.area) tbody.appendChild(createRow("연면적", project.area));
                if (project.type) tbody.appendChild(createRow("사업유형", project.type));
                if (project.note) tbody.appendChild(createRow("비고", project.note));
                table.appendChild(tbody);
                contentContainer.appendChild(table);

                projectPage.appendChild(contentContainer);

                const etcContainer = document.createElement("div");
                etcContainer.classList.add("container");

                const menu = document.createElement("a");
                menu.classList.add("menuLink");
                menu.textContent = "목록으로";
                menu.href = "/Projects";
                etcContainer.appendChild(menu);

                projectPage.appendChild(etcContainer);
            })
            .catch((error) => console.error("Error:", error));
    }
});

function createRow(label, value) {
    const row = document.createElement("tr");

    const cellLabel = document.createElement("td");
    cellLabel.classList.add("projectTableLabelCell");
    const labelArry = Array.from(label);
    labelArry.forEach((char) => {
        const p = document.createElement("p");
        p.textContent = char;
        cellLabel.appendChild(p);
    });
    row.appendChild(cellLabel);

    const cellValue = document.createElement("td");
    cellValue.classList.add("projectTableValueCell");
    cellValue.textContent = value;
    row.appendChild(cellValue);

    return row;
}