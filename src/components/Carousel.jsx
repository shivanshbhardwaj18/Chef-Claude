import React, { useRef, useEffect } from 'react';
import './Carousel.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ title, items, renderItem }) => {
  const trackRef = useRef(null);
  const isAdjustingRef = useRef(false);

  const extended = [...items, ...items, ...items];

  const setSmooth = (on) => {
    const el = trackRef.current;
    if (!el) return;
    if (on) el.classList.remove('no-smooth');
    else el.classList.add('no-smooth');
  };

  const getOneSetWidth = () => {
    const track = trackRef.current;
    if (!track || items.length === 0) return 0;

    const firstItem = track.querySelector('.carousel-item');
    if (!firstItem) return 0;

    const itemWidth = firstItem.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 24) || 24;

    return items.length * (itemWidth + gap);
  };

  const goToMiddle = () => {
    const track = trackRef.current;
    if (!track) return;
    const oneSet = getOneSetWidth();
    if (!oneSet) return;

    setSmooth(false);
    track.scrollLeft = oneSet;
    requestAnimationFrame(() => setSmooth(true));
  };

  const keepInMiddle = () => {
    const track = trackRef.current;
    if (!track || isAdjustingRef.current) return;

    const oneSet = getOneSetWidth();
    if (!oneSet) return;

    const x = track.scrollLeft;
    const start = oneSet;
    const end = oneSet * 2;

    const EPS = 2;

    if (x >= end - EPS) {
      isAdjustingRef.current = true;
      setSmooth(false);
      track.scrollLeft = x - oneSet;
      requestAnimationFrame(() => {
        setSmooth(true);
        isAdjustingRef.current = false;
      });
    } else if (x <= start + EPS - oneSet) {
      isAdjustingRef.current = true;
      setSmooth(false);
      track.scrollLeft = x + oneSet;
      requestAnimationFrame(() => {
        setSmooth(true);
        isAdjustingRef.current = false;
      });
    }
  };

  const scrollByCards = (dir = 1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstItem = track.querySelector('.carousel-item');
    if (!firstItem) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 24) || 24;
    const itemWidth = firstItem.offsetWidth;
    const delta = (itemWidth + gap) * 3 * dir;

    track.scrollBy({ left: delta, behavior: 'smooth' });
  };

  useEffect(() => {
    const id = requestAnimationFrame(goToMiddle);

    const onResize = () => goToMiddle();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
    };
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => keepInMiddle();
    track.addEventListener('scroll', onScroll, { passive: true });

    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="carousel-section">
      <h2 className="carousel-title">{title}</h2>

      <div className="carousel-fade-wrapper">
        <div className="carousel-track" ref={trackRef}>
          {extended.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="carousel-item">
              {renderItem(item)}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel-arrow left"
          aria-label="Scroll left"
          onClick={() => scrollByCards(-1)}
        >
          <ChevronLeft size={28} />
        </button>

        <button
          type="button"
          className="carousel-arrow right"
          aria-label="Scroll right"
          onClick={() => scrollByCards(1)}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
};

export default Carousel;