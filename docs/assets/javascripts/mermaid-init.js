document.addEventListener('DOMContentLoaded', function() {
  if (typeof mermaid !== 'undefined') {
    try {
      mermaid.initialize({ startOnLoad: true });
    } catch (e) {
      console.warn('Mermaid init failed:', e);
    }
  }
});
