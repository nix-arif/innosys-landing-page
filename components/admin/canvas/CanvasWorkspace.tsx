"use client";

import { createPortal } from "react-dom";
import { useCanvasEditor } from "./useCanvasEditor";
import { CanvasStage } from "./CanvasStage";
import { CanvasControls } from "./CanvasControls";
import type { CanvasContent, Locale } from "@/lib/content";

/**
 * Renders the interactive stage in place (the center workspace) and portals
 * the add/layers/inspector controls into a dock element owned by the parent
 * layout (the right-hand panel), so both stay driven by one shared editor
 * state instead of the stage and controls living far apart in the tree.
 *
 * `dockNode` is state set by a callback ref on the dock element (rather than
 * a plain ref read during render), which is what a re-render once the dock
 * mounts without reading `.current` outside an event/effect.
 */
export function CanvasWorkspace({
  content,
  locale,
  onChange,
  dockNode,
}: {
  content: CanvasContent;
  locale: Locale;
  onChange: (content: CanvasContent) => void;
  dockNode: HTMLDivElement | null;
}) {
  const editor = useCanvasEditor(content, onChange);

  return (
    <>
      <CanvasStage
        content={content}
        breakpoint={editor.breakpoint}
        setBreakpoint={editor.setBreakpoint}
        selectedId={editor.selectedId}
        stageRef={editor.stageRef}
        locale={locale}
        gridEnabled={editor.gridEnabled}
        setGridEnabled={editor.setGridEnabled}
        gridSize={editor.gridSize}
        setGridSize={editor.setGridSize}
        onSelect={editor.setSelectedId}
        onLayoutChange={editor.updateLayout}
        onDeselect={() => editor.setSelectedId(null)}
        onHeightChange={editor.setHeight}
        onBackgroundChange={editor.setBackground}
        onCopyDesktopLayout={editor.copyDesktopLayoutHere}
      />
      {dockNode
        ? createPortal(
            <CanvasControls
              content={content}
              breakpoint={editor.breakpoint}
              selectedId={editor.selectedId}
              selectedElement={editor.selectedElement}
              locale={locale}
              onSelect={editor.setSelectedId}
              onAddElement={editor.addElement}
              onReorderElements={editor.setElements}
              onElementChange={(next) =>
                editor.selectedElement && editor.updateElement(editor.selectedElement.id, next)
              }
              onLayoutChange={(next) =>
                editor.selectedElement && editor.updateLayout(editor.selectedElement.id, next)
              }
              onDeleteElement={() =>
                editor.selectedElement && editor.removeElement(editor.selectedElement.id)
              }
            />,
            dockNode
          )
        : null}
    </>
  );
}
