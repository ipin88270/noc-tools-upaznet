import re

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Add global var if not exists
if 'let ftthLogicalLines = [];' not in app_js:
    idx_markers = app_js.find('let ftthMapMarkers = [];')
    app_js = app_js[:idx_markers] + 'let ftthMapMarkers = [];\nlet ftthLogicalLines = [];' + app_js[idx_markers + len('let ftthMapMarkers = [];'):]

# Update updateFtthMap
idx_update = app_js.find('function updateFtthMap(points, searchedCoordinates = null) {')
idx_marker_remove = app_js.find('ftthMapMarkers.forEach(marker => marker.remove());', idx_update)
app_js = app_js[:idx_marker_remove] + 'ftthMapMarkers.forEach(marker => marker.remove());\n    if (typeof ftthLogicalLines !== "undefined") { ftthLogicalLines.forEach(line => line.remove()); ftthLogicalLines = []; }\n' + app_js[idx_marker_remove + len('ftthMapMarkers.forEach(marker => marker.remove());'):]

# Add line generation at the end of updateFtthMap before if (searchedCoordinates)
idx_searched = app_js.find('if (searchedCoordinates) {', idx_update)

injection = """
    // Draw logical connections ODP -> ODC
    if (typeof ftthLogicalLines !== "undefined") {
      points.forEach(point => {
        if (point.type === 'odp' && point.odc) {
          const odcPoint = points.find(p => p.type === 'odc' && p.name === point.odc);
          if (odcPoint) {
             const p1 = getPointPosition(point);
             const p2 = getPointPosition(odcPoint);
             const line = L.polyline([p1, p2], { color: '#22a06b', weight: 2, dashArray: '5 5', opacity: 0.6 }).addTo(ftthMap);
             ftthLogicalLines.push(line);
          }
        }
      });
    }
    
    """

app_js = app_js[:idx_searched] + injection + app_js[idx_searched:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print('Added automatic logical routes to map.')
