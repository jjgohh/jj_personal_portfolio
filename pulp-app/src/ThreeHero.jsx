import React, { useEffect, useRef } from 'react';

// Amber softgel specimen hero. Enhancement only: if WebGL/three is unavailable
// the cream hero + CSS glow (in styles.css) remain. Cleans up on unmount.
export default function ThreeHero() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    try {
      const test = document.createElement('canvas');
      if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;
    } catch (e) { return; }

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let THREE, RoomEnvironment;
      try {
        THREE = await import('three');
        ({ RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js'));
      } catch (e) { return; }
      if (disposed) return;

      let W = wrap.clientWidth, H = wrap.clientHeight;
      const isCoarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
      const smallScreen = window.innerWidth < 860;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: !smallScreen, alpha: true, powerPreference: 'high-performance' });
      const maxDpr = (isCoarse || smallScreen) ? 1.5 : 2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      renderer.setSize(W, H);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
      camera.position.set(0, 0, 5.2);

      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const key = new THREE.DirectionalLight(0xffe1b0, 1.15); key.position.set(3, 4, 3); scene.add(key);
      const fill = new THREE.HemisphereLight(0xdfe8dd, 0xE9DCC0, 0.55); scene.add(fill);
      const rim = new THREE.DirectionalLight(0xC85A28, 0.5); rim.position.set(-4, -1, -2); scene.add(rim);

      const group = new THREE.Group(); scene.add(group);
      const gelMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xC85A28), metalness: 0, roughness: 0.13,
        transmission: 0.9, thickness: 1.5, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.12,
        attenuationColor: new THREE.Color(0x8a3a12), attenuationDistance: 0.9,
        envMapIntensity: 1.25, specularIntensity: 1,
      });
      const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 0.7, 28, 48), gelMat);
      capsule.rotation.z = Math.PI * 0.12; group.add(capsule);

      const core = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.44, 16, 32),
        new THREE.MeshBasicMaterial({ color: 0xF3B366, transparent: true, opacity: 0.16 }));
      core.rotation.z = Math.PI * 0.12; group.add(core);

      const shTex = (() => {
        const c = document.createElement('canvas'); c.width = c.height = 256;
        const g = c.getContext('2d');
        const rg = g.createRadialGradient(128, 128, 10, 128, 128, 128);
        rg.addColorStop(0, 'rgba(60,40,20,0.42)'); rg.addColorStop(1, 'rgba(60,40,20,0)');
        g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
        return new THREE.CanvasTexture(c);
      })();
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4),
        new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.35; scene.add(shadow);

      const N = smallScreen ? 40 : 110, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 7; pos[i * 3 + 1] = (Math.random() - 0.5) * 5; pos[i * 3 + 2] = (Math.random() - 0.5) * 3; }
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const motes = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xC98A4E, size: 0.022, transparent: true, opacity: 0.5, depthWrite: false }));
      scene.add(motes);

      function layout() {
        W = wrap.clientWidth; H = wrap.clientHeight;
        renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
        const wide = W > 860;
        group.position.x = wide ? 1.7 : 0;
        group.position.y = wide ? 0.15 : 0.5;
        group.scale.setScalar(wide ? 1 : 0.82);
        shadow.position.x = group.position.x;
      }
      layout();
      window.addEventListener('resize', layout);

      const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
      function onPointer(e) { pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = (e.clientY / window.innerHeight) * 2 - 1; }
      if (!reduce) window.addEventListener('pointermove', onPointer, { passive: true });

      let baseY; const t0 = performance.now();
      let inView = true, hidden = document.hidden, rafId = null;
      function maybeRun() { if (inView && !hidden && rafId == null) rafId = requestAnimationFrame(loop); }
      const io = new IntersectionObserver((es) => { inView = es[0].isIntersecting; maybeRun(); }, { threshold: 0.01 });
      io.observe(wrap);
      function onVis() { hidden = document.hidden; maybeRun(); }
      document.addEventListener('visibilitychange', onVis);

      function loop() {
        if (!(inView && !hidden) || disposed) { rafId = null; return; }
        rafId = requestAnimationFrame(loop);
        const t = (performance.now() - t0) / 1000;
        if (baseY === undefined) baseY = group.position.y;
        if (!reduce) {
          target.x += (pointer.x - target.x) * 0.05;
          target.y += (pointer.y - target.y) * 0.05;
          group.rotation.y = t * 0.28 + target.x * 0.4;
          group.rotation.x = -target.y * 0.25;
          core.rotation.y = group.rotation.y; core.rotation.x = group.rotation.x;
          group.position.y = baseY + Math.sin(t * 0.9) * 0.06;
          motes.rotation.y = t * 0.02;
          motes.position.y = Math.sin(t * 0.3) * 0.15;
        }
        renderer.render(scene, camera);
      }
      maybeRun();

      wrap.style.opacity = '0';
      wrap.style.transition = 'opacity 1.1s ease';
      requestAnimationFrame(() => requestAnimationFrame(() => { if (!disposed) wrap.style.opacity = '1'; }));

      cleanup = () => {
        if (rafId) cancelAnimationFrame(rafId);
        io.disconnect();
        window.removeEventListener('resize', layout);
        window.removeEventListener('pointermove', onPointer);
        document.removeEventListener('visibilitychange', onVis);
        // renderer.dispose() frees the context's own caches, not the objects we
        // built, so without this walk every geometry, material and texture
        // survives the unmount.
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
            m.dispose();
          });
        });
        if (scene.environment) scene.environment.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      };

      /* cleanup is only assigned here, at the end of the async body. If the
         component unmounted any time after the dynamic import resolved, React
         already ran the destructor while cleanup was still the no-op — so the
         renderer, the IntersectionObserver and three listeners above were
         created and never released, one leaked WebGL context per mount.
         `disposed` can only have been set by that destructor, which runs
         synchronously, so checking it once here covers every interleaving. */
      if (disposed) cleanup();
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div id="gl-wrap" ref={wrapRef}><canvas id="gl" ref={canvasRef} /></div>
  );
}
