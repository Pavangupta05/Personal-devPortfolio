const fs = require('fs');

// Read a base template page that has the navbar, magic cursor, theme script, and layout
const template = fs.readFileSync('experience.html', 'utf8');

const projectsContent = `
  <section id="projects" class="section pt-100">
    <h2 class="section-title">Featured Projects</h2>
    
    <div class="project-grid">
      <!-- Project 1 -->
      <div class="project-card scroll-reveal">
        <div class="project-info">
          <h3>StarNote AI</h3>
          <p>AI-powered Smart Study Platform. Generates summaries, quizzes, and notes from uploaded study materials.</p>
          <div class="project-tech">
            <span>React</span>
            <span>Node.js</span>
            <span>Gemini API</span>
          </div>
          <a href="https://starnote-ai.vercel.app" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top: 15px;">View Live</a>
        </div>
      </div>

      <!-- Project 2 -->
      <div class="project-card scroll-reveal">
        <div class="project-info">
          <h3>TalkNow Chat</h3>
          <p>Real-Time Chat Application featuring instant messaging, user presence, and group chats using WebSockets.</p>
          <div class="project-tech">
            <span>React</span>
            <span>Socket.io</span>
            <span>Express</span>
            <span>MongoDB</span>
          </div>
          <a href="https://chat-app-frontend-kappa-tan.vercel.app" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top: 15px;">View Live</a>
        </div>
      </div>

      <!-- Project 3 -->
      <div class="project-card scroll-reveal">
        <div class="project-info">
          <h3>Smart Civic Eye</h3>
          <p>AI Civic Issue Reporting System. Allows citizens to report issues with automated categorization and routing.</p>
          <div class="project-tech">
            <span>MERN Stack</span>
            <span>AI Classification</span>
            <span>Geolocation</span>
          </div>
          <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top: 15px;">View Live</a>
        </div>
      </div>
      
    </div>
  </section>
`;

// Find the <main> tag and replace its contents
// We will replace everything between <main> and </main> with the projects content
let newContent = template.replace(/<main>[\s\S]*?<\/main>/, '<main>\n' + projectsContent + '\n  </main>');

// Change the title
newContent = newContent.replace(/<title>.*?<\/title>/, '<title>Projects | Pavan Kumar Gupta</title>');

// Ensure nav links highlight the correct page (add .active class logic if applicable)
newContent = newContent.replace(/<a href="projects\.html">Projects<\/a>/, '<a href="projects.html" class="active">Projects</a>');
newContent = newContent.replace(/<a href="experience\.html" class="active">Experience<\/a>/, '<a href="experience.html">Experience</a>');

fs.writeFileSync('projects.html', newContent);
console.log('Created projects.html from template.');
