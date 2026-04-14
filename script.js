const contactToggle = document.getElementById("contactToggle");
const contactCard = document.getElementById("contactCard");
const revealItems = document.querySelectorAll(".reveal");

if (contactToggle && contactCard) {
    contactToggle.addEventListener("click", () => {
        const isOpen = contactToggle.getAttribute("aria-expanded") === "true";

        contactToggle.setAttribute("aria-expanded", String(!isOpen));
        contactToggle.textContent = isOpen ? "Mostrar contatos" : "Ocultar contatos";
        contactCard.hidden = isOpen;
    });
}

if ("IntersectionObserver" in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}
