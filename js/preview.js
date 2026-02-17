const preview = document.getElementById('preview');
const consoleDiv = document.getElementById('console');

function toggleConsole() {
    consoleDiv.classList.toggle('open');
}

window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'console') {
        const entry = document.createElement('div');
        entry.className = `console-entry ${event.data.level}`;
        entry.textContent = event.data.msg;
        consoleDiv.appendChild(entry);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }
});

function run() {
    const htmlEd = document.getElementById('html');
    const cssEd = document.getElementById('css');
    const jsEd = document.getElementById('js');

    // Clear console content but keep the header
    // Using simple approach: removing all div.console-entry
    const entries = consoleDiv.querySelectorAll('.console-entry');
    entries.forEach(e => e.remove());

    // Build the library strings
    const libTags = Array.from(activeLibs).map(key => LIBRARIES[key]).join('\n');

    // Console interception script
    const consoleScript = `
        <script>
            (function() {
                const oldLog = console.log;
                const oldError = console.error;
                const oldWarn = console.warn;

                function send(level, args) {
                    try {
                        const msg = args.map(arg => {
                            if (typeof arg === 'object') {
                                try {
                                    return JSON.stringify(arg, null, 2);
                                } catch(e) {
                                    return arg.toString();
                                }
                            }
                            return String(arg);
                        }).join(' ');
                        window.parent.postMessage({ type: 'console', level: level, msg: msg }, '*');
                    } catch(e) {
                        window.parent.postMessage({ type: 'console', level: 'error', msg: 'Console Error: ' + e.message }, '*');
                    }
                }

                console.log = function(...args) { oldLog.apply(console, args); send('log', args); };
                console.error = function(...args) { oldError.apply(console, args); send('error', args); };
                console.warn = function(...args) { oldWarn.apply(console, args); send('warn', args); };

                window.onerror = function(msg, url, line) {
                    send('error', [msg + ' (Line ' + line + ')']);
                    return false;
                };
            })();
        <\/script>
    `;

    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${consoleScript}
            ${libTags}
            <style>${cssEd.value}</style>
        </head>
        <body>
            ${htmlEd.value}
            <script>
                try {
                    ${jsEd.value}
                } catch(e) {
                    console.error(e);
                }
            <\/script>
        </body>
        </html>
    `;

    const doc = preview.contentDocument || preview.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
}
