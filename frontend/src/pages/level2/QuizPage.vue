<script setup>
import { ref } from 'vue'

const highlights = [
  {
    title: 'Discovery Quiz',
    description: 'Take a comprehensive psychometric assessment designed specifically for higher education selection.',
    icon: 'fact_check',
    category: 'quiz',
  },
  {
    title: 'Smart Matching',
    description: 'Our algorithm compares your profile against thousands of academic programs to find your perfect fit.',
    icon: 'auto_awesome',
    category: 'matching',
  },
  {
    title: 'Growth Path',
    description: 'Receive a personalized roadmap including recommended courses, internships, and potential career outcomes.',
    icon: 'trending_up',
    category: 'path',
  },
]

function getCategoryColor(cat) {
  const colors = {
    facilities: '#1976d2', clubs: '#6a1b9a', city: '#2e7d32', accommodation: '#e65100',
  };
  return colors[cat] || '#140f50';
}

const selectedAnswer = ref({})
const finalFaculty = ref('')
const current = ref(0)
const showResult = ref(false)
const startQuiz = ref(false)
const facultyScore = ref({
  'Sciences, Engineering and Technology':0,
  'Accounting, Commerce & Economics':0,
  'Health & Biomedical Sciences':0,
  'Arts, Humanities & Social Sciences':0
})

const questions = [
  {
    question: "What type of activity do you enjoy most?",
    answers: {
      a: { text: "Building apps or coding", faculty: "Sciences, Engineering and Technology" },
      b: { text: "Managing money or business plans", faculty: "Accounting, Commerce & Economics" },
      c: { text: "Helping people with health", faculty: "Health & Biomedical Sciences" },
      d: { text: "Designing or creating artwork", faculty: 'Arts, Humanities & Social Sciences' }
    }
  },
   {
    question: "Which subject interests you the most?",
    answers: {
      a: { text: "Programming and technology", faculty: "Sciences, Engineering and Technology" },
      b: { text: "Marketing and finance", faculty: "Accounting, Commerce & Economics" },
      c: { text: "Biology and human body", faculty: "Health & Biomedical Sciences" },
      d: { text: "Music, drawing or design", faculty: 'Arts, Humanities & Social Sciences' }
    }
  },

  {
    question: "What kind of work environment do you prefer?",
    answers: {
      a: { text: "Working with computers and systems", faculty: "Sciences, Engineering and Technology" },
      b: { text: "Office with meetings and teamwork", faculty: "Accounting, Commerce & Economics" },
      c: { text: "Hospitals or clinics", faculty: "Health & Biomedical Sciences" },
      d: { text: "Studio or creative space", faculty: 'Arts, Humanities & Social Sciences' }
    }
  }
]

function start() {
  startQuiz.value= true;
}


function nextQuestion() {
  current.value ++;
}

function previousQuestion() {
  current.value --;
}

function submit() {
  //Empty the score
  facultyScore.value = {
     'Sciences, Engineering and Technology':0,
     'Accounting, Commerce & Economics':0,
     'Health & Biomedical Sciences':0,
     'Arts, Humanities & Social Sciences':0
  }

  //A loop for all questions
  for(let i = 0; i < questions.length; i++){
    const currKey = selectedAnswer.value[i]
    const faculty = questions[i].answers[currKey].faculty
    facultyScore.value[faculty]++
  }

  //find the max value
  let maxValue = 0
  let maxFaculty = ''
  for(const f in facultyScore.value){
    if (facultyScore.value[f] > maxValue) {
      maxFaculty = f
      maxValue = facultyScore.value[f]

    }
  }
  finalFaculty.value = maxFaculty
  showResult.value = true

}
</script>


