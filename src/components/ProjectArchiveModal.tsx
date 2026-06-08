"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ProjectArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectNumber: string;
  title: string;
  semester: string;
  description?: string;
  techStack?: string[];
  images: string[];
}

export function ProjectArchiveModal({
  isOpen,
  onClose,
  projectNumber,
  title,
  semester,
  description,
  techStack,
  images,
}: ProjectArchiveModalProps) {
  const [slideState, setSlideState] = useState({ archiveKey: "", index: 0 });
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageCount = images.length;
  const activeArchiveKey = `${projectNumber}-${title}`;
  const currentSlide =
    isOpen && slideState.archiveKey === activeArchiveKey ? slideState.index : 0;

  const nextSlide = useCallback(() => {
    if (imageCount < 2) return;
    setSlideState((prev) => ({
      archiveKey: activeArchiveKey,
      index:
        prev.archiveKey === activeArchiveKey
          ? (prev.index + 1) % imageCount
          : 1 % imageCount,
    }));
  }, [activeArchiveKey, imageCount]);

  const prevSlide = useCallback(() => {
    if (imageCount < 2) return;
    setSlideState((prev) => ({
      archiveKey: activeArchiveKey,
      index:
        prev.archiveKey === activeArchiveKey
          ? (prev.index - 1 + imageCount) % imageCount
          : imageCount - 1,
    }));
  }, [activeArchiveKey, imageCount]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
  }, [isOpen, title]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, nextSlide, onClose, prevSlide]);

  if (!isOpen) return null;

  return (
    <div
      className="archive-modal-overlay"
      onClick={onClose}
    >
      <div
        className="archive-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeButtonRef}
          className="archive-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close archive preview"
        >
          <IoClose />
        </button>

        <div className="archive-modal-header">
          <span className="archive-modal-number">{projectNumber}</span>
          <div>
            <h3 id={titleId} className="archive-modal-title">
              {title}
            </h3>
            <p className="archive-modal-semester">{semester}</p>
          </div>
        </div>

        {description && (
          <p className="archive-modal-description">{description}</p>
        )}

        {techStack && techStack.length > 0 && (
          <div className="archive-modal-tech-stack">
            {techStack.map((tech, idx) => (
              <span key={idx} className="archive-modal-tech-tag">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="archive-modal-slideshow">
          <div className="slideshow-container">
            {images.map((image, idx) => (
              <div
                key={idx}
                className={`slideshow-slide ${
                  idx === currentSlide ? "active" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${title} screenshot ${idx + 1}`}
                  className="slideshow-image"
                />
              </div>
            ))}
          </div>

          {imageCount > 1 && (
            <>
              <button
                className="slideshow-nav slideshow-prev"
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <IoChevronBack />
              </button>

              <button
                className="slideshow-nav slideshow-next"
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <IoChevronForward />
              </button>

              <div className="slideshow-indicators">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`slideshow-dot ${
                      idx === currentSlide ? "active" : ""
                    }`}
                    onClick={() =>
                      setSlideState({ archiveKey: activeArchiveKey, index: idx })
                    }
                    aria-current={idx === currentSlide ? "true" : undefined}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="slideshow-counter">
                {currentSlide + 1} / {imageCount}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
