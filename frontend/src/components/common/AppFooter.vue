<script setup>
</script>

<template>
  <footer class="app-footer">
    <div class="footer-main">
      <div class="footer-container">
        <div class="footer-brand">
          <img src="@/assets/images/adelaide-university-logo.png" alt="Adelaide University" class="footer-logo-img" />
          <p>Adelaide University Program Roadmap - helping students navigate their academic journey with confidence.</p>
        </div>

        <div class="footer-column">
          <h4>Study at Adelaide</h4>
          <ul>
            <li><RouterLink to="/explore">Explore Programs</RouterLink></li>
            <li><RouterLink to="/explore?level=undergraduate">Undergraduate Degrees</RouterLink></li>
            <li><RouterLink to="/explore?level=postgraduate">Postgraduate Coursework</RouterLink></li>
            <li><RouterLink to="/explore/apply">How to Apply</RouterLink></li>
            <li><RouterLink to="/explore/careers">Careers & Employability</RouterLink></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Current Students</h4>
          <ul>
            <li><RouterLink to="/student">My Dashboard</RouterLink></li>
            <li><RouterLink to="/student/roadmap">Study Roadmap</RouterLink></li>
            <li><RouterLink to="/student/industry">Industry Connections</RouterLink></li>
            <li><RouterLink to="/student/alumni">Alumni Network</RouterLink></li>
            <li><RouterLink to="/student/resources">Student Resources</RouterLink></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>About the University</h4>
          <ul>
            <li><a href="https://www.adelaide.edu.au" target="_blank" rel="noopener">Adelaide University</a></li>
            <li><a href="https://www.adelaide.edu.au/faculties" target="_blank" rel="noopener">Faculties & Divisions</a></li>
            <li><a href="https://www.adelaide.edu.au/library/" target="_blank" rel="noopener">Library</a></li>
            <li><a href="https://www.adelaide.edu.au/newsroom" target="_blank" rel="noopener">News & Events</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p>&copy; 2026 Adelaide University Program Roadmap. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Accessibility</a>
          <a href="#">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
}

.footer-main {
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-2xl) 0;
}

.footer-container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: var(--space-2xl);
}

.footer-logo-img {
  height: 36px;
  width: auto;
  margin-bottom: var(--space-md);
  filter: brightness(0) invert(1);
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.footer-column h4 {
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-md);
}

.footer-column ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-column a {
  color: rgba(255, 255, 255, 0.65);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.footer-column a:hover {
  color: var(--color-white);
}

.footer-bottom {
  background: var(--color-primary-dark);
  padding: var(--space-md) 0;
}

.footer-bottom-inner {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.4);
  font-size: var(--font-size-xs);
}

.footer-bottom-links {
  display: flex;
  gap: var(--space-lg);
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.4);
  font-size: var(--font-size-xs);
  transition: color var(--transition-fast);
}

.footer-bottom-links a:hover {
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .footer-bottom-inner {
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
  }
}
</style>
