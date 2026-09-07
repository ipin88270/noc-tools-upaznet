with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

app_js = app_js.replace('"odc": "ODC BJI-01 UAB F1 (1)"', '"odc": "ODC BJI-02 UA F3 (1)"')
app_js = app_js.replace('"odc": "ODC BJI-01 UAC F1 (6)"', '"odc": "ODC BJI-02 UA F3 (1)"')
app_js = app_js.replace('"odc": "ODC BJI-01 UAF F1 (6)"', '"odc": "ODC BJI-02 UA F3 (1)"')
app_js = app_js.replace('"odc": "ODC BJI-01 UAH F2 (12)"', '"odc": "ODC BJI-02 UA F3 (1)"')
app_js = app_js.replace('"odc": "ODC BJI-01 UAJ F1 (9)"', '"odc": "ODC BJI-02 UA F3 (1)"')
app_js = app_js.replace('"odc": "ODC BJI-01 UAL F1 (11)"', '"odc": "ODC BJI-02 UA F3 (1)"')

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
