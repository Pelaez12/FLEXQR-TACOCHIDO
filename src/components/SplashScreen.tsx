import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useAnimate, useReducedMotion } from 'motion/react';

const ease = [0.22, 1, 0.36, 1] as const;

export const SplashScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const prefersReduced = useReducedMotion();
  // Respect the system preference in every visit.
  const reduced = prefersReduced;
  const [scope, animate] = useAnimate();
  const [visible, setVisible] = useState(() => {
    if (!['/', '/index.html'].includes(window.location.pathname)) return false;
    return true;
  });

  const finish = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => { if (!visible) onComplete?.(); }, [visible, onComplete]);

  useLayoutEffect(() => {
    if (!visible || !scope.current) return;
    const header = document.getElementById('header-taco-chido-brand');
    const content = document.getElementById('app-content');
    const previousOverflow = document.body.style.overflow;
    const previousOpacity = header?.style.opacity ?? '';
    const previousInert = content?.inert ?? false;
    if (header) header.style.opacity = '0';
    if (content) content.inert = true;
    document.body.style.overflow = 'hidden';

    const logo = scope.current.querySelector('.intro-logo') as HTMLElement;
    const source = logo.getBoundingClientRect();
    const target = header?.getBoundingClientRect();
    const dx = target ? target.left - source.left : 0;
    const dy = target ? target.top - source.top : 0;
    const scale = target ? target.height / source.height : 1;
    let cancelled = false;
    const controls = reduced
      ? animate([
          ['.intro-logo', { opacity: [0, 1] }, { duration: 0.15 }],
          ['.intro-logo', { opacity: 0 }, { at: 0.55, duration: 0.15 }],
          ['.intro-question', { opacity: [0, 1] }, { at: 0.7, duration: 0.15 }],
          ['.intro-question', { opacity: 0 }, { at: 3.3, duration: 0.15 }],
        ])
      : animate([
          ['.intro-aura', { opacity: [0, 0.65], transform: ['scale(0.8)', 'scale(1)'] }, { at: 0, duration: 0.8, ease }],
          ['.intro-logo', { opacity: [0, 1], clipPath: ['inset(0% 50% 0% 50%)', 'inset(0% 0% 0% 0%)'], filter: ['blur(5px)', 'blur(0px)'] }, { at: 0.12, duration: 0.72, ease }],
          ['.intro-logo', { opacity: 0, transform: 'translateY(-14px)' }, { at: 1.1, duration: 0.28, ease }],
          ['.intro-question', { opacity: [0, 1] }, { at: 1.3, duration: 0.1 }],
          ['.intro-line-1', { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'], clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] }, { at: 1.3, duration: 0.5, ease }],
          ['.intro-line-2', { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'], clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] }, { at: 1.43, duration: 0.5, ease }],
          ['.intro-line-3', { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'], clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] }, { at: 1.56, duration: 0.5, ease }],
          ['.intro-question', { opacity: 0, transform: 'translateY(-8px)' }, { at: 4, duration: 0.28, ease }],
          ['.intro-logo', { opacity: 1, transform: 'translateY(0px)' }, { at: 4.3, duration: 0.2, ease }],
          ['.intro-aura', { opacity: 0 }, { at: 4.45, duration: 0.55, ease }],
          ['.intro-logo', { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`, opacity: target ? 1 : 0 }, { at: 4.56, duration: 0.64, ease }],
          ['.intro-black', { opacity: [1, 0] }, { at: 4.56, duration: 0.74, ease }],
        ]);
    controls.then(() => { if (!cancelled) finish(); });
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') finish(); };
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('orientationchange', finish);
    return () => {
      cancelled = true;
      controls.cancel();
      if (header) header.style.opacity = previousOpacity;
      if (content) content.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('orientationchange', finish);
    };
  }, [visible, reduced, animate, scope, finish]);

  if (!visible) return null;
  return (
    <div ref={scope} className="intro-screen" role="dialog" aria-modal="true" aria-label="Bienvenido a Taco Chido" onClick={finish}>
      <div className="intro-black" />
      <div className="intro-aura" aria-hidden="true" />
      <div className="intro-stage" aria-hidden="true">
        <div className="intro-logo"><img className="intro-logo-face" src="/taco-chido-logo-cream.png" alt="" width="300" height="170" /></div>
        <p className="intro-question">
          <span className="intro-line-1">UN TACO CHIDO AL DÍA</span>
          <span className="intro-line-2">ES LA CLAVE</span>
          <span className="intro-line-3">DE LA <span className="intro-joy" data-word="ALEGRÍA">ALEGRÍA</span></span>
        </p>
      </div>
      <button type="button" className="intro-skip" onClick={finish}>Toca para comenzar</button>
    </div>
  );
};
