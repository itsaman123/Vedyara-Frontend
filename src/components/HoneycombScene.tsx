import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   3D animated honeycomb background — Three.js r185
   Golden hex wireframes floating at varying depths with mouse
   parallax. Shared outline geometry, per-cell material + z phase.
───────────────────────────────────────────────────────────── */
export default function HoneycombScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const W = mount.offsetWidth;
    const H = mount.offsetHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene + Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 15;

    /* ── Hex outline geometry (SHARED) ── */
    const R = isMobile ? 1.1 : 0.85;
    const outlinePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6; // pointy-top
      outlinePts.push(new THREE.Vector3(R * Math.cos(a), R * Math.sin(a), 0));
    }
    const outlineGeo = new THREE.BufferGeometry().setFromPoints(outlinePts);

    /* ── Hex fill geometry (SHARED) ── */
    const fillGeo = new THREE.CircleGeometry(R * 0.88, 6, Math.PI / 6);

    /* ── Honeycomb grid ── */
    const COLS = isMobile ? 9 : 22;
    const ROWS = isMobile ? 12 : 15;
    const GAP = 1.06;
    const cW = R * Math.sqrt(3) * GAP;
    const cH = R * 1.5 * GAP;

    type Cell = {
      outline: THREE.LineLoop;
      fill: THREE.Mesh;
      baseZ: number;
      phase: number;
      speed: number;
      baseOp: number;
      baseFillOp: number;
    };
    const cells: Cell[] = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = (col - COLS / 2) * cW + (row % 2 === 0 ? 0 : cW * 0.5);
        const y = (row - ROWS / 2) * cH * 0.75;
        const baseZ = (Math.random() - 0.5) * 5;

        // Gold-to-amber hue range
        const h = 0.09 + Math.random() * 0.05;
        const s = 0.65 + Math.random() * 0.3;
        const l = 0.42 + Math.random() * 0.28;
        const baseOp = 0.08 + Math.random() * 0.38;
        const baseFillOp = 0.01 + Math.random() * 0.04;

        const outlineMat = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHSL(h, s, l),
          transparent: true,
          opacity: baseOp,
        });
        const outline = new THREE.LineLoop(outlineGeo, outlineMat);
        outline.position.set(x, y, baseZ);

        const fillMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(h, s * 0.7, l * 0.75),
          transparent: true,
          opacity: baseFillOp,
          side: THREE.DoubleSide,
        });
        const fill = new THREE.Mesh(fillGeo, fillMat);
        fill.position.set(x, y, baseZ - 0.05);

        scene.add(outline, fill);
        cells.push({
          outline, fill, baseZ,
          phase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.45,
          baseOp,
          baseFillOp,
        });
      }
    }

    /* ── Mouse parallax ── */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    /* ── Animation loop — paused while the scene is scrolled off-screen ── */
    let raf: number | undefined;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Camera parallax drift
      camera.position.x += (mx * 1.4 - camera.position.x) * 0.03;
      camera.position.y += (my * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Per-cell depth + opacity animation
      for (const c of cells) {
        const wave = Math.sin(t * c.speed + c.phase);
        const z = c.baseZ + wave * 0.65;
        c.outline.position.z = z;
        c.fill.position.z = z - 0.05;
        (c.outline.material as THREE.LineBasicMaterial).opacity =
          c.baseOp * (0.55 + 0.45 * wave);
        (c.fill.material as THREE.MeshBasicMaterial).opacity =
          c.baseFillOp * (0.4 + 0.6 * Math.sin(t * c.speed * 0.6 + c.phase));
      }

      renderer.render(scene, camera);
    };

    const startTick = () => {
      if (raf !== undefined) return;
      tick();
    };
    const stopTick = () => {
      if (raf === undefined) return;
      cancelAnimationFrame(raf);
      raf = undefined;
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startTick() : stopTick()),
      { threshold: 0 }
    );
    io.observe(mount);

    /* ── Resize ── */
    const onResize = () => {
      const w = mount.offsetWidth, h = mount.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      stopTick();
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      // Dispose shared geometries + per-cell materials
      outlineGeo.dispose();
      fillGeo.dispose();
      for (const c of cells) {
        (c.outline.material as THREE.LineBasicMaterial).dispose();
        (c.fill.material as THREE.MeshBasicMaterial).dispose();
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}
