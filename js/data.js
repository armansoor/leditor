// CDN Mappings for Libraries
const LIBRARIES = {
    bootstrap: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">',
    tailwind: '<script src="https://cdn.tailwindcss.com"><\/script>',
    vue: '<script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>',
    react: '<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>\n<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>',
    jquery: '<script src="https://code.jquery.com/jquery-3.6.0.min.js"><\/script>'
};

// Standard Boilerplates
const DEFAULTS = {
    empty: { h: '', c: '', j: '' },
    flex: {
        h: '<div class="box">\n  Centered Content\n</div>',
        c: 'body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  font-family: sans-serif;\n  background: #f0f0f0;\n}\n\n.box {\n  padding: 2rem;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}',
        j: ''
    },
    grid: {
        h: '<div class="grid">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n  <div class="item">4</div>\n</div>',
        c: '.grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 10px;\n  padding: 20px;\n}\n\n.item {\n  background: #3b82f6;\n  color: white;\n  padding: 20px;\n  text-align: center;\n  font-family: sans-serif;\n}',
        j: ''
    }
};
