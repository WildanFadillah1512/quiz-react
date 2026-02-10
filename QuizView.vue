<template>
  <div class="min-h-screen relative overflow-hidden font-mono flex flex-col items-center justify-center p-4 md:p-6 bg-black text-white select-none">
    
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1026] to-black pointer-events-none"></div>
      <div v-for="n in 50" :key="`star-${n}`" class="absolute bg-white rounded-full animate-twinkle pointer-events-none" :style="getRandomStarStyle()"></div>
    </div>

    <div v-if="quizSession" class="relative w-full max-w-4xl z-10 flex flex-col h-full max-h-[90vh]">
      
      <div v-if="gameState === 'playing'" class="flex justify-between items-center mb-6 px-2 relative z-50">
        <button 
          type="button"
          @click="goBack"
          class="group w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/20 backdrop-blur transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer pointer-events-auto"
          aria-label="Kembali"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="bg-black/60 backdrop-blur-md border border-cyan-500/50 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] flex gap-3 text-xl items-center pointer-events-auto">
          <span class="text-cyan-400 font-bold tracking-widest text-sm">SCORE</span>
          <span class="text-white font-black text-2xl font-sans">{{ currentPercentage }}%</span>
        </div>
      </div>

      <transition name="zoom-fade" mode="out-in">
        
        <div v-if="gameState === 'intro'" key="intro" class="flex-1 flex flex-col items-center justify-center w-full text-center relative z-20">
            <div class="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden">
                
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/20 blur-[50px] pointer-events-none z-0"></div>

                <div class="text-6xl mb-4 animate-float relative z-10">👩‍🚀</div>
                <h2 class="text-3xl font-bold mb-2 text-white font-sans relative z-10">IDENTIFIKASI DIRI</h2>
                <p class="text-slate-400 mb-6 text-sm relative z-10">
                   Misi: <span class="text-cyan-400">{{ quizSession.title || 'Unknown' }}</span>
                </p>

                <div class="relative z-50 w-full mb-4">
                  <input 
                    v-model="userName" 
                    type="text" 
                    placeholder="Nama Astronaut..." 
                    class="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white text-center text-lg focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 pointer-events-auto"
                    @keyup.enter="startQuiz"
                    maxlength="15"
                  />
                </div>

                <button 
                  @click="startQuiz"
                  :disabled="!userName"
                  class="relative z-50 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform active:scale-95 font-sans tracking-wider pointer-events-auto cursor-pointer"
                >
                  MULAI MISI 🚀
                </button>

                <button 
                  @click="goBack"
                  class="relative z-50 w-full mt-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold py-3 rounded-xl transition-all font-sans tracking-wider pointer-events-auto cursor-pointer border border-white/10"
                >
                  KEMBALI
                </button>
            </div>
        </div>

        <div v-else-if="gameState === 'playing'" key="question" class="flex-1 flex flex-col justify-center w-full relative z-20">
          
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 z-30 transition-transform pointer-events-auto" 
               :class="{ 'cursor-pointer hover:scale-110': speechAvailable && !speechBusy, 'opacity-60 cursor-not-allowed': !speechAvailable }" 
               @click="playQuestionAudio">
            <div class="text-[5rem] drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-float select-none">
              {{ mascotExpression }}
            </div>
          </div>

          <div class="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 pt-16 min-h-[260px] flex flex-col items-center justify-center text-center relative overflow-hidden group z-10">
            
            <button @click.stop="playQuestionAudio" :disabled="!speechAvailable || speechBusy" class="absolute top-5 right-5 z-50 p-2 rounded-full transition-all cursor-pointer pointer-events-auto" :class="(!speechAvailable || speechBusy) ? 'opacity-50 cursor-not-allowed text-slate-400 bg-slate-800/20' : 'text-cyan-500 hover:text-white bg-cyan-900/30 hover:bg-cyan-500/50'">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </button>

            <h2 class="text-xl md:text-3xl font-bold text-white leading-relaxed relative z-10 font-sans pointer-events-none">
              {{ currentQuestion?.q }}
            </h2>

            <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 z-10" :style="{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }"></div>
          </div>

          <div class="relative h-14 flex items-center justify-center -my-7 z-40 pointer-events-none">
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center border-4 border-slate-800 ring-2 ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <span class="text-2xl font-black text-white">{{ currentQuestionIndex + 1 }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full pb-4 relative z-50">
            <button
              v-for="(option, index) in currentQuestion?.a"
              :key="index"
              @click="handleAnswer(index)"
              :disabled="isAnswered || !currentQuestion"
              class="relative group h-auto min-h-[75px] rounded-2xl border border-white/10 transition-all duration-200 active:scale-95 flex items-center px-6 py-4 overflow-hidden cursor-pointer pointer-events-auto"
              :class="getOptionClass(index)"
            >
              <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm mr-4 transition-colors duration-300 font-sans relative z-10"
                   :class="getLabelClass(index)">
                {{ ["A", "B", "C", "D"][index] }}
              </div>

              <span class="text-lg font-medium text-left flex-1 font-sans relative z-10">{{ option }}</span>

              <span v-if="isAnswered && index === currentQuestion.correct" class="absolute right-4 text-2xl animate-pop-in z-20">✅</span>
              <span v-if="isAnswered && selectedOption === index && index !== currentQuestion.correct" class="absolute right-4 text-2xl animate-pop-in z-20">❌</span>
            </button>
          </div>
        </div>

        <div v-else-if="gameState === 'result'" key="result" class="flex-1 flex flex-col items-center justify-center w-full relative z-20">
            <div class="bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 text-center w-full max-w-xl shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden transform transition-all hover:scale-[1.01]">
                
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

                <div class="mb-6 relative inline-block z-10">
                  <div class="text-[6rem] animate-bounce-slow">{{ resultEmoji }}</div>
                  <div class="absolute -bottom-2 -right-4 bg-yellow-500 text-black font-black px-3 py-1 rounded-md text-sm shadow-lg rotate-12 font-sans border border-yellow-300">
                    {{ currentPercentage }} / 100
                  </div>
                </div>

                <h2 class="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight z-10 relative font-sans">
                  {{ resultTitle }}
                </h2>
                
                <p class="text-slate-400 font-mono mb-8 text-sm md:text-base z-10 relative">
                  Terima kasih <span class="text-cyan-400 font-bold">{{ userName }}</span>!<br>
                  Misi selesai. Data dikirim ke markas.
                </p>

                <div class="mb-6 flex justify-center z-10 relative">
                    <div v-if="isSubmitting" class="text-yellow-400 animate-pulse font-bold flex items-center gap-2">
                         <span class="animate-spin">⏳</span> Mengirim Data...
                    </div>
                    <div v-else class="text-green-400 font-bold flex items-center gap-2">
                         <span>✅</span> Data Tersimpan Aman
                    </div>
                </div>

                <div class="flex flex-col gap-3 justify-center w-full relative z-50">
                  <button type="button" @click="goBack" class="w-full pointer-events-auto cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] font-sans">
                    🚀 KEMBALI KE PANGKALAN
                  </button>
                </div>
            </div>
        </div>

      </transition>
    </div>

    <div v-else class="text-center z-50 relative">
      <h1 class="text-4xl font-bold text-red-500 mb-4 animate-pulse">404</h1>
      <p class="text-white mb-6">Data Misi Tidak Ditemukan</p>
      <button @click="router.push('/explore')" class="bg-white/10 px-6 py-2 rounded-full hover:bg-white/20 transition-all cursor-pointer pointer-events-auto">
        Kembali ke Explore
      </button>
    </div>

    <div v-if="showConfetti" class="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
      <div v-for="n in 30" :key="n" class="absolute w-2 h-2 bg-yellow-400 animate-confetti" :style="getConfettiStyle()"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSpaceStore } from "../stores/spaceStore";
