document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const menuToggle = document.getElementById("menuToggle");
    const mainMenu = document.getElementById("mainMenu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sectionTriggers = document.querySelectorAll("[data-section]");
    const sections = document.querySelectorAll(".page-section");

    // ---------------------------------------------------------
    // Pantalla de carga
    // ---------------------------------------------------------
    window.setTimeout(() => {
        loader.classList.add("loaded");
        document.body.classList.add("ready");
    }, 1750);

    // ---------------------------------------------------------
    // Navegación SPA
    // ---------------------------------------------------------
    function showSection(id, updateHash = true) {
        const target = document.getElementById(id);
        if (!target) return;

        sections.forEach(section => {
            section.classList.toggle("active", section.id === id);
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.section === id);
        });

        mainMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        if (updateHash) {
            history.replaceState(null, "", `#${id}`);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    sectionTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => showSection(trigger.dataset.section));
    });

    const initialSection = window.location.hash.replace("#", "");
    if (initialSection && document.getElementById(initialSection)) {
        showSection(initialSection, false);
    }

    // ---------------------------------------------------------
    // Menú móvil
    // ---------------------------------------------------------
    menuToggle.addEventListener("click", () => {
        const isOpen = mainMenu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", event => {
        if (!mainMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            mainMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    // ---------------------------------------------------------
    // Filtros de evidencias
    // ---------------------------------------------------------
    const filterButtons = document.querySelectorAll(".filter-btn");
    const evidenceCards = document.querySelectorAll(".evidence-card");
    const emptyEvidence = document.getElementById("emptyEvidence");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            let visible = 0;

            filterButtons.forEach(btn => btn.classList.toggle("active", btn === button));

            evidenceCards.forEach(card => {
                const matches = filter === "all" || card.dataset.category === filter;
                card.hidden = !matches;
                if (matches) visible++;
            });

            emptyEvidence.hidden = visible !== 0;
        });
    });

    // ---------------------------------------------------------
    // Buscador de matriz IA
    // ---------------------------------------------------------
    const searchInput = document.getElementById("iaSearch");
    const rows = document.querySelectorAll(".ia-row");
    const noResults = document.getElementById("noResults");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        let visibleRows = 0;

        rows.forEach(row => {
            const text = row.dataset.search.toLowerCase();
            const matches = query === "" || text.includes(query);
            row.hidden = !matches;
            if (matches) visibleRows++;
        });

        noResults.hidden = visibleRows !== 0;
    });

    // ---------------------------------------------------------
    // Copiar prompts
    // ---------------------------------------------------------
    document.querySelectorAll(".copy-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const row = button.closest(".ia-row");
            const prompt = row.querySelector(".prompt-text").innerText.trim();
            const original = button.innerText;

            try {
                await navigator.clipboard.writeText(prompt);
            } catch {
                const area = document.createElement("textarea");
                area.value = prompt;
                area.style.position = "fixed";
                area.style.opacity = "0";
                document.body.appendChild(area);
                area.focus();
                area.select();
                document.execCommand("copy");
                area.remove();
            }

            button.innerText = "¡Copiado!";
            button.classList.add("copied");

            window.setTimeout(() => {
                button.innerText = original;
                button.classList.remove("copied");
            }, 1500);
        });
    });
});
