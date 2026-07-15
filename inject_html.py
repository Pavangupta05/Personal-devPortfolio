import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

injection = """
  <!-- 3D BOOT SCREEN -->
  <div id="boot-screen">
    <div class="boot-content">
      <div class="boot-logo">SYS.BOOT</div>
      <div class="boot-bar"><div class="boot-progress"></div></div>
      <div class="boot-text">INITIALIZING UNIVERSE...</div>
    </div>
  </div>

  <!-- PLANET TOOLTIP -->
  <div id="planet-tooltip" class="planet-tooltip hidden">
    <div class="tooltip-title">UNKNOWN</div>
    <div class="tooltip-sub">SECTOR</div>
  </div>
"""

if 'id="boot-screen"' not in content:
    content = content.replace('<body>', '<body>\n' + injection)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    print('ALREADY EXISTS')
