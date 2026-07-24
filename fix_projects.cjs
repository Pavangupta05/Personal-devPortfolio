const fs = require('fs');

const template = fs.readFileSync('experience.html', 'utf8');

const projectsContent = `
  <!-- Projects Section -->
  <section id="projects" class="section" style="padding-top: 100px;">
    <h2 class="section-title">Featured Projects</h2>
    
    <div class="project-grid" style="display: grid; gap: 2rem; max-width: 1200px; margin: 0 auto; padding: 0 20px;">
      
      <!-- Project 1 -->
      <div class="project-card scroll-reveal">
        <div class="project-info" style="padding: 2rem;">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--accent);">StarNote AI</h3>
          <p style="margin-bottom: 1.5rem;">An AI-powered Smart Study Platform that transforms the way you learn. Upload your study materials and it automatically generates comprehensive summaries, interactive quizzes, and organized notes to streamline your workflow.</p>
          <div class="badge-list" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1.5rem;">
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">React</span>
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">Node.js</span>
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">Gemini API</span>
          </div>
          <a href="https://starnote-ai.vercel.app" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-block;">View Live App</a>
        </div>
      </div>

      <!-- Project 2 -->
      <div class="project-card scroll-reveal">
        <div class="project-info" style="padding: 2rem;">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--accent);">TalkNow Chat</h3>
          <p style="margin-bottom: 1.5rem;">A high-performance Real-Time Chat Application featuring instant messaging, online user presence tracking, and dynamic group chats utilizing WebSockets for zero-latency communication.</p>
          <div class="badge-list" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1.5rem;">
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">React</span>
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">Socket.io</span>
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">Express</span>
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">MongoDB</span>
          </div>
          <a href="https://chat-app-frontend-kappa-tan.vercel.app" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-block;">View Live App</a>
        </div>
      </div>

      <!-- Project 3 -->
      <div class="project-card scroll-reveal">
        <div class="project-info" style="padding: 2rem;">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--accent);">Smart Civic Eye</h3>
          <p style="margin-bottom: 1.5rem;">An AI-driven Civic Issue Reporting System that empowers citizens to report public infrastructure issues. Uses automated AI categorization and geolocation routing to send tickets directly to the right authorities.</p>
          <div class="badge-list" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1.5rem;">
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">MERN Stack</span>
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">AI Classification</span>
            <span class="badge" style="background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">Geolocation</span>
          </div>
          <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: inline-block;">Repository</a>
        </div>
      </div>
      
    </div>
  </section>
`;

let newContent = template.replace(/<section id="experience"[\s\S]*?<\/section>\s*<section id="certificates"[\s\S]*?<\/section>/, projectsContent);

newContent = newContent.replace(/<title>.*?<\/title>/, '<title>Projects | Pavan Kumar Gupta</title>');
newContent = newContent.replace(/<a href="projects\.html">Projects<\/a>/, '<a href="projects.html" class="active">Projects</a>');
newContent = newContent.replace(/<a href="experience\.html" class="active">Experience<\/a>/, '<a href="experience.html">Experience</a>');

fs.writeFileSync('projects.html', newContent);
console.log('Fixed projects.html by actually removing the journey/certificates and injecting the projects grid!');
