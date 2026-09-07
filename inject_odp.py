import json

odp_data = [
    ["ODP BJI-01 UA 1", "ODC BJI-01 UAB F1 (1)", 8, 4, "1:8", -16.4, "-8.077227, 111.905664"],
    ["ODP BJI-01 UA 2", "ODC BJI-01 UAB F1 (1)", 8, 1, "1:8", -16.5, "-8.077395, 111.906059"],
    ["ODP BJI-01 UA 3", "ODC BJI-01 UAB F1 (1)", 8, 0, "1:8", -15.6, "-8.077884, 111.905587"],
    ["ODP BJI-01 UA 4", "ODC BJI-01 UAB F1 (1)", 8, 3, "1:8", -16.3, "-8.078330, 111.905470"],
    ["ODP BJI-01 UA 5", "ODC BJI-01 UAB F1 (1)", 8, 3, "1:8", -16.1, "-8.078496, 111.905459"],
    ["ODP BJI-01 UA 6", "ODC BJI-01 UAB F1 (1)", 8, 4, "1:8", -16.8, "-8.078516, 111.905665"],
    ["ODP BJI-01 UA 7", "ODC BJI-01 UAB F1 (1)", 8, 5, "1:8", -16.2, "-8.078500, 111.905901"],
    ["ODP BJI-01 UB 1", "ODC BJI-01 UAC F1 (6)", 8, 2, "1:8", -15.2, "-8.077595, 111.914285"],
    ["ODP BJI-01 UB 2", "ODC BJI-01 UAC F1 (6)", 8, 1, "1:8", -16.0, "-8.077353, 111.914275"],
    ["ODP BJI-01 UB 3", "ODC BJI-01 UAC F1 (6)", 8, 3, "1:8", -16.4, "-8.077054, 111.914270"],
    ["ODP BJI-01 UB 4", "ODC BJI-01 UAC F1 (6)", 8, 4, "1:8", -16.1, "-8.076823, 111.914264"],
    ["ODP BJI-01 UB 5", "ODC BJI-01 UAC F1 (6)", 8, 2, "1:8", -16.9, "-8.076596, 111.914259"],
]

points = []
for row in odp_data:
    points.append({
        "type": "odp",
        "name": row[0],
        "odc": row[1],
        "capacity": row[2],
        "idle": row[3],
        "splitter": row[4],
        "attenuation": row[5],
        "coordinates": row[6],
        "customers": row[2] - row[3]
    })

json_str = json.dumps(points, indent=2)

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Inject into app.js
injection = f"""
const staticOdpPoints = {json_str};
staticOdpPoints.forEach(pt => {{
    const idx = FTTH_POINTS.findIndex(p => p.type === 'odp' && p.name === pt.name);
    if (idx !== -1) FTTH_POINTS[idx] = pt;
    else FTTH_POINTS.push(pt);
}});
"""

# Let's insert this right after FTTH_POINTS.splice(0, FTTH_POINTS.length, ...loadedPoints);
target_line = "FTTH_POINTS.splice(0, FTTH_POINTS.length, ...loadedPoints);"
idx = app_js.find(target_line)
if idx != -1:
    new_app = app_js[:idx + len(target_line)] + "\n" + injection + app_js[idx + len(target_line):]
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(new_app)
    print("Injected static ODP points.")
else:
    print("Could not find target line.")
