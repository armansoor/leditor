const userGroup = document.getElementById('userPresetsGroup');

function loadPresetsUI() {
    // Clear existing user options
    userGroup.innerHTML = "";

    // Get from LocalStorage
    const stored = JSON.parse(localStorage.getItem('genEditor_presets') || '{}');

    for (const name in stored) {
        const opt = document.createElement('option');
        opt.value = `user:${name}`;
        opt.textContent = name;
        userGroup.appendChild(opt);
    }
}

function saveUserPreset() {
    const htmlEd = document.getElementById('html');
    const cssEd = document.getElementById('css');
    const jsEd = document.getElementById('js');

    const name = prompt("Name your preset:");
    if (!name) return;

    const data = {
        h: htmlEd.value,
        c: cssEd.value,
        j: jsEd.value,
        libs: Array.from(activeLibs)
    };

    const stored = JSON.parse(localStorage.getItem('genEditor_presets') || '{}');
    stored[name] = data;
    localStorage.setItem('genEditor_presets', JSON.stringify(stored));

    loadPresetsUI();
    showToast("Preset Saved!");
}
