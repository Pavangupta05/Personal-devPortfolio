const fs = require('fs');

const files = ['index.html', 'about.html', 'skills.html', 'experience.html', 'projects.html', 'contact.html'];

const newNavbar = `
  <nav class="desktop-navbar">
    <div class="nav-glass-container">
      <div class="nav-links-pill">
        <a href="index.html" class="nav-icon" data-page="index">
          <i class="fa-solid fa-house"></i>
          <span class="nav-tooltip">Home</span>
        </a>
        <a href="about.html" class="nav-icon" data-page="about">
          <i class="fa-regular fa-user"></i>
          <span class="nav-tooltip">About</span>
        </a>
        <a href="skills.html" class="nav-icon" data-page="skills">
          <i class="fa-solid fa-code"></i>
          <span class="nav-tooltip">Skills</span>
        </a>
        <a href="experience.html" class="nav-icon" data-page="experience">
          <i class="fa-solid fa-briefcase"></i>
          <span class="nav-tooltip">Experience</span>
        </a>
        <a href="projects.html" class="nav-icon" data-page="projects">
          <i class="fa-regular fa-folder-open"></i>
          <span class="nav-tooltip">Projects</span>
        </a>
        <a href="javascript:void(0)" onclick="openTerminal()" class="nav-icon" id="terminalNavBtn">
          <i class="fa-solid fa-terminal"></i>
          <span class="nav-tooltip">Terminal</span>
        </a>
        <a href="javascript:void(0)" onclick="toggleCameraScroll()" class="nav-icon" id="cameraScrollBtn">
          <i class="fa-solid fa-hand-pointer"></i>
          <span class="nav-tooltip">Gesture</span>
        </a>
        
        <div class="nav-divider"></div>

        <button id="themeToggleDesktop" class="theme-toggle nav-icon" aria-label="Toggle Theme">
          <i class="fa-solid fa-moon"></i>
          <span class="nav-tooltip">Theme</span>
        </button>
      </div>
    </div>
  </nav>
`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Regex to match the entire <nav class="desktop-navbar"> block
    const navRegex = /<nav class="desktop-navbar">[\s\S]*?<\/nav>/;
    
    if (navRegex.test(html)) {
      html = html.replace(navRegex, newNavbar.trim());
      fs.writeFileSync(file, html);
      console.log('Updated navbar in ' + file);
    } else {
      console.log('Could not find desktop-navbar in ' + file);
    }
  }
});
