import * as React from 'react';

import styles from '@/DraggableWindowsProvider.module.css';

interface DraggableWindowsProviderProps {
  children: React.ReactNode;
}

interface DragSession {
  currentOffsetX: number;
  currentOffsetY: number;
  element: HTMLElement;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startOffsetX: number;
  startOffsetY: number;
}

export default function DraggableWindowsProvider({ children }: DraggableWindowsProviderProps) {
  React.useEffect(() => {
    let activeDrag: DragSession | undefined;

    function handlePointerMove(event: PointerEvent) {
      dragMove(event, activeDrag);
    }

    function handlePointerUp(event: PointerEvent) {
      dragEnd(event, activeDrag);
      activeDrag = undefined;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    }

    function handlePointerDown(event: PointerEvent) {
      activeDrag = dragStart(event, activeDrag);
      if (activeDrag == null) {
        return;
      }
      event.preventDefault();
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointercancel', handlePointerUp);
    }

    function handleResize() {
      clampAllDraggables(activeDrag);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleResize);
    clampAllDraggables(activeDrag);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (activeDrag != null) {
        activeDrag.element.removeAttribute('data-dragging');
        activeDrag = undefined;
      }

      document.body.style.userSelect = '';
    };
  }, []);

  return <div className={styles.stage}>{children}</div>;
}

function dragStart(event: PointerEvent, activeDrag: DragSession | undefined): DragSession | undefined {
  if (event.button !== 0 || activeDrag != null) {
    return undefined;
  }

  const draggableWindow = getDraggableWindow(event.target);
  if (draggableWindow == null) {
    return undefined;
  }

  const startOffsetX = getOffset(draggableWindow, '--pos-x');
  const startOffsetY = getOffset(draggableWindow, '--pos-y');

  draggableWindow.setAttribute('data-dragging', 'true');
  document.body.style.userSelect = 'none';

  return {
    currentOffsetX: startOffsetX,
    currentOffsetY: startOffsetY,
    element: draggableWindow,
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startOffsetX,
    startOffsetY,
  };
}

function dragMove(event: PointerEvent, activeDrag: DragSession | undefined) {
  if (activeDrag == null || activeDrag.pointerId !== event.pointerId) {
    return;
  }

  const nextX = activeDrag.startOffsetX + event.clientX - activeDrag.startClientX;
  const nextY = activeDrag.startOffsetY + event.clientY - activeDrag.startClientY;
  const clampedOffset = clampOffset(
    activeDrag.element,
    activeDrag.currentOffsetX,
    activeDrag.currentOffsetY,
    nextX,
    nextY
  );

  activeDrag.currentOffsetX = clampedOffset.x;
  activeDrag.currentOffsetY = clampedOffset.y;
  applyOffset(activeDrag.element, clampedOffset.x, clampedOffset.y);
}

function dragEnd(event: PointerEvent, activeDrag: DragSession | undefined) {
  if (activeDrag == null || activeDrag.pointerId !== event.pointerId) {
    return;
  }

  const roundedOffset = clampOffset(
    activeDrag.element,
    activeDrag.currentOffsetX,
    activeDrag.currentOffsetY,
    roundToDevicePixel(activeDrag.currentOffsetX),
    roundToDevicePixel(activeDrag.currentOffsetY)
  );

  applyOffset(activeDrag.element, roundedOffset.x, roundedOffset.y);
  activeDrag.element.removeAttribute('data-dragging');
  document.body.style.userSelect = '';
}

function roundToDevicePixel(value: number) {
  const devicePixelRatio = window.devicePixelRatio ?? 1;
  const step = 1 / devicePixelRatio;
  return Math.round(value / step) * step;
}

function getOffset(element: HTMLElement, variableName: '--pos-x' | '--pos-y') {
  const inlineValue = element.style.getPropertyValue(variableName);
  const parsedInlineValue = Number.parseFloat(inlineValue);
  return Number.isNaN(parsedInlineValue) ? 0 : parsedInlineValue;
}

function getDraggableWindow(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  let current: Element | null = target;
  let handle: HTMLElement | null = null;

  while (current != null) {
    if (!(current instanceof HTMLElement)) {
      current = current.parentElement;
      continue;
    }
    if (current.hasAttribute('data-no-drag')) {
      return null;
    }
    if (current.hasAttribute('data-drag-handle')) {
      handle = current;
    }
    if (current.hasAttribute('data-draggable') && handle != null) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function applyOffset(element: HTMLElement, x: number, y: number) {
  element.style.setProperty('--pos-x', `${x}px`);
  element.style.setProperty('--pos-y', `${y}px`);
}

function clampRectToViewport(rect: DOMRect) {
  let deltaX = 0;
  let deltaY = 0;

  if (rect.width >= window.innerWidth) {
    deltaX = -rect.left;
  } else if (rect.left < 0) {
    deltaX = -rect.left;
  } else if (rect.right > window.innerWidth) {
    deltaX = window.innerWidth - rect.right;
  }

  if (rect.height >= window.innerHeight) {
    deltaY = -rect.top;
  } else if (rect.top < 0) {
    deltaY = -rect.top;
  } else if (rect.bottom > window.innerHeight) {
    deltaY = window.innerHeight - rect.bottom;
  }

  return { deltaX, deltaY };
}

function clampOffset(
  element: HTMLElement,
  currentOffsetX: number,
  currentOffsetY: number,
  nextOffsetX: number,
  nextOffsetY: number
) {
  const currentRect = element.getBoundingClientRect();
  const nextRect = new DOMRect(
    currentRect.left + (nextOffsetX - currentOffsetX),
    currentRect.top + (nextOffsetY - currentOffsetY),
    currentRect.width,
    currentRect.height
  );
  const { deltaX, deltaY } = clampRectToViewport(nextRect);

  return {
    x: nextOffsetX + deltaX,
    y: nextOffsetY + deltaY,
  };
}

function clampAllDraggables(activeDrag: DragSession | undefined) {
  for (const element of document.querySelectorAll<HTMLElement>('[data-draggable]')) {
    const currentOffsetX = getOffset(element, '--pos-x');
    const currentOffsetY = getOffset(element, '--pos-y');
    const clampedOffset = clampOffset(element, currentOffsetX, currentOffsetY, currentOffsetX, currentOffsetY);
    applyOffset(element, clampedOffset.x, clampedOffset.y);

    if (activeDrag?.element === element) {
      activeDrag.currentOffsetX = clampedOffset.x;
      activeDrag.currentOffsetY = clampedOffset.y;
      activeDrag.startOffsetX = clampedOffset.x;
      activeDrag.startOffsetY = clampedOffset.y;
    }
  }
}
