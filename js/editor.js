const htmlEd = document.getElementById('html');
const cssEd = document.getElementById('css');
const jsEd = document.getElementById('js');

// Create debounced version of run
const debouncedRun = debounce(run, 500);

// Enable Tab Indentation
[htmlEd, cssEd, jsEd].forEach(el => {
    el.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '  ');
        }
    });
    // Auto-run on typing
    el.addEventListener('input', debouncedRun);
});

// Mobile Tab Switching
function switchTab(index) {
    // Update tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, i) => {
        if (i === index) tab.classList.add('active');
        else tab.classList.remove('active');
    });

    // Update editors
    const groups = document.querySelectorAll('.editor-group');
    groups.forEach((group, i) => {
        if (i === index) group.classList.add('active');
        else group.classList.remove('active');
    });
}
