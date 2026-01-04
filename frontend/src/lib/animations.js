// Shared Framer Motion variants for reuse across components
// Updated to match exact animation specifications for optimal user experience
// Each variant returns an object usable by `motion`.

// Hero: Fade-in + upward, 900ms, ease-out (gentle fade instead of hard slide)
export const heroVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } }
};

// Section Titles: Bottom ↑, 40px distance, 700ms, ease-out, 50ms stagger
export const sectionTitleVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: i * 0.05 } })
};

// Text Blocks: Left ←, 50px distance, 700ms, ease-out, 80ms stagger (subtle more than dramatic)
export const textBlockVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: (i = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut', delay: i * 0.08 } })
};

// Images: Right →, 60px distance, 800ms, ease-out, 80ms stagger (balanced with text direction)
export const imageVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: (i = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut', delay: i * 0.08 } })
};

// Service Cards Container: Bottom ↑, 40px distance, 700ms, ease-out, 100ms stagger
export const serviceCardsContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Service Card Item: Bottom ↑, 40px distance, 700ms, ease-out (cards animate in staggered)
export const serviceCardItem = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
    hover: { y: -8, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } },
    tap: { scale: 0.97, transition: { duration: 0.12 } }
};

// Generic staggered item that accepts an index to stagger appearance
export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut', delay: i * 0.08 } })
};

// Services-specific variants for header, filters and items
export const servicesHeaderVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export const filtersContainer = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, delayChildren: 0.06 } }
};

export const filterItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    hover: { scale: 1.05, y: -2, transition: { duration: 0.12, ease: 'easeOut' } },
    tap: { scale: 0.95, transition: { duration: 0.08 } }
};

// Contact Form: Bottom ↑, 30px distance, 600ms, ease-out, 80ms stagger (slight, non-flashy reveal)
export const contactFormVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.08 } })
};

// FAQ Items: Bottom ↑, 20px distance, 600ms, ease-out, 50ms stagger (accordion-friendly)
export const faqItemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.05 } })
};

// Footer: Fade-in, 600ms, ease-out, 50ms stagger (simple and smooth)
export const footerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.05 } }
};

export default {
    heroVariant,
    sectionTitleVariant,
    textBlockVariant,
    imageVariant,
    serviceCardsContainer,
    serviceCardItem,
    staggerItem,
    servicesHeaderVariant,
    filtersContainer,
    filterItem,
    contactFormVariant,
    faqItemVariant,
    footerVariant
};

