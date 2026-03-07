import * as React from 'react';

interface DraggableWindowsProviderProps {
  children: React.ReactNode;
}

interface DragSession {
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
      if (activeDrag == null || activeDrag.pointerId !== event.pointerId) {
        return;
      }
      const nextX = activeDrag.startOffsetX + event.clientX - activeDrag.startClientX;
      const nextY = activeDrag.startOffsetY + event.clientY - activeDrag.startClientY;
      activeDrag.element.style.setProperty('--drag-x', `${nextX}px`);
      activeDrag.element.style.setProperty('--drag-y', `${nextY}px`);
    }

    function endDrag(event: PointerEvent) {
      if (activeDrag == null || activeDrag.pointerId !== event.pointerId) {
        return;
      }
      activeDrag.element.removeAttribute('data-dragging');
      activeDrag = undefined;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', endDrag);
      document.removeEventListener('pointercancel', endDrag);
      document.body.style.userSelect = '';
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0 || activeDrag != null) {
        return;
      }

      const draggableWindow = getDraggableWindow(event.target);
      if (draggableWindow == null) {
        return;
      }

      activeDrag = {
        element: draggableWindow,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startOffsetX: getOffset(draggableWindow, '--drag-x'),
        startOffsetY: getOffset(draggableWindow, '--drag-y'),
      };

      event.preventDefault();
      draggableWindow.setAttribute('data-dragging', 'true');
      document.body.style.userSelect = 'none';
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', endDrag);
      document.addEventListener('pointercancel', endDrag);
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', endDrag);
      document.removeEventListener('pointercancel', endDrag);
      if (activeDrag != null) {
        activeDrag.element.removeAttribute('data-dragging');
        activeDrag = undefined;
      }
      document.body.style.userSelect = '';
    };
  }, []);

  return <>{children}</>;
}

function getOffset(element: HTMLElement, variableName: '--drag-x' | '--drag-y') {
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
