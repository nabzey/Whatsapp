 export function createCommunitiesList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center h-64 text-[#8696a0]';
    container.innerHTML = `
      <i class="fas fa-users text-4xl mb-4"></i>
      <p class="text-center mb-4">Aucune communauté disponible</p>
      <button class="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00a884]/80 transition-colors">
        Créer une communauté
      </button>
    `;
    return container;
  }