"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  courseName: string;
};

export default function DemoScreenshotSlider({ images, courseName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!previewOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewOpen]);

  if (!images.length) return null;

  const goTo = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
  };

  return (
    <section className="demo-section stack" aria-label="Course demo screenshots">
      <div className="demo-heading">
        <div>
          <span className="pill">PREVIEW</span>
          <h2>Demo Screenshots</h2>
          <p className="muted">Swipe or use the arrows to explore the course preview.</p>
        </div>
        <span className="demo-count">{activeIndex + 1} / {images.length}</span>
      </div>

      <div
        className="demo-slider"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || images.length < 2) return;
          const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
          if (Math.abs(deltaX) > 40) goTo(activeIndex + (deltaX < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        <button
          type="button"
          className="demo-arrow demo-arrow-prev"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous demo screenshot"
          disabled={images.length < 2}
        >
          ‹
        </button>

        <button
          type="button"
          className="demo-slide"
          onClick={() => setPreviewOpen(true)}
          aria-label="Open full-size demo screenshot"
        >
          <img
            src={images[activeIndex]}
            alt={`${courseName} demo screenshot ${activeIndex + 1}`}
            loading="lazy"
          />
          <span className="demo-zoom-hint">Tap to view full size</span>
        </button>

        <button
          type="button"
          className="demo-arrow demo-arrow-next"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next demo screenshot"
          disabled={images.length < 2}
        >
          ›
        </button>
      </div>

      {images.length > 1 && (
        <div className="demo-slider-footer">
          <div className="demo-dots" aria-label="Choose screenshot">
            {images.map((_, index) => (
              <button
                type="button"
                key={`${index}`}
                className={`demo-dot${index === activeIndex ? " active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show screenshot ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
          <span className="muted demo-swipe-label">Swipe to view more</span>
        </div>
      )}

      {previewOpen && (
        <div
          className="demo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Full-size course demo screenshot"
          onClick={() => setPreviewOpen(false)}
        >
          <button
            type="button"
            className="demo-lightbox-close"
            onClick={() => setPreviewOpen(false)}
            aria-label="Close full-size preview"
          >
            ×
          </button>
          <img
            src={images[activeIndex]}
            alt={`${courseName} demo screenshot ${activeIndex + 1} full size`}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
