import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

gltf_script = '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>'
target = '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>'

if 'GLTFLoader.js' not in content:
    content = content.replace(target, target + '\n  ' + gltf_script)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    print('ALREADY INSTALLED')