import { quizData } from "../data/quizData";
import speech from "../utils/speech";

const route = useRoute();
const router = useRouter();
const spaceStore = useSpaceStore();

// --- STATE MANAGEMENT ---
const gameState = ref('intro');
const quizSession = ref(null);
const currentQuestionIndex = ref(0);
const score = ref(0);
const isAnswered = ref(false);
const selectedOption = ref(null);
const isCorrect = ref(false);
const showConfetti = ref(false);
const userName = ref("");
const isSubmitting = ref(false);
const speechAvailable = ref(false);
const speechBusy = ref(false);

onMounted(() => {
  const paramId = route.params.id;
  // Parse ID dengan aman
  const targetId = isNaN(parseInt(paramId)) ? paramId : parseInt(paramId);
  
  // Cari data kuis berdasarkan ID Planet
  const found = quizData.find(q => q.targetId === targetId);
  
  if (found) {
    quizSession.value = found;
  } else {
    console.warn("Quiz data not found for ID:", targetId);
  }
  
  // Cek ketersediaan TTS browser
  checkSpeech();
});

// --- NAVIGATION ---
const goBack = () => {
  // Gunakan router.back() jika history ada (terbaik untuk UX)
  if (window.history.length > 1) {
    router.back();
    return;
  }

  // Fallback berdasarkan 'from' parameter jika history kosong (e.g. refresh)
  const from = route.query.from;
  if (from === 'events') {
    router.push({ name: 'events' });
  } else if (from === 'planet-detail') {
    // Kembali ke detail planet (butuh ID)
    router.push({ name: 'planet-detail', params: { id: route.params.id } });
  } else {
    // Default fallback
    router.push({ name: 'explore' });
  }
};

const startQuiz = () => {
    if (!userName.value.trim()) return;
    gameState.value = 'playing';
    // Mainkan audio pertanyaan pertama otomatis (opsional)
    // setTimeout(() => playQuestionAudio(), 500);
};

// --- GAMEPLAY LOGIC ---
const handleAnswer = (index) => {
  if (isAnswered.value) return;
  
  // Hentikan suara jika sedang bicara
  try { speech.cancel() } catch(e) {}

  const cq = currentQuestion.value;
  selectedOption.value = index;
  isAnswered.value = true;
  isCorrect.value = index === cq.correct;

  if (isCorrect.value) {
    score.value++;
    triggerConfetti();
  } else {
    // Haptic feedback untuk HP
    try { if (navigator.vibrate) navigator.vibrate(200); } catch(e) {}
  }

  // Delay ke pertanyaan berikutnya
  setTimeout(() => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++;
      isAnswered.value = false;
      selectedOption.value = null;
    } else {
      finishAndSave();
    }
  }, 1200);
};

