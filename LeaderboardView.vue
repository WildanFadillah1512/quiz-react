<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSpaceStore } from "../stores/spaceStore";

const router = useRouter();
const route = useRoute();
const spaceStore = useSpaceStore();

const isLoading = computed(() => spaceStore.isLoading);

const mainCategories = [
  { id: "planets", label: "PLANETARY MISSIONS", icon: "🪐" },
  { id: "phenomena", label: "COSMIC PHENOMENA", icon: "✨" },
  { id: "games", label: "ARCADE GAMES", icon: "🕹️" },
];

const activeMainTab = ref("planets");

const missionGroups = {
  planets: [
    { id: "Misi Matahari", label: "SUN" },
    { id: "Misi Merkurius", label: "MERCURY" },
    { id: "Misi Venus", label: "VENUS" },
    { id: "Misi Bumi", label: "EARTH" },
    { id: "Misi Bulan", label: "MOON" },
    { id: "Misi Mars", label: "MARS" },
    { id: "Misi Jupiter", label: "JUPITER" },
    { id: "Misi Saturnus", label: "SATURN" },
    { id: "Misi Uranus", label: "URANUS" },
    { id: "Misi Neptunus", label: "NEPTUNE" },
  ],
  phenomena: [
    { id: "Misi Gerhana Matahari", label: "SOLAR ECLIPSE" },
    { id: "Misi Gerhana Bulan", label: "LUNAR ECLIPSE" },
    { id: "Misi Pergantian Musim", label: "SEASONS" },
    { id: "Misi Siang & Malam", label: "DAY & NIGHT" },
    { id: "Misi Komet", label: "COMETS" },
  ],
  games: [
    { id: "GAME 1: MYSTERY", label: "MYSTERY" },
    { id: "GAME 2: ADVENTURE", label: "ADVENTURE" },
  ],
};

const activeSubFilter = ref(missionGroups.planets[0].id);

const subFilters = computed(() => {
  return missionGroups[activeMainTab.value] || [];
});

const visibleCategories = computed(() => {
  if (route.query.category) {
    return mainCategories.filter((c) => c.id === route.query.category);
  }
  return mainCategories;
});

const switchMainTab = (id) => {
  activeMainTab.value = id;
  if (missionGroups[id] && missionGroups[id].length > 0) {
    activeSubFilter.value = missionGroups[id][0].id;
  }
};

const filteredData = computed(() => {
  const allData = spaceStore.leaderboardData || [];

  return allData
    .filter((item) => item.type === activeSubFilter.value)
    .slice(0, 50);
});

const topThree = computed(() => filteredData.value.slice(0, 3));
const restOfList = computed(() => filteredData.value.slice(3));

onMounted(() => {
  if (route.query.category && missionGroups[route.query.category]) {
    activeMainTab.value = route.query.category;
  }

  if (route.query.mission) {
    activeSubFilter.value = route.query.mission;
  } else if (route.query.category && missionGroups[route.query.category]) {
    activeSubFilter.value = missionGroups[route.query.category][0].id;
  }

  spaceStore.fetchLeaderboard();
});

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/selection");
  }
};
</script>

