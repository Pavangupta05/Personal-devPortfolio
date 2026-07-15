import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        if (hoveredMesh !== mesh) {
          if (hoveredMesh) hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale);
          hoveredMesh = mesh;
          hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale * 1.35); """

replacement = """        if (hoveredMesh !== mesh) {
          if (hoveredMesh) hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale);
          hoveredMesh = mesh;
          hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale * 1.35); 
          if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover();"""

if target in content:
    content = content.replace(target, replacement)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: Audio added to planets')
else:
    print('TARGET NOT FOUND')
