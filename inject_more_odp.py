import json

more_odp_data = [
    ["ODP BJI-01 UC 1", "ODC BJI-01 UAF F1 (6)", 8, 4, "1:8", -15.9, "-8.082006, 111.905470"],
    ["ODP BJI-01 UC 2", "ODC BJI-01 UAF F1 (6)", 8, 3, "1:8", -16.4, "-8.082335, 111.905664"],
    ["ODP BJI-01 UC 3", "ODC BJI-01 UAF F1 (6)", 8, 0, "1:8", -17.0, "-8.082695, 111.906059"],
    ["ODP BJI-01 UC 4", "ODC BJI-01 UAF F1 (6)", 8, 3, "1:8", -15.8, "-8.083050, 111.905587"],
    ["ODP BJI-01 UC 5", "ODC BJI-01 UAF F1 (6)", 8, 2, "1:8", -16.5, "-8.083420, 111.905470"],
    ["ODP BJI-01 UC 6", "ODC BJI-01 UAF F1 (6)", 8, 1, "1:8", -16.1, "-8.083816, 111.905459"],
    ["ODP BJI-01 UC 7", "ODC BJI-01 UAF F1 (6)", 8, 4, "1:8", -16.7, "-8.084155, 111.905665"],
    ["ODP BJI-01 UD 1", "ODC BJI-01 UAH F2 (12)", 8, 2, "1:8", -16.2, "-8.077227, 111.905664"],
    ["ODP BJI-01 UD 2", "ODC BJI-01 UAH F2 (12)", 8, 1, "1:8", -16.0, "-8.077395, 111.906059"],
    ["ODP BJI-01 UD 3", "ODC BJI-01 UAH F2 (12)", 8, 0, "1:8", -15.6, "-8.077884, 111.905587"],
    ["ODP BJI-01 UD 4", "ODC BJI-01 UAH F2 (12)", 8, 2, "1:8", -16.4, "-8.078330, 111.905470"],
    ["ODP BJI-01 UD 5", "ODC BJI-01 UAH F2 (12)", 8, 1, "1:8", -15.9, "-8.078496, 111.905459"],
    ["ODP BJI-01 UD 6", "ODC BJI-01 UAH F2 (12)", 8, 0, "1:8", -16.1, "-8.078516, 111.905665"],
    ["ODP BJI-01 UD 7", "ODC BJI-01 UAH F2 (12)", 8, 3, "1:8", -16.8, "-8.078500, 111.905901"],
    ["ODP BJI-01 UE 1", "ODC BJI-01 UAJ F1 (9)", 8, 1, "1:8", -15.2, "-8.077595, 111.914285"],
    ["ODP BJI-01 UE 2", "ODC BJI-01 UAJ F1 (9)", 8, 4, "1:8", -16.0, "-8.077353, 111.914275"],
    ["ODP BJI-01 UE 3", "ODC BJI-01 UAJ F1 (9)", 8, 2, "1:8", -16.4, "-8.077054, 111.914270"],
    ["ODP BJI-01 UE 4", "ODC BJI-01 UAJ F1 (9)", 8, 1, "1:8", -16.1, "-8.076823, 111.914264"],
    ["ODP BJI-01 UE 5", "ODC BJI-01 UAJ F1 (9)", 8, 3, "1:8", -16.9, "-8.076596, 111.914259"],
    ["ODP BJI-01 UF 1", "ODC BJI-01 UAL F1 (11)", 8, 2, "1:8", -16.2, "-8.076595, 111.914285"],
    ["ODP BJI-01 UF 2", "ODC BJI-01 UAL F1 (11)", 8, 1, "1:8", -16.5, "-8.076353, 111.914275"],
    ["ODP BJI-01 UF 3", "ODC BJI-01 UAL F1 (11)", 8, 4, "1:8", -16.1, "-8.076054, 111.914270"],
    ["ODP BJI-01 UF 4", "ODC BJI-01 UAL F1 (11)", 8, 2, "1:8", -15.8, "-8.075823, 111.914264"],
    ["ODP BJI-01 UF 5", "ODC BJI-01 UAL F1 (11)", 8, 0, "1:8", -16.7, "-8.075596, 111.914259"]
]

points = []
for row in more_odp_data:
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
# Remove opening and closing brackets so we can inject into existing array
json_str = json_str.strip()[1:-1].strip()

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Find the end of staticOdpPoints array and inject the new ones
target_search = "];\\nstaticOdpPoints.forEach"
idx = app_js.find(target_search)
if idx != -1:
    new_app = app_js[:idx] + ",\n  " + json_str + "\n" + app_js[idx:]
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(new_app)
    print("Injected 24 MORE ODP points.")
else:
    print("Could not find target line for injection.")
