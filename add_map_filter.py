with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add the filter dropdown to ftth-route-toolbar
target = '<div class="ftth-route-toolbar">'
idx = html.find(target)
if idx != -1:
    injection = '<select id="ftthMapFilter" class="ftth-map-filter"><option value="all">Semua Titik (ODP/ODC/OTB)</option><option value="odp">Hanya ODP</option><option value="odc">Hanya ODC</option><option value="otb">Hanya OTB</option></select>'
    html = html[:idx + len(target)] + injection + html[idx + len(target):]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected HTML filter.")
else:
    print("Could not find target in HTML.")

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Update updateFtthMap in app.js
idx_update = app_js.find('function updateFtthMap(points, searchedCoordinates = null) {')
idx_location_counts = app_js.find('const locationCounts = new Map();', idx_update)

injection_js = """
    const filterVal = document.getElementById('ftthMapFilter') ? document.getElementById('ftthMapFilter').value : 'all';
    if (filterVal !== 'all') {
        points = points.filter(p => p.type === filterVal);
    }
"""

if idx_location_counts != -1:
    app_js = app_js[:idx_location_counts] + injection_js + '    ' + app_js[idx_location_counts:]

# Add event listener for the dropdown
idx_listeners = app_js.find('document.querySelectorAll(\'.ftth-menu-item\').forEach')
if idx_listeners != -1:
    listener_js = "  const mapFilter = document.getElementById('ftthMapFilter');\n  if(mapFilter) mapFilter.addEventListener('change', () => { if(typeof updateFtthMap === 'function') updateFtthMap(typeof FTTH_POINTS !== 'undefined' ? FTTH_POINTS : []); });\n"
    app_js = app_js[:idx_listeners] + listener_js + app_js[idx_listeners:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Injected JS logic.")