<template>
  <div class="quiz-hero">
      <div class="hero-inner">
      <h1>Explore your future</h1>
      <p>Find university majors that match your interests, strengths, and career goals.</p>
      </div>

    </div>

  <div v-if = !startQuiz>
    <div class="section-welcome">
      <div class="welcome-content">
        <div class="welcome-text">
        <h2>Your future starts with a single choice</h2>
        <p>Navigating academic paths can be overwhelming. Our intelligent discovery system helps you map your unique journey by analyzing your personality, academic background, and professional aspirations. Discover the major that doesn't just fit your resume, but fits your life.</p>
        <button class="btn btn-primary" @click = "start">
                Get Started
        </button>
      </div>
      <div class="welcome-image">
       <img
        src="@/assets/images/campus.webp"
        alt="University campus"
        class="hero-image"
      />
      </div>
      </div>

     <!-- Highlights Grid -->
    <div class="highlights-grid">
        <div v-for="h in highlights" :key="h.title" class="highlight-card">
          <div class="highlight-icon" :style="{ background: getCategoryColor(h.category) + '12', color: getCategoryColor(h.category) }">
            <span class="material-symbols-outlined">{{ h.icon }}</span>
          </div>
          <h3>{{ h.title }}</h3>
          <p>{{ h.description }}</p>
        </div>
      </div>

    </div>






  </div>
  <div v-else-if="!showResult" class="quiz-page">
      <div class="quiz-container">
      <p class="question">{{questions[current]['question']}}</p>
      <div class="option-container">
         <label v-for="(answer,key) in questions[current]['answers']" :key="key" class="quiz-option" :class="{selected: selectedAnswer[current] === key}">
        <input type="radio" :id="key" :value="key" v-model = "selectedAnswer[current]"/>
        {{ answer.text }}
        </label>
      </div>
      <div class="button-container">
        <button v-if = "current > 0" @click="previousQuestion" class="nav-button prev-button">
        &lt; Back
        </button>

        <button
        v-if="current < questions.length - 1"
        @click="nextQuestion" class="nav-button next-button" :disabled="!selectedAnswer[current]"> Next &gt; </button>

      <button v-else class="nav-button next-button" @click="submit" :disabled="!selectedAnswer[current]"> Submit</button>
      </div>

    </div>
  </div>

  <div v-else class="section-welcome section-result">
     <div class="result-container quiz-container">
      <div class="result-symbol">
        <span class="material-symbols-outlined ">psychology</span>
      </div>
       <p>Your recommended faculty is</p>
       <div class="result-faculty">
          <p>{{ finalFaculty }}</p>
       </div>

      <!-- Going to the program -->
       <RouterLink
    :to="{
    path: '/explore',
    query: {
      faculty: finalFaculty
    }
   }" class="btn btn-primary">
            View Your Programs
            <span class="material-symbols-outlined">arrow_forward</span>
          </RouterLink>
     </div>

  </div>



</template>

<style scoped>
.quiz-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 24px;

}

.quiz-hero { width: 100%; background: var(--color-primary); color: var(--color-white); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { margin: 0 auto; text-align: center; }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); color:white; }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.8; }

.section-welcome {
  max-width: 1200px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg);

}
.welcome-content {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: var(--space-2xl);
  align-items: center;
}


.welcome-text h2{
  font-weight: 700;
}
.welcome-text p {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-top: var(--space-lg);
}

.welcome-text button {
  font-weight: 600;
  font-size: 15px;
  margin-top: var(--space-xl);
  padding: var(--space-md) var(--space-md);
  background-color: var(--color-primary-light);
  display: block;

}

.welcome-image img{
  object-fit: cover;
  border-radius: 14px;
  display: block;
  box-shadow: var(--shadow-lg);
}



.quiz-container {
  margin-top:var(--space-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  width: 760px;
  margin-bottom: 48px;
  margin-left: auto;
  margin-right: auto;

  padding: 64px 64px;

}

.question {
  font-weight: 600;
  font-size:var(--font-size-lg);
  line-height: 1.3;
}

.option-container {
margin-top: 24px;
display:flex;
flex-direction: column;
justify-content: center;
gap:24px;
}



.quiz-option {
  margin-top: 4px;
  background-color: #ffff;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-xl);
  padding: 16px 24px;
  transition: var(--transition-slow);

}

.quiz-option:hover,
.selected{
 background-color: var(--color-gray-50);
 border-color: var(--color-gray-500);

  cursor: pointer;
}

input[type="radio"]{
  display:none;
}

.button-container {
  display:flex;

  justify-content: space-between;
  margin-top: var(--space-xl);

}

.nav-button {
  background-color: var(--color-primary-light);
  padding:8px 16px;
  border-radius:9999px;
  color:#ffff;
  font-weight: 600;
  font-size:var(--font-size-sm);

  transition: all var(--transition-fast);
}

.nav-button:hover {

  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}





button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}


.highlights-grid {
  margin-top: var(--space-3xl);
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg); margin-bottom: var(--space-3xl);
}

.highlight-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-xl);
  transition: all var(--transition-fast);
}

.highlight-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.highlight-icon {
  width: 56px; height: 56px; border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-md);
}
.highlight-icon .material-symbols-outlined { font-size: 28px; }

.highlight-card h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.highlight-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }

/* ==========================================
   RESULT
   ========================================== */

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: var(--space-lg);

}
.result-symbol {
  width: 52px;
  height: 52px;
  background-color:  var(--color-gray-50);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-result {
  font-weight: 600;
}

.result-faculty {
  background-color: var(--color-gray-50);
  padding: var(--space-lg);

  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-lg);
  color: var(--color-primary);
}

.section-result .btn:hover {
  color:white;
}

.section-result .btn, .result-faculty{
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
}



/* ==========================================
   RESPONSIVE
   ========================================== */

@media (max-width: 768px) {
  .welcome-content {
    grid-template-columns: 1fr;
  }

  .welcome-text{
    justify-items: center;
  }

  .quiz-container {
    width: 90%;
  }
}

@media (max-width: 557px){
.highlights-grid{
    grid-template-columns: 1fr;
  }

}
</style>
