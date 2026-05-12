<script setup>
import { computed, ref } from 'vue';

const selectedAnswer = ref({});
const finalFaculty = ref('');
const current = ref(0);
const showResult = ref(false);
const hasStarted = ref(false);

const questions = [
  {
    question: 'Which type of study activity interests you most?',
    answers: {
      a: { text: 'Building software, systems, or digital products', faculty: 'Sciences, Engineering and Technology' },
      b: { text: 'Analysing business decisions, finance, or markets', faculty: 'Accounting, Commerce & Economics' },
      c: { text: 'Understanding health, biology, or human wellbeing', faculty: 'Health & Biomedical Sciences' },
      d: { text: 'Exploring society, culture, communication, or creative practice', faculty: 'Arts, Humanities & Social Sciences' },
    },
  },
  {
    question: 'Which subject area would you prefer to explore further?',
    answers: {
      a: { text: 'Computing, engineering, data, or cybersecurity', faculty: 'Sciences, Engineering and Technology' },
      b: { text: 'Accounting, commerce, economics, or management', faculty: 'Accounting, Commerce & Economics' },
      c: { text: 'Biomedical science, health systems, or clinical practice', faculty: 'Health & Biomedical Sciences' },
      d: { text: 'Arts, design, media, humanities, or social sciences', faculty: 'Arts, Humanities & Social Sciences' },
    },
  },
  {
    question: 'What kind of professional environment sounds most suitable?',
    answers: {
      a: { text: 'Technology teams, laboratories, or engineering projects', faculty: 'Sciences, Engineering and Technology' },
      b: { text: 'Business teams, consulting, finance, or enterprise planning', faculty: 'Accounting, Commerce & Economics' },
      c: { text: 'Healthcare, research, community wellbeing, or medical settings', faculty: 'Health & Biomedical Sciences' },
      d: { text: 'Creative studios, policy teams, education, or public communication', faculty: 'Arts, Humanities & Social Sciences' },
    },
  },
];

const facultyReasons = {
  'Sciences, Engineering and Technology': 'Your responses suggest an interest in technical problem solving, digital systems, analytical work, or applied innovation.',
  'Accounting, Commerce & Economics': 'Your responses suggest an interest in business decision-making, financial analysis, organisations, or market-focused careers.',
  'Health & Biomedical Sciences': 'Your responses suggest an interest in human wellbeing, health systems, biomedical knowledge, or evidence-based care.',
  'Arts, Humanities & Social Sciences': 'Your responses suggest an interest in people, society, communication, creative practice, or cultural understanding.',
};

const currentQuestion = computed(() => questions[current.value]);
const answeredCount = computed(() => Object.keys(selectedAnswer.value).length);
const progressPercent = computed(() => Math.round((answeredCount.value / questions.length) * 100));
const selectedCurrentAnswer = computed(() => selectedAnswer.value[current.value]);
const resultReason = computed(() => facultyReasons[finalFaculty.value] || 'Your responses have been matched with a relevant Adelaide University study area.');

function startQuiz() {
  hasStarted.value = true;
}

function nextQuestion() {
  if (!selectedCurrentAnswer.value) return;
  current.value += 1;
}

function previousQuestion() {
  if (current.value > 0) current.value -= 1;
}

function submitQuiz() {
  if (!selectedCurrentAnswer.value) return;

  const facultyScore = {
    'Sciences, Engineering and Technology': 0,
    'Accounting, Commerce & Economics': 0,
    'Health & Biomedical Sciences': 0,
    'Arts, Humanities & Social Sciences': 0,
  };

  for (let i = 0; i < questions.length; i += 1) {
    const answerKey = selectedAnswer.value[i];
    const faculty = questions[i].answers[answerKey]?.faculty;
    if (faculty) facultyScore[faculty] += 1;
  }

  finalFaculty.value = Object.entries(facultyScore)
    .sort((a, b) => b[1] - a[1])[0][0];
  showResult.value = true;
}

function retakeQuiz() {
  selectedAnswer.value = {};
  finalFaculty.value = '';
  current.value = 0;
  showResult.value = false;
  hasStarted.value = false;
}
</script>

<template>
  <div class="quiz-page">
    <section class="quiz-hero">
      <div class="hero-inner">
        <span class="hero-eyebrow">Program Recommendation</span>
        <h1>Find a study area that matches your interests.</h1>
        <p>
          Complete a short guided questionnaire to receive a faculty recommendation and continue browsing relevant Adelaide University programs.
        </p>
        <button v-if="!hasStarted && !showResult" class="hero-action" type="button" @click="startQuiz">
          Start Recommendation
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </section>

    <main class="quiz-content">
      <section v-if="!hasStarted && !showResult" class="intro-section">
        <div class="intro-copy">
          <span class="section-eyebrow">How It Works</span>
          <h2>A quick starting point for program exploration.</h2>
          <p>
            This quiz is designed as a simple discovery tool for prospective students. It does not replace admission advice, but it can help narrow the first set of programs to review.
          </p>
        </div>

        <button class="primary-action" type="button" @click="startQuiz">
          Begin Quiz
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>

      <section v-else-if="!showResult" class="quiz-panel">
        <div class="quiz-progress">
          <div>
            <span class="section-eyebrow">Question {{ current + 1 }} of {{ questions.length }}</span>
            <h2>{{ currentQuestion.question }}</h2>
          </div>
          <strong>{{ progressPercent }}%</strong>
        </div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        </div>

        <div class="option-list">
          <label
            v-for="(answer, key) in currentQuestion.answers"
            :key="key"
            class="quiz-option"
            :class="{ selected: selectedAnswer[current] === key }"
          >
            <input v-model="selectedAnswer[current]" type="radio" :value="key" />
            <span class="option-marker">{{ key.toUpperCase() }}</span>
            <span>{{ answer.text }}</span>
          </label>
        </div>

        <div class="quiz-actions">
          <button class="secondary-action" type="button" :disabled="current === 0" @click="previousQuestion">
            <span class="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <button
            v-if="current < questions.length - 1"
            class="primary-action"
            type="button"
            :disabled="!selectedCurrentAnswer"
            @click="nextQuestion"
          >
            Next
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
          <button
            v-else
            class="primary-action"
            type="button"
            :disabled="!selectedCurrentAnswer"
            @click="submitQuiz"
          >
            View Result
            <span class="material-symbols-outlined">check</span>
          </button>
        </div>
      </section>

      <section v-else class="result-panel">
        <span class="section-eyebrow">Recommendation Result</span>
        <h2>{{ finalFaculty }}</h2>
        <p>{{ resultReason }}</p>

        <div class="result-actions">
          <RouterLink
            class="primary-action"
            :to="{ path: '/explore', query: { faculty: finalFaculty } }"
          >
            View Matching Programs
            <span class="material-symbols-outlined">arrow_forward</span>
          </RouterLink>
          <button class="secondary-action" type="button" @click="retakeQuiz">
            Retake Quiz
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.quiz-page {
  min-height: 100vh;
  background: #f6f7fb;
}

