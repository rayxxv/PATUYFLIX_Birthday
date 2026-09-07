/* ==========================================================================
   Fase 4: Virtual Envelope Logic (envelope.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');

    if (envelope) {
        envelope.addEventListener('click', () => {
            const innerEnvelope = envelope.querySelector('.envelope');
            if (innerEnvelope) {
                innerEnvelope.classList.toggle('open');
            }
        });
    }
});
