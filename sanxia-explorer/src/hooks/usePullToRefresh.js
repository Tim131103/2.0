import { useEffect, useRef, useState } from 'react';

export function usePullToRefresh(onRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const [pullIndicator, setPullIndicator] = useState(0);
  const startYRef = useRef(null);
  const refreshingRef = useRef(false);

  useEffect(() => {
    function onTouchStart(e) {
      if (window.scrollY === 0) startYRef.current = e.touches[0].clientY;
    }

    function onTouchMove(e) {
      if (startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) setPullIndicator(Math.min(delta / 70, 1));
    }

    function onTouchEnd(e) {
      if (startYRef.current === null) return;
      const delta = e.changedTouches[0].clientY - startYRef.current;
      startYRef.current = null;

      if (delta > 70 && !refreshingRef.current) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPullIndicator(1);
        Promise.resolve(onRefresh()).finally(() => {
          refreshingRef.current = false;
          setRefreshing(false);
          setPullIndicator(0);
        });
      } else {
        setPullIndicator(0);
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh]);

  return { refreshing, pullIndicator };
}
