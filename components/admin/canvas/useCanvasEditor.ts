"use client";

import { useRef, useState } from "react";
import { randomUUID } from "@/components/admin/randomId";
import type { Breakpoint, CanvasContent, CanvasElement, ElementLayout } from "@/lib/content";

function defaultLayout(): ElementLayout {
  return { x: 30, y: 35, width: 40, height: 20, rotation: 0, fontSize: 20 };
}

function sameForAllBreakpoints(layout: ElementLayout): Record<Breakpoint, ElementLayout> {
  return { desktop: { ...layout }, tablet: { ...layout }, mobile: { ...layout } };
}

function newElement(type: CanvasElement["type"]): CanvasElement {
  const id = randomUUID();
  const layouts = sameForAllBreakpoints(defaultLayout());
  switch (type) {
    case "text":
      return {
        id,
        type,
        text: { en: "New text", ms: "Teks baharu" },
        color: "var(--color-deep-blue)",
        fontWeight: "bold",
        align: "left",
        fontFamily: "sans",
        layouts,
      };
    case "image":
      return {
        id,
        type,
        src: "/assets/mascot/android-chrome-512x512.png",
        alt: { en: "Image", ms: "Imej" },
        radius: 16,
        layouts,
      };
    case "button":
      return {
        id,
        type,
        label: { en: "Click me", ms: "Klik saya" },
        href: "#",
        bg: "var(--color-coral)",
        textColor: "#ffffff",
        radius: 999,
        layouts,
      };
    case "shape":
      return {
        id,
        type,
        shape: "rectangle",
        fill: "var(--color-sky-blue)",
        opacity: 0.25,
        radius: 24,
        layouts,
      };
  }
}

/** Shared state + mutations for a canvas section, used by both the stage
 * (center workspace) and the controls (right dock) so they stay in sync. */
export function useCanvasEditor(content: CanvasContent, onChange: (content: CanvasContent) => void) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(content.elements[0]?.id ?? null);
  const stageRef = useRef<HTMLDivElement>(null);

  const selectedElement = content.elements.find((el) => el.id === selectedId) ?? null;

  function setElements(elements: CanvasElement[]) {
    onChange({ ...content, elements });
  }

  function updateElement(id: string, next: CanvasElement) {
    setElements(content.elements.map((el) => (el.id === id ? next : el)));
  }

  function updateLayout(id: string, next: ElementLayout) {
    setElements(
      content.elements.map((el) =>
        el.id === id
          ? ({ ...el, layouts: { ...el.layouts, [breakpoint]: next } } as CanvasElement)
          : el
      )
    );
  }

  function addElement(type: CanvasElement["type"]) {
    const element = newElement(type);
    setElements([...content.elements, element]);
    setSelectedId(element.id);
  }

  function removeElement(id: string) {
    setElements(content.elements.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function copyDesktopLayoutHere() {
    setElements(
      content.elements.map((el) => ({
        ...el,
        layouts: { ...el.layouts, [breakpoint]: { ...el.layouts.desktop } },
      }))
    );
  }

  function setHeight(px: number) {
    onChange({ ...content, heightPx: { ...content.heightPx, [breakpoint]: px } });
  }

  function setBackground(color: string) {
    onChange({ ...content, background: color });
  }

  return {
    breakpoint,
    setBreakpoint,
    selectedId,
    setSelectedId,
    stageRef,
    selectedElement,
    setElements,
    updateElement,
    updateLayout,
    addElement,
    removeElement,
    copyDesktopLayoutHere,
    setHeight,
    setBackground,
  };
}
