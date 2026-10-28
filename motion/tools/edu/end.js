      // Fin
      const E0 = 24.0;
      flash(E0, 0.6, 0.3);
      tl.fromTo("#end-logo", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, E0);
      tl.fromTo("#end-title .mask > span", { yPercent: 115 }, { yPercent: 0, duration: 0.45, ease: "power4.out", stagger: BEAT / 2 }, E0 + 0.1);
      tl.fromTo("#cta", { scale: 0.4, opacity: 0, transformOrigin: "0% 50%" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, E0 + BEAT * 2);
      tl.fromTo("#url .ch", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out", stagger: 0.03 }, E0 + BEAT * 1.5);
      tl.fromTo("#bio", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, E0 + BEAT * 4);
      tl.to("#cta", { scale: 1.05, duration: BEAT / 2, ease: "sine.inOut", yoyo: true, repeat: 9 }, E0 + BEAT * 4.5);

