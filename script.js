const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const spaces = [true, false, true, false, true, false];
const spacesContainer = document.querySelector('#sim-spaces');
const freeCount = document.querySelector('#free-count');
const progressBar = document.querySelector('#progress-bar');
const simMessage = document.querySelector('#sim-message');

function renderSpaces() {
  spacesContainer.innerHTML = '';
  spaces.forEach((occupied, index) => {
    const space = document.createElement('button');
    space.className = `sim-space${occupied ? ' occupied' : ''}`;
    space.setAttribute('aria-label', `Vaga ${index + 1}, ${occupied ? 'ocupada' : 'livre'}`);
    space.innerHTML = occupied ? `<span>${String(index + 1).padStart(2, '0')}</span><i class="sim-car"></i>` : `<span>${String(index + 1).padStart(2, '0')}</span>`;
    space.addEventListener('click', () => {
      spaces[index] = !spaces[index];
      simMessage.textContent = `Vaga ${String(index + 1).padStart(2, '0')} marcada como ${spaces[index] ? 'ocupada' : 'livre'}.`;
      renderSpaces();
    });
    spacesContainer.appendChild(space);
  });
  const available = spaces.filter((space) => !space).length;
  freeCount.textContent = String(available).padStart(2, '0');
  progressBar.style.width = `${(available / spaces.length) * 100}%`;
}

function toggleGate(gateId, message) {
  const gate = document.querySelector(`#${gateId}`);
  gate.classList.toggle('open');
  simMessage.textContent = gate.classList.contains('open') ? `${message} Cancela aberta.` : 'Cancela fechada. Sistema pronto.';
}

document.querySelector('#entry-gate').addEventListener('click', () => toggleGate('entry-gate', 'Fluxo de entrada liberado.'));
document.querySelector('#exit-gate').addEventListener('click', () => toggleGate('exit-gate', 'Fluxo de saída liberado.'));
document.querySelector('#reset-sim').addEventListener('click', () => {
  spaces.splice(0, spaces.length, true, false, true, false, true, false);
  document.querySelectorAll('.sim-gate-button').forEach((gate) => gate.classList.remove('open'));
  simMessage.textContent = 'Sistema pronto para receber veículos.';
  renderSpaces();
});

renderSpaces();

function updateClock() {
  document.querySelector('#clock').textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
}
updateClock();
setInterval(updateClock, 1000);
