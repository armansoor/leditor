// DOM Elements
const libSelector = document.getElementById('libSelector');
const presetSelector = document.getElementById('presetSelector');

// --- LIBRARY MANAGEMENT ---

libSelector.addEventListener('change', (e) => {
    const lib = e.target.value;
    if (lib && LIBRARIES[lib]) {
        if(!activeLibs.has(lib)) {
            activeLibs.add(lib);
            showToast(`Added ${lib}`);
            run(); // Auto-refresh with new lib
        }
    }
    e.target.value = ""; // Reset selector
});

// --- PRESET MANAGEMENT ---

presetSelector.addEventListener('change', (e) => {
    const val = e.target.value;
    const htmlEd = document.getElementById('html');
    const cssEd = document.getElementById('css');
    const jsEd = document.getElementById('js');

    // Handle User Presets
    if (val.startsWith('user:')) {
        const name = val.split('user:')[1];
        const stored = JSON.parse(localStorage.getItem('genEditor_presets') || '{}');
        const p = stored[name];
        if (p) {
            htmlEd.value = p.h;
            cssEd.value = p.c;
            jsEd.value = p.j;
            activeLibs = new Set(p.libs || []); // Restore libs
            run();
        }
    }
    // Handle Default Boilerplates
    else if (DEFAULTS[val]) {
        const p = DEFAULTS[val];
        htmlEd.value = p.h;
        cssEd.value = p.c;
        jsEd.value = p.j;
        activeLibs.clear(); // Defaults usually start clean
        run();
    }
    e.target.value = ""; // Reset dropdown
});

// --- SHARE & DOWNLOAD ---

function downloadProject() {
    const htmlEd = document.getElementById('html');
    const cssEd = document.getElementById('css');
    const jsEd = document.getElementById('js');

    const html = htmlEd.value;
    const css = cssEd.value;
    const js = jsEd.value;

    // Create a complete HTML file
    const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GenEditor Project</title>
    ${Array.from(activeLibs).map(lib => LIBRARIES[lib]).join('\n    ')}
    <style>
${css}
    </style>
</head>
<body>
${html}

<script>
${js}
<\/script>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function shareProject() {
    const htmlEd = document.getElementById('html');
    const cssEd = document.getElementById('css');
    const jsEd = document.getElementById('js');

    const state = {
        h: htmlEd.value,
        c: cssEd.value,
        j: jsEd.value,
        l: Array.from(activeLibs)
    };

    try {
        const json = JSON.stringify(state);
        // simple encoding, not very compact but works without libs
        const encoded = btoa(encodeURIComponent(json));
        window.location.hash = encoded;

        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast("Link copied to clipboard!"))
            .catch(() => showToast("URL updated (Copy manually)"));

    } catch(e) {
        console.error(e);
        showToast("Error generating link");
    }
}

// Init
window.onload = () => {
    loadPresetsUI();

    const htmlEd = document.getElementById('html');
    const cssEd = document.getElementById('css');
    const jsEd = document.getElementById('js');

    // Check for shared project in URL hash
    if (window.location.hash.length > 1) {
        try {
            const encoded = window.location.hash.substring(1);
            const json = decodeURIComponent(atob(encoded));
            const state = JSON.parse(json);

            if (state.h !== undefined) htmlEd.value = state.h;
            if (state.c !== undefined) cssEd.value = state.c;
            if (state.j !== undefined) jsEd.value = state.j;

            activeLibs.clear();
            if (state.l && Array.isArray(state.l)) {
                state.l.forEach(lib => activeLibs.add(lib));
            }

            run();
            showToast("Project Loaded from URL");
            return;
        } catch (e) {
            console.error("Failed to load shared project", e);
            showToast("Invalid Shared Link");
        }
    }

    // Load Flexbox starter by default if no hash
    const p = DEFAULTS.flex;
    if(htmlEd && cssEd) {
        htmlEd.value = p.h;
        cssEd.value = p.c;
    }
    run();
};

// --- RESIZABLE PANES ---
const resizer = document.getElementById('resizer');
const container = document.querySelector('.main-container');
const previewFrame = document.getElementById('preview');

let isResizing = false;

if (resizer) {
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        resizer.classList.add('dragging');
        document.body.style.cursor = 'row-resize';
        if (previewFrame) previewFrame.style.pointerEvents = 'none'; // Prevent iframe from capturing mouse
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        // Calculate offset relative to container
        const containerRect = container.getBoundingClientRect();
        const y = e.clientY - containerRect.top;
        const totalHeight = containerRect.height;

        // Constraints (min 50px for top and bottom)
        if (y < 50 || y > totalHeight - 50) return;

        const topHeight = y;
        const bottomHeight = totalHeight - y - 6; // 6 is resizer height

        container.style.gridTemplateRows = `${topHeight}px 6px ${bottomHeight}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('dragging');
            document.body.style.cursor = 'default';
            if (previewFrame) previewFrame.style.pointerEvents = 'auto';
        }
    });
}
