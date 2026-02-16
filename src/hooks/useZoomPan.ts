import { useState, useEffect, useRef, useCallback } from "react";
import { parseSvgDimensions } from "../export/png";

export function useZoomPan(resetTrigger: string) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  const fitToView = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp || !resetTrigger) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }
    const vpW = vp.clientWidth;
    const vpH = vp.clientHeight;
    const { w: svgW, h: svgH } = parseSvgDimensions(resetTrigger);
    const PADDING = 0.95;
    const scaleX = (vpW / svgW) * PADDING;
    const scaleY = (vpH / svgH) * PADDING;
    const newZoom = Math.min(scaleX, scaleY, 1);
    setZoom(Math.max(newZoom, 0.5));
    setPan({ x: 0, y: 0 });
  }, [resetTrigger]);

  useEffect(() => {
    requestAnimationFrame(() => fitToView());
  }, [fitToView]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(0.1, z + delta), 10));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOffset.current = { ...pan };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pan]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({
      x: panOffset.current.x + dx,
      y: panOffset.current.y + dy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 10)), []);
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(z - 0.25, 0.1)),
    []
  );

  return {
    zoom,
    pan,
    viewportRef,
    handlers: {
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    controls: { zoomIn, zoomOut, fitToView },
  };
}
