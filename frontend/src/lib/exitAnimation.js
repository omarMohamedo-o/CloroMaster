const ANIM_MS = 260;

export function ensureExitStyle() {
    if (document.getElementById('cm-back-exit-style')) return ANIM_MS;
    const style = document.createElement('style');
    style.id = 'cm-back-exit-style';
    style.innerHTML = `#cm-page-wrapper{transition:transform ${ANIM_MS}ms cubic-bezier(.2,.9,.3,1),opacity ${ANIM_MS}ms cubic-bezier(.2,.9,.3,1);} #cm-page-wrapper.cm-exit{transform:translateY(-18px);opacity:0;}`;
    document.head.appendChild(style);
    return ANIM_MS;
}

export function triggerExitAndNavigate(navigate, to, delayMs = ANIM_MS) {
    try {
        const wrapper = document.getElementById('cm-page-wrapper') || document.querySelector('main') || document.body;
        wrapper && wrapper.classList && wrapper.classList.add('cm-exit');
    } catch (err) {
        void err;
    }

    setTimeout(() => {
        navigate(to);
    }, delayMs);
}

export default {
    ensureExitStyle,
    triggerExitAndNavigate,
    ANIM_MS,
};
