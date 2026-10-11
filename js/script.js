(() => {
  const scenes = [...document.querySelectorAll('.scene')];
  const names = {rose:'رز', lily:'لیلیوم', lotus:'نیلوفر آبی', tulip:'لاله', sunflower:'آفتابگردان', cherry:'شکوفه گیلاس'};
  const files = {rose:'rose.jpg', lily:'lily.jpg', lotus:'lotus.jpg', tulip:'tulip.jpg', sunflower:'sunflower.jpg', cherry:'cherry-blossom.jpg'};
  let selected = 'rose';
  function show(id) {
    scenes.forEach(scene => scene.classList.toggle('active', scene.dataset.scene === id));
    if (id === 'final') document.getElementById('final-flower').textContent = `${names[selected]} هم قشنگه‌ها...`;
  }
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => show(button.dataset.go)));
  document.querySelectorAll('[data-flower]').forEach(card => card.addEventListener('click', () => {
    selected = card.dataset.flower;
    card.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}], {duration:220});
    show(`flower-${selected}`);
  }));
})();
