// Normalize phone numbers for display: convert Arabic-Indic digits to ASCII
export default function formatPhoneForDisplay(input = '', /* optional */ _language) {
    try {
        const s = String(input || '');

        // Map Arabic-Indic and Eastern Arabic-Indic digits to ASCII 0-9
        const map = {
            '\u0660': '0', '\u0661': '1', '\u0662': '2', '\u0663': '3', '\u0664': '4', '\u0665': '5', '\u0666': '6', '\u0667': '7', '\u0668': '8', '\u0669': '9',
            '\u06F0': '0', '\u06F1': '1', '\u06F2': '2', '\u06F3': '3', '\u06F4': '4', '\u06F5': '5', '\u06F6': '6', '\u06F7': '7', '\u06F8': '8', '\u06F9': '9'
        };

        let out = '';
        for (const ch of s) {
            if (map[ch]) out += map[ch];
            else out += ch;
        }

        // Trim and squash multiple spaces
        out = out.replace(/\s+/g, ' ').trim();

        return out;
    } catch (e) {
        return String(input || '');
    }
}
