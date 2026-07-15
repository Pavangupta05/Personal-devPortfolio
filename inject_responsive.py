import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update resize() function
old_resize = """    function resize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      composer.setSize(container.clientWidth, container.clientHeight);
    }"""

new_resize = """    function resize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      composer.setSize(container.clientWidth, container.clientHeight);
      
      // Responsive Robot Placement
      if (window.robotModel) {
        if (window.innerWidth < 768) {
          window.robotModel.scale.set(2, 2, 2); // Smaller on mobile
          window.robotModel.position.set(0, 320, 600); // Center on mobile
        } else {
          window.robotModel.scale.set(3.5, 3.5, 3.5);
          window.robotModel.position.set(20, 328, 620); // Right side on desktop
        }
      }
    }"""

if old_resize in content:
    content = content.replace(old_resize, new_resize)

# 2. Add resize() inside GLTFLoader
target = "window.robotModel = model;"
if target in content and "resize(); // Trigger initial responsive placement" not in content:
    content = content.replace(target, target + "\n      if (typeof resize === 'function') resize(); // Trigger initial responsive placement")

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
