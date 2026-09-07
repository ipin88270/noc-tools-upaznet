with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
idx = content.find('id="ftthMap"')
if idx != -1:
    print(content[max(0, idx-500):idx+500])
else:
    print("Not found")
