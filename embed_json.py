import json
import re

with open('ftth-odc-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

odc_points = []
for item in data['odc']:
    odc_points.append({
        'type': 'odc',
        'id': item['id'],
        'name': item['nama'],
        'olt': item['olt'],
        'interface': item['interface'],
        'splitter': item['splitter'],
        'attenuation': item['redaman'],
        'odp': item['oop'],
        'customers': item['pelanggan'],
        'description': item.get('keterangan', ''),
        'coordinates': ", ".join(map(str, item['koordinat']))
    })

json_str = json.dumps(odc_points, indent=2)

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# We need to replace the fetch block inside initializeAppStorage
fetch_block_start = """  try {
    const res = await fetch('ftth-odc-data.json');"""
fetch_block_end = """  } catch (err) {
    console.error("Error loading ftth-odc-data.json", err);
  }"""

start_idx = app_js.find(fetch_block_start)
end_idx = app_js.find(fetch_block_end) + len(fetch_block_end)

if start_idx != -1 and end_idx != -1:
    replacement = f"""  const jsonOdcPoints = {json_str};
  const jsonOdcNames = new Set(jsonOdcPoints.map(p => p.name));
  loadedPoints = loadedPoints.filter(p => p.type !== 'odc' || !jsonOdcNames.has(p.name));
  loadedPoints.push(...jsonOdcPoints);"""
    
    new_app_js = app_js[:start_idx] + replacement + app_js[end_idx:]
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(new_app_js)
    print("Replaced fetch block with static data.")
else:
    print("Fetch block not found.")
