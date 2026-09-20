// The SVG carries the original figure geometry; interaction never moves its shapes.
document.addEventListener('DOMContentLoaded', function () {
  const overview = document.querySelector('.overview-interactive');
  const panel = document.getElementById('overview-info-panel');
  if (!overview || !panel) return;

  const hotspots = Array.from(overview.querySelectorAll('.overview-hotspot'));
  const targets = Array.from(overview.querySelectorAll('.overview-target'));
  const title = panel.querySelector('h3');
  const description = panel.querySelector('p');
  const defaultTitle = title.textContent;
  const defaultDescription = description.textContent;

  function targetFor(hotspot) {
    return targets.find(target => target.dataset.targetId === hotspot.dataset.target);
  }

  function reset() {
    hotspots.forEach(hotspot => {
      hotspot.classList.remove('is-active');
      hotspot.setAttribute('aria-pressed', 'false');
    });
    targets.forEach(target => target.classList.remove('is-active'));
    title.textContent = defaultTitle;
    description.textContent = defaultDescription;
  }

  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', event => {
      event.stopPropagation();
      hotspot.focus({ preventScroll: true });
      reset();
      hotspot.classList.add('is-active');
      hotspot.setAttribute('aria-pressed', 'true');
      const target = targetFor(hotspot);
      if (target) target.classList.add('is-active');
      title.textContent = hotspot.dataset.title;
      description.textContent = hotspot.dataset.description;
    });
    hotspot.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        hotspot.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    ['pointerenter', 'focus'].forEach(type => hotspot.addEventListener(type, event => {
      if (event.pointerType === 'touch') return;
      const target = targetFor(hotspot);
      if (target) target.classList.add('is-hovering');
    }));
    ['pointerleave', 'blur'].forEach(type => hotspot.addEventListener(type, () => {
      const target = targetFor(hotspot);
      if (target) target.classList.remove('is-hovering');
    }));
  });

  overview.addEventListener('keydown', event => {
    if (event.key === 'Escape') reset();
  });
  overview.addEventListener('click', event => {
    if (!event.target.closest('.overview-hotspot')) reset();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.overview-interactive, .overview-info-panel, .overview-click-note')) reset();
  });
});