<template>
  <div
    class="min-h-screen w-full bg-[#030712] relative overflow-x-hidden font-sans text-white"
  >
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse"
      ></div>
      <div
        class="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] animate-pulse"
        style="animation-delay: 2s"
      ></div>

      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]"
      ></div>

      <div
        class="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-cyan-900/10 to-transparent"
      >
        <div
          class="w-full h-full"
          style="
            background-image: linear-gradient(
                0deg,
                transparent 24%,
                rgba(6, 182, 212, 0.1) 25%,
                rgba(6, 182, 212, 0.1) 26%,
                transparent 27%,
                transparent 74%,
                rgba(6, 182, 212, 0.1) 75%,
                rgba(6, 182, 212, 0.1) 76%,
                transparent 77%,
                transparent
              ),
              linear-gradient(
                90deg,
                transparent 24%,
                rgba(6, 182, 212, 0.1) 25%,
                rgba(6, 182, 212, 0.1) 26%,
                transparent 27%,
                transparent 74%,
                rgba(6, 182, 212, 0.1) 75%,
                rgba(6, 182, 212, 0.1) 76%,
                transparent 77%,
                transparent
              );
            background-size: 50px 50px;
            perspective: 100px;
            transform: perspective(500px) rotateX(60deg);
          "
        ></div>
      </div>
    </div>

    <div
      class="relative z-10 container mx-auto px-4 py-6 md:py-10 min-h-screen flex flex-col pointer-events-auto"
    >
      <header
        class="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 relative z-50"
      >
        <div class="flex items-center gap-4 w-full md:w-auto">
          <button
            @click="goBack"
            class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all active:scale-95 group cursor-pointer backdrop-blur-md"
          >
            <span
              class="text-2xl transform group-hover:-translate-x-1 transition-transform"
              >←</span
            >
          </button>
          <div>
            <div
              class="text-[10px] md:text-xs font-mono text-cyan-500 tracking-[0.4em] uppercase mb-1 animate-pulse"
            >
              Interstellar Database
            </div>
            <h1
              class="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white/50 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              Hall of Legends
            </h1>
          </div>
        </div>
      </header>

      <main
        class="flex-1 w-full max-w-6xl mx-auto z-20 flex flex-col gap-6 md:gap-8"
      >
        <div class="flex justify-center">
          <div
            class="inline-flex p-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl relative z-50"
          >
            <button
              v-for="cat in visibleCategories"
              :key="cat.id"
              @click="switchMainTab(cat.id)"
              class="px-8 py-3 rounded-xl text-xs md:text-sm font-black tracking-widest transition-all uppercase cursor-pointer relative overflow-hidden group"
              :class="
                activeMainTab === cat.id
                  ? 'text-white'
                  : 'text-white/40 hover:text-white'
              "
            >
              <div
                v-if="activeMainTab === cat.id"
                class="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
              ></div>
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg">{{ cat.icon }}</span> {{ cat.label }}
              </span>
            </button>
          </div>
        </div>

        <div class="w-full relative group">
          <div
            class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none"
          ></div>
          <div
            class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none"
          ></div>

          <div
            class="flex overflow-x-auto gap-3 pb-20 px-4 md:px-0 scrollbar-hide justify-start md:justify-center items-center"
          >
            <button
              v-for="sub in subFilters"
              :key="sub.id"
              @click="activeSubFilter = sub.id"
              class="flex-shrink-0 px-5 py-2 rounded-full border text-[10px] md:text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap"
              :class="
                activeSubFilter === sub.id
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
              "
            >
              {{ sub.label }}
            </button>
          </div>
        </div>

        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center py-20 min-h-[400px]"
        >
          <div class="relative w-24 h-24 mb-6">
            <div
              class="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"
            ></div>
            <div
              class="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"
            ></div>
          </div>
          <div
            class="text-cyan-400 font-mono tracking-widest text-sm animate-pulse"
          >
            ESTABLISHING UPLINK...
          </div>
        </div>

        <div
          v-else-if="filteredData.length === 0"
          class="flex flex-col items-center justify-center py-20 min-h-[400px] text-white/30 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]"
        >
          <div class="text-6xl mb-4 opacity-50">🛰️</div>
          <div class="font-mono tracking-widest font-bold">NO DATA FOUND</div>
          <div class="text-xs mt-2 font-mono">
            BE THE PIONEER FOR THIS MISSION
          </div>
        </div>

        <template v-else>
          <div
            class="grid grid-cols-3 gap-2 md:gap-8 items-end justify-center mb-4 md:mb-0"
          >
            <div
              v-if="topThree[1]"
              class="order-1 relative group perspective-1000"
            >
              <div
                class="absolute -inset-1 bg-gradient-to-b from-gray-300 to-transparent opacity-20 blur-xl rounded-[2rem] group-hover:opacity-40 transition-opacity duration-500"
              ></div>
              <div
                class="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-[2rem] p-2 md:p-6 flex flex-col items-center text-center transform transition-transform duration-500 hover:-translate-y-2 shadow-2xl overflow-hidden"
              >
                <div
                  class="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-400 mb-2 md:mb-4 flex items-center justify-center text-xs md:text-2xl shadow-[0_0_20px_rgba(156,163,175,0.4)] relative z-10"
                >
                  {{ topThree[1].name.charAt(0).toUpperCase() }}
                </div>
                <div
                  class="text-gray-300 font-black text-xl md:text-4xl mb-0 md:mb-1 drop-shadow-lg"
                >
                  #2
                </div>
                <h3
                  class="text-white font-bold text-[10px] md:text-lg tracking-wide truncate w-full mb-1"
                >
                  {{ topThree[1].name }}
                </h3>
                <div
                  class="bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded md:rounded-lg border border-white/10 font-mono text-cyan-300 font-bold text-xs md:text-xl w-full"
                >
                  {{ topThree[1].score }}
                </div>
              </div>
            </div>

            <div
              v-if="topThree[0]"
              class="order-2 relative group perspective-1000 z-20 md:-mt-12 mb-4 md:mb-0"
            >
              <div
                class="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-transparent opacity-30 blur-2xl rounded-[2rem] group-hover:opacity-50 transition-opacity duration-500"
              ></div>

              <div
                class="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 text-2xl md:text-5xl animate-bounce drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] z-30"
              >
                👑
              </div>

              <div
                class="relative bg-gradient-to-b from-yellow-900/40 to-black/60 backdrop-blur-xl border md:border-2 border-yellow-500/50 rounded-2xl md:rounded-[2.5rem] p-3 md:p-8 flex flex-col items-center text-center transform transition-transform duration-500 hover:-translate-y-4 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden"
              >
                <div
                  class="w-14 h-14 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-gradient-to-br from-yellow-600 to-yellow-900 border-2 border-yellow-300 mb-2 md:mb-6 flex items-center justify-center text-lg md:text-4xl shadow-[0_0_30px_rgba(250,204,21,0.5)] relative z-10"
                >
                  {{ topThree[0].name.charAt(0).toUpperCase() }}
                </div>
                <div
                  class="text-yellow-400 font-black text-3xl md:text-6xl mb-1 md:mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                >
                  #1
                </div>
                <h3
                  class="text-white font-black text-xs md:text-2xl tracking-wide truncate w-full mb-1"
                >
                  {{ topThree[0].name }}
                </h3>
                <div
                  class="bg-yellow-500/20 px-2 py-1 md:px-6 md:py-3 rounded-lg md:rounded-xl border border-yellow-500/50 font-mono text-yellow-300 font-black text-sm md:text-3xl w-full tracking-wider shadow-[inset_0_0_20px_rgba(250,204,21,0.1)]"
                >
                  {{ topThree[0].score }}
                </div>
              </div>
            </div>

            <div
              v-if="topThree[2]"
              class="order-3 relative group perspective-1000"
            >
              <div
                class="absolute -inset-1 bg-gradient-to-b from-orange-400 to-transparent opacity-20 blur-xl rounded-[2rem] group-hover:opacity-40 transition-opacity duration-500"
              ></div>
              <div
                class="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-[2rem] p-2 md:p-6 flex flex-col items-center text-center transform transition-transform duration-500 hover:-translate-y-2 shadow-2xl overflow-hidden"
              >
                <div
                  class="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-700 to-orange-900 border border-orange-400 mb-2 md:mb-4 flex items-center justify-center text-xs md:text-2xl shadow-[0_0_20px_rgba(251,146,60,0.4)] relative z-10"
                >
                  {{ topThree[2].name.charAt(0).toUpperCase() }}
                </div>
                <div
                  class="text-orange-400 font-black text-xl md:text-4xl mb-0 md:mb-1 drop-shadow-lg"
                >
                  #3
                </div>
                <h3
                  class="text-white font-bold text-[10px] md:text-lg tracking-wide truncate w-full mb-1"
                >
                  {{ topThree[2].name }}
                </h3>
                <div
                  class="bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded md:rounded-lg border border-white/10 font-mono text-cyan-300 font-bold text-xs md:text-xl w-full"
                >
                  {{ topThree[2].score }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="w-full bg-black/40 backdrop-blur-xl border-t border-white/10 rounded-t-[3rem] p-6 md:p-10 min-h-[500px] relative order-2 md:order-none shadow-[0_-20px_60px_rgba(0,0,0,0.8)]"
          >
            <div
              class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            ></div>

            <h2
              class="text-white/30 text-xs font-mono tracking-[0.3em] uppercase mb-6 pl-4"
            >
              Incoming Data Stream // Ranks 004-050
            </h2>

            <div class="grid grid-cols-1 gap-3">
              <div
                class="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] text-cyan-500/50 uppercase font-black tracking-widest"
              >
                <div class="col-span-1 text-center">Rnk</div>
                <div class="col-span-4">Astronaut Identity</div>
                <div class="col-span-4">Mission Log</div>
                <div class="col-span-3 text-right">Performance Score</div>
              </div>

              <div
                v-for="(item, index) in restOfList"
                :key="index"
                class="md:grid md:grid-cols-12 flex flex-col gap-2 md:gap-4 p-4 md:px-6 md:py-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all group items-center relative overflow-hidden"
              >
                <div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/0 group-hover:bg-cyan-500 transition-colors"
                ></div>

                <div
                  class="col-span-1 flex items-center gap-4 md:justify-center md:gap-0 w-full md:w-auto"
                >
                  <span class="md:hidden text-xs text-white/30 font-mono"
                    >RANK</span
                  >
                  <span class="font-mono text-lg text-white/50 font-bold"
                    >#{{ index + 4 }}</span
                  >
                </div>

                <div
                  class="col-span-4 flex items-center gap-4 w-full md:w-auto"
                >
                  <div
                    class="w-8 h-8 rounded bg-gradient-to-br from-cyan-900/50 to-blue-900/50 flex items-center justify-center text-xs font-bold text-cyan-200 border border-white/10 group-hover:scale-110 transition-transform"
                  >
                    {{ item.name.charAt(0).toUpperCase() }}
                  </div>
                  <span
                    class="font-bold text-gray-200 group-hover:text-white transition-colors truncate"
                    >{{ item.name }}</span
                  >
                </div>

                <div
                  class="col-span-4 flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider w-full md:w-auto pl-12 md:pl-0"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 group-hover:shadow-[0_0_5px_cyan]"
                  ></span>
                  {{ item.type }}
                </div>

                <div
                  class="col-span-3 text-right w-full md:w-auto flex justify-between md:block items-center pl-12 md:pl-0"
                >
                  <span class="md:hidden text-xs text-white/30 font-mono"
                    >SCORE</span
                  >
                  <span
                    class="font-mono font-bold text-cyan-400 text-lg tracking-wider group-hover:text-cyan-200"
                    >{{ item.score }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </main>

      <div
        class="mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-mono text-white/20 border-t border-white/5 pt-6 gap-2"
      >
        <div>
          SYSTEM_STATUS:
          <span class="text-green-500 animate-pulse">ONLINE</span>
          <span class="mx-2">|</span>
          DATA_SOURCE: <span class="text-cyan-500">GALACTIC_NET</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          LIVE_FEED_ACTIVE
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(50%);
  }
}

.perspective-1000 {
  perspective: 1000px;
}
</style>