.quiz-hero {
  position: relative;
  min-height: 25rem;
  display: flex;
  align-items: center;
  padding: 4.5rem 1.5rem;
  color: var(--color-white);
  background:
    linear-gradient(90deg, rgba(20, 15, 80, 0.92), rgba(20, 15, 80, 0.66), rgba(20, 15, 80, 0.18)),
    url('@/assets/images/campus.webp') center / cover;
}

.hero-inner {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.hero-eyebrow,
.section-eyebrow {
  display: inline-flex;
  margin-bottom: 0.85rem;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.hero-eyebrow {
  color: rgba(255, 255, 255, 0.78);
}

.quiz-hero h1 {
  max-width: 48rem;
  margin: 0;
  color: var(--color-white);
  font-size: clamp(2.1rem, 4vw, 4rem);
  line-height: 1.05;
}

.quiz-hero p {
  max-width: 39rem;
  margin: 1.25rem 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 1.05rem;
  line-height: 1.7;
}

.hero-action,
.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
}

.hero-action,
.primary-action {
  background: var(--color-primary);
  color: var(--color-white);
  padding: 0.85rem 1.15rem;
  text-decoration: none;
}

.hero-action {
  margin-top: 2rem;
  background: var(--color-white);
  color: var(--color-primary);
}

.secondary-action {
  background: #eef0f6;
  color: var(--color-primary);
  padding: 0.85rem 1.1rem;
}

.hero-action:hover,
.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(20, 15, 80, 0.14);
}

.primary-action:disabled,
.secondary-action:disabled {
  cursor: not-allowed;
  opacity: 0.48;
  transform: none;
  box-shadow: none;
}

.quiz-content {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2.5rem 0 4.5rem;
}

.intro-section,
.quiz-panel,
.result-panel {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.1);
  border-radius: 8px;
  box-shadow: 0 14px 32px rgba(20, 15, 80, 0.08);
}

.intro-copy h2,
.quiz-progress h2,
.result-panel h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.75rem;
  line-height: 1.2;
}

.intro-copy p,
.result-panel p {
  margin: 1rem 0 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.intro-section {
  max-width: 820px;
  margin: 0 auto;
  padding: 2rem;
}

.intro-section .primary-action {
  margin-top: 1.5rem;
}

.quiz-panel,
.result-panel {
  max-width: 820px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-progress {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.quiz-progress strong {
  color: var(--color-primary);
  font-size: 1.2rem;
}

.progress-track {
  height: 0.5rem;
  margin: 1.5rem 0 2rem;
  overflow: hidden;
  border-radius: 999px;
  background: #e7e9f2;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width var(--transition-normal);
}

.option-list {
  display: grid;
  gap: 0.85rem;
}

.quiz-option {
  display: grid;
  grid-template-columns: 2.4rem 1fr;
  gap: 0.9rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid rgba(20, 15, 80, 0.12);
  border-radius: 8px;
  background: var(--color-white);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
}

.quiz-option input {
  display: none;
}

.quiz-option:hover,
.quiz-option.selected {
  border-color: rgba(20, 15, 80, 0.45);
  background: #f8f9fd;
  box-shadow: 0 10px 22px rgba(20, 15, 80, 0.08);
}

.option-marker {
  display: inline-flex;
  width: 2.4rem;
  height: 2.4rem;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #eceef7;
  color: var(--color-primary);
  font-weight: 800;
}

.quiz-option.selected .option-marker {
  background: var(--color-primary);
  color: var(--color-white);
}

.quiz-actions,
.result-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.result-panel {
  text-align: center;
}

.result-panel h2 {
  color: var(--color-primary);
}

.result-panel p {
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
}

.result-actions {
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 760px) {
  .quiz-hero {
    min-height: 22rem;
    padding: 3.5rem 1rem;
    background:
      linear-gradient(90deg, rgba(20, 15, 80, 0.94), rgba(20, 15, 80, 0.74)),
      url('@/assets/images/campus.webp') center / cover;
  }

  .quiz-panel,
  .result-panel,
  .intro-section {
    padding: 1.25rem;
  }

  .quiz-progress,
  .quiz-actions {
    flex-direction: column;
  }

  .quiz-actions button,
  .result-actions a,
  .result-actions button {
    width: 100%;
  }
}
</style>