// --- SAVE SCORE ---
const finishAndSave = async () => {
    gameState.value = 'result';
    isSubmitting.value = true;
    
    let missionName = "Unknown Mission";
    if (quizSession.value) {
        missionName = quizSession.value.title || `Misi Planet ${quizSession.value.targetId}`;
    }

    try {
        // Simpan ke Pinia Store
        await spaceStore.submitScore(userName.value, currentPercentage.value, missionName);
    } catch (e) {
        console.error("Gagal menyimpan skor:", e);
    } finally {
        isSubmitting.value = false;
    }
};

// --- COMPUTED HELPERS ---
const questions = computed(() => quizSession.value ? quizSession.value.questions : []);
const totalQuestions = computed(() => questions.value.length);
// Safety check pake optional chaining
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null);

const currentPercentage = computed(() => {
    if (totalQuestions.value === 0) return 0;
    return Math.round((score.value / totalQuestions.value) * 100);
});

const mascotExpression = computed(() => {
  if (isAnswered.value) return isCorrect.value ? "🤩" : "😵";
  return "🤔";
});

const resultEmoji = computed(() => {
  if (currentPercentage.value === 100) return "👑";
  if (currentPercentage.value >= 60) return "🌌";
  return "☄️";
});

const resultTitle = computed(() => {
  if (currentPercentage.value === 100) return "SEMPURNA!";
  if (currentPercentage.value >= 60) return "MISI SUKSES!";
  return "COBA LAGI!";
});

// --- AUDIO UTILS ---
const checkSpeech = async () => {
    try {
        speechAvailable.value = speech.isAvailable();
        if(speechAvailable.value) {
            await speech.initVoices();
            const count = speech.getVoicesCount();
            speechAvailable.value = count > 0;
        }
    } catch (e) { console.warn("Speech error", e); }
}

const playQuestionAudio = async () => {
  if (!speechAvailable.value || !currentQuestion.value) return;
  
  try {
    speechBusy.value = true;
    await speech.speak(currentQuestion.value.q, { lang: 'id-ID' });
  } catch (e) {
    console.warn("Speech play error", e);
  } finally { 
    speechBusy.value = false; 
  }
};

// --- EFFECTS ---
const triggerConfetti = () => {
  showConfetti.value = true;
  setTimeout(() => (showConfetti.value = false), 1500);
};

const getRandomStarStyle = () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  width: `${Math.random() * 3}px`,
  height: `${Math.random() * 3}px`,
  opacity: Math.random(),
  animationDelay: `${Math.random() * 5}s`
});

const getConfettiStyle = () => ({
  left: `${Math.random() * 100}%`,
  backgroundColor: ['#22D3EE', '#E879F9', '#FDB813', '#FFFFFF'][Math.floor(Math.random() * 4)],
  animationDuration: `${1 + Math.random()}s`,
  animationDelay: `${Math.random() * 0.2}s`
});

const getOptionClass = (index) => {
  const base = "bg-white/5 text-gray-300 cursor-pointer hover:bg-white/10 hover:border-cyan-500/50";
  if (!isAnswered.value) return base;
  
  if (currentQuestion.value && index === currentQuestion.value.correct) {
      return "bg-green-500/20 border-green-500 text-green-200 ring-1 ring-green-500 z-10";
  }
  if (selectedOption.value === index) {
      return "bg-red-500/20 border-red-500 text-red-200 opacity-80";
  }
  return "bg-black/40 text-gray-600 opacity-40 border-transparent grayscale";
};

const getLabelClass = (index) => {
  if (!isAnswered.value) return "bg-white/10 text-gray-400 group-hover:bg-cyan-500 group-hover:text-black";
  
  if (currentQuestion.value && index === currentQuestion.value.correct) return "bg-green-500 text-black";
  if (selectedOption.value === index) return "bg-red-500 text-white";
  return "bg-gray-800 text-gray-600";
};
</script>

<style scoped>
/* KEYFRAMES */
.animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
@keyframes twinkle { 0%,100% { opacity:0.2; transform:scale(1); } 50% { opacity:1; transform:scale(1.5); } }

.animate-float { animation: float 3s ease-in-out infinite; }
@keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }

.animate-pop-in { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
@keyframes pop { 0% { transform:scale(0); opacity:0; } 100% { transform:scale(1); opacity:1; } }

.animate-confetti { animation: fall 1.5s linear forwards; }
@keyframes fall { 
  0% { transform:translateY(-10vh) rotate(0deg); opacity:1; } 
  100% { transform:translateY(110vh) rotate(720deg); opacity:0; } 
}

.animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
@keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* TRANSITIONS */
.zoom-fade-enter-active, .zoom-fade-leave-active { transition: all 0.4s ease; }
.zoom-fade-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); }
.zoom-fade-leave-to { opacity: 0; transform: scale(1.05); }
</style>