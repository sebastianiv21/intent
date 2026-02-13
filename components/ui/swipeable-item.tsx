"use client";

/**
 * SwipeableItem - A reusable "swipe to reveal" component with delete action
 * Refactored: Consolidated refs, reduced state, improved performance (@vercel rerender-use-ref-transient-values)
 */

import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwipeableContext } from "./swipeable-context";

let itemIdCounter = 0;
const generateItemId = () => `swipeable-item-${++itemIdCounter}`;

export interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteText?: string;
  threshold?: number;
  actionWidth?: number;
  snapDuration?: number;
  className?: string;
  "aria-label"?: string;
}

type SwipeState = "closed" | "dragging" | "open";

// Consolidated drag tracking in single ref (@vercel rerender-use-ref-transient-values)
interface DragRef {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  isDragging: boolean;
}

export function SwipeableItem({
  children,
  onDelete,
  deleteText = "Delete",
  threshold = 0.3,
  actionWidth = 100,
  snapDuration = 300,
  className,
  "aria-label": ariaLabel,
}: SwipeableItemProps) {
  const itemId = React.useMemo(() => generateItemId(), []);
  const { openItemId, setOpenItem } = useSwipeableContext();
  const isOpenGlobally = openItemId === itemId;

  // Minimal state - only what affects render output
  const [swipeState, setSwipeState] = React.useState<SwipeState>(
    isOpenGlobally ? "open" : "closed",
  );
  const [translateX, setTranslateX] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Transient values in ref (don't trigger re-renders during drag)
  const dragRef = React.useRef<DragRef>({
    startX: 0,
    startY: 0,
    startTime: 0,
    currentX: 0,
    isDragging: false,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Check reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Sync with global state
  React.useEffect(() => {
    if (!isOpenGlobally && swipeState === "open") {
      setSwipeState("closed");
      setTranslateX(0);
      dragRef.current.currentX = 0;
    } else if (isOpenGlobally && swipeState !== "open") {
      setSwipeState("open");
      setTranslateX(-actionWidth);
      dragRef.current.currentX = -actionWidth;
    }
  }, [isOpenGlobally, swipeState, actionWidth]);

  // Click outside to close
  React.useEffect(() => {
    if (swipeState !== "open") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSwipeState("closed");
        setTranslateX(0);
        dragRef.current.currentX = 0;
        setOpenItem(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [swipeState, setOpenItem]);

  // Pointer handlers - all transient values in ref, minimal state updates
  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== -1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      currentX: dragRef.current.currentX,
      isDragging: false,
    };
  }, []);

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (drag.startX === 0) return;

      const deltaX = e.clientX - drag.startX;
      const deltaY = e.clientY - drag.startY;

      if (!drag.isDragging) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        if (absY > absX && absY > 10) return; // Let vertical scroll happen
        if (absX <= 10) return;
        drag.isDragging = true;
        setSwipeState("dragging");
      }

      const maxSwipe = -actionWidth;
      const minSwipe = 0;
      let newX = Math.max(maxSwipe, Math.min(minSwipe, deltaX));

      if (swipeState === "open") {
        newX = Math.max(maxSwipe, Math.min(minSwipe, -actionWidth + deltaX));
      }
      if (newX < maxSwipe) {
        newX = maxSwipe - Math.abs(newX - maxSwipe) * 0.3;
      }

      drag.currentX = newX;
      setTranslateX(newX);
    },
    [actionWidth, swipeState],
  );

  const snapToPosition = React.useCallback(() => {
    const drag = dragRef.current;
    const elapsed = Date.now() - drag.startTime;
    const distance = Math.abs(drag.currentX);
    const velocity = distance / elapsed;
    const shouldOpen =
      drag.currentX < 0 &&
      (distance > actionWidth * threshold || velocity > 0.5);

    if (shouldOpen) {
      setSwipeState("open");
      setTranslateX(-actionWidth);
      drag.currentX = -actionWidth;
      setOpenItem(itemId);
    } else {
      setSwipeState("closed");
      setTranslateX(0);
      drag.currentX = 0;
      if (openItemId === itemId) setOpenItem(null);
    }
    drag.isDragging = false;
  }, [actionWidth, threshold, itemId, setOpenItem, openItemId]);

  const handlePointerUp = React.useCallback(() => {
    if (!dragRef.current.isDragging) {
      if (swipeState === "open") {
        setSwipeState("closed");
        setTranslateX(0);
        dragRef.current.currentX = 0;
        setOpenItem(null);
      }
      return;
    }
    snapToPosition();
    dragRef.current.startX = 0;
    dragRef.current.startY = 0;
  }, [snapToPosition, swipeState, setOpenItem]);

  const handlePointerCancel = React.useCallback(() => {
    dragRef.current.isDragging = false;
    dragRef.current.startX = 0;
    if (swipeState === "open") {
      setTranslateX(-actionWidth);
      dragRef.current.currentX = -actionWidth;
    } else {
      setTranslateX(0);
      dragRef.current.currentX = 0;
    }
  }, [swipeState, actionWidth]);

  const handleDelete = React.useCallback(() => {
    setIsDeleting(true);
    setTimeout(
      () => {
        onDelete();
        setIsDeleting(false);
        setSwipeState("closed");
        setTranslateX(0);
        dragRef.current.currentX = 0;
        setOpenItem(null);
      },
      reducedMotion ? 0 : 250,
    );
  }, [onDelete, setOpenItem, reducedMotion]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const isOpen = swipeState === "open";
        setSwipeState(isOpen ? "closed" : "open");
        setTranslateX(isOpen ? 0 : -actionWidth);
        dragRef.current.currentX = isOpen ? 0 : -actionWidth;
        setOpenItem(isOpen ? null : itemId);
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        swipeState === "open"
      ) {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Escape" && swipeState === "open") {
        e.preventDefault();
        setSwipeState("closed");
        setTranslateX(0);
        dragRef.current.currentX = 0;
        setOpenItem(null);
      }
    },
    [swipeState, actionWidth, itemId, setOpenItem, handleDelete],
  );

  // Derived values (computed during render, no memo needed for simple math)
  const isDragging = swipeState === "dragging";
  const revealProgress = Math.min(Math.abs(translateX) / actionWidth, 1);
  const isOpen = swipeState === "open";

  // Container animation style
  const containerStyle: React.CSSProperties = isDeleting
    ? {
        opacity: 0,
        transform: "translateX(-100%)",
        height: 0,
        margin: 0,
        transition: reducedMotion ? "none" : "all 250ms ease",
      }
    : {
        opacity: 1,
        transform: "translateX(0)",
        height: "auto",
        transition: reducedMotion ? "none" : "all 250ms ease",
      };

  // Card transition style
  const cardTransition = reducedMotion
    ? "none"
    : isDragging
      ? "none"
      : `transform ${snapDuration}ms ease, border-radius ${snapDuration}ms ease`;

  // Border radius interpolation
  const borderRadius =
    revealProgress > 0.05
      ? `${24 * (1 - revealProgress)}px 0 0 ${24 * (1 - revealProgress)}px`
      : "24px";

  return (
    <div
      ref={containerRef}
      className={cn("relative", isDeleting && "pointer-events-none", className)}
      style={containerStyle}
      role="listitem"
    >
      {/* Delete Action Background */}
      <div
        className="absolute top-0 bottom-0 right-0 flex items-center justify-center z-0 overflow-hidden"
        style={{
          width: actionWidth,
          background: "linear-gradient(135deg, #c45c4a 0%, #a94442 100%)",
          borderRadius: "0 24px 24px 0",
          boxShadow: "inset 4px 0 8px rgba(0,0,0,0.15)",
          borderLeft:
            revealProgress > 0.05
              ? `${revealProgress}px solid rgba(255,255,255,${0.15 * revealProgress})`
              : "none",
          opacity: 0.5 + revealProgress * 0.5,
          transition: isDragging ? "none" : `opacity ${snapDuration}ms ease`,
        }}
        aria-hidden={!isOpen}
      >
        <button
          onClick={handleDelete}
          className="relative z-10 flex flex-col items-center justify-center gap-1 px-2 text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
          style={{
            transform: `scale(${0.9 + revealProgress * 0.1})`,
            transition: isDragging
              ? "none"
              : `transform ${snapDuration}ms ease`,
          }}
          aria-label={`${deleteText}${ariaLabel ? `: ${ariaLabel}` : ""}`}
          tabIndex={isOpen ? 0 : -1}
        >
          <Trash2 className="w-5 h-5" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-wide">
            {deleteText}
          </span>
        </button>
      </div>

      {/* Main Content Card */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative z-10 w-full touch-pan-y select-none bg-card",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: cardTransition,
          touchAction: "pan-y",
          cursor: isDragging ? "grabbing" : "grab",
          borderRadius,
          border: `1px solid var(--border)`,
          borderRight: revealProgress > 0.05 ? "none" : undefined,
          boxShadow:
            revealProgress > 0
              ? `${-4 * revealProgress}px 0 ${16 * revealProgress}px rgba(0,0,0,0.15)`
              : "none",
        }}
        role="button"
        tabIndex={0}
        aria-label={
          ariaLabel || "Swipeable item. Press Enter to reveal delete action."
        }
        aria-pressed={isOpen}
      >
        {children}
      </div>
    </div>
  );
}
