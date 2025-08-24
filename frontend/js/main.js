function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function handleSubmit(event) {
    event.preventDefault();
    const feedbackEl = document.getElementById('formFeedback');
    feedbackEl.textContent = "Thank you! Your message has been sent.";
    setTimeout(() => feedbackEl.textContent = "", 4000);
    event.target.reset();
    return false;
}

// Scroll animations
const sections = document.querySelectorAll("section");
window.addEventListener("scroll", () => {
    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            sec.style.opacity = 1;
            sec.style.transform = "translateY(0)";
        }
    });
});