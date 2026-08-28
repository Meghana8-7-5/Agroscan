import React, { ChangeEvent, useState, useRef } from "react";
import {
  Settings,
  Upload,
  RotateCcw,
  X,
  ShieldAlert,
  Maximize2,
  Type,
  Image as ImageIcon,
  Sliders,
  Palette,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SunMedium,
  Check,
  Trash2
} from "lucide-react";
import { useUiEditContext, type FrameCustomization } from "../contexts/UiEditContext";

export interface EditableFrameProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  defaultBgColor?: string;
  defaultTextColor?: string;
  defaultIconColor?: string;
  defaultBorderColor?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultBadgeText?: string;
  defaultButtonText?: string;
  isHeroPanel?: boolean;
  isTextOnly?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export default function EditableFrame({
  id,
  children,
  className = "",
  defaultBgColor,
  defaultTextColor,
  defaultIconColor,
  defaultBorderColor,
  defaultTitle,
  defaultSubtitle,
  defaultBadgeText,
  defaultButtonText,
  isHeroPanel = false,
  isTextOnly = false,
  style = {},
  onClick,
}: EditableFrameProps) {
  const {
    isAdminAuthenticated,
    isEditMode,
    isPreviewAsFarmer,
    getCustomization,
    updateCustomization,
    resetCustomization,
    activeEditingId,
    setActiveEditingId,
  } = useUiEditContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const custom = getCustomization(id);
  const showEditControls = isAdminAuthenticated && isEditMode && !isPreviewAsFarmer;
  const isEditing = showEditControls && activeEditingId === id;

  const [activeTab, setActiveTab] = useState<"content" | "colors" | "image" | "layout">(
    isHeroPanel ? "image" : "content"
  );

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isAdminAuthenticated) return;
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        updateCustomization(id, { customImageUrl: String(reader.result) });
      };
      reader.readAsDataURL(file);
    }
  };

  const overlayDarkness = custom?.overlayDarkness !== undefined ? custom.overlayDarkness : (isHeroPanel ? 0.65 : 0.4);
  const imageOpacity = custom?.imageOpacity !== undefined ? custom.imageOpacity : 1;

  // Build container styles
  const combinedStyle: React.CSSProperties = {
    ...style,
    backgroundColor: custom?.bgColor || defaultBgColor || style.backgroundColor,
    color: custom?.textColor || defaultTextColor || style.color,
    borderColor: custom?.borderColor || defaultBorderColor || style.borderColor,
    position: (style.position || "relative") as any,
    overflow: showEditControls ? "visible" : style.overflow,
  };

  // If frame has a custom background photo upload
  if (custom?.customImageUrl) {
    combinedStyle.backgroundImage = `linear-gradient(180deg, rgba(20,45,28,${overlayDarkness * 0.3}) 0%, rgba(20,45,28,${overlayDarkness}) 100%), url(${custom.customImageUrl})`;
    combinedStyle.backgroundSize = "cover";
    combinedStyle.backgroundPosition = "center";
  }

  const handleClick = (e: React.MouseEvent) => {
    if (showEditControls) {
      e.stopPropagation();
      setActiveEditingId(isEditing ? null : id);
    }
    if (onClick) {
      onClick(e);
    }
  };

  if (custom?.hideElement && !showEditControls) {
    return null;
  }

  return (
    <div
      style={combinedStyle}
      className={`transition-all duration-200 ${className} ${
        showEditControls
          ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black/10 cursor-pointer relative overflow-visible"
          : ""
      }`}
      onClick={handleClick}
      data-editable-id={id}
    >
      {/* Top-Right Edit Toolbar Cluster (Unclipped with generous z-index & offset) */}
      {showEditControls && (
        <div
          className="absolute -top-3.5 -right-3.5 z-[70] flex items-center gap-1 rounded-full bg-gray-950/90 p-1 text-white shadow-2xl border-2 border-amber-400 backdrop-blur-md transition-all hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Button 1: Edit Text */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("content");
              setActiveEditingId(isEditing && activeTab === "content" ? null : id);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors cursor-pointer ${
              isEditing && activeTab === "content"
                ? "bg-[#2f6b45] text-white"
                : "bg-white/15 text-amber-300 hover:bg-white/30"
            }`}
            title="Edit Text & Content"
          >
            <Type size={11} />
          </button>

          {/* Button 2: Color Options */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("colors");
              setActiveEditingId(isEditing && activeTab === "colors" ? null : id);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors cursor-pointer ${
              isEditing && activeTab === "colors"
                ? "bg-[#2f6b45] text-white"
                : "bg-white/15 text-emerald-300 hover:bg-white/30"
            }`}
            title="Edit Colors (Background, Text, Border, Accent)"
          >
            <Palette size={11} />
          </button>

          {/* Button 3: Add / Replace Image */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("image");
              setActiveEditingId(isEditing && activeTab === "image" ? null : id);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors cursor-pointer ${
              isEditing && activeTab === "image"
                ? "bg-[#2f6b45] text-white"
                : "bg-white/15 text-sky-300 hover:bg-white/30"
            }`}
            title="Add / Replace Image or Photo"
          >
            <ImageIcon size={11} />
          </button>

          {/* Button 4: Full Settings */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveEditingId(isEditing ? null : id);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors cursor-pointer ${
              isEditing
                ? "bg-amber-500 text-gray-950 font-bold"
                : "bg-amber-400 text-gray-950 font-bold hover:bg-amber-300"
            }`}
            title={`Full settings for element: ${id}`}
          >
            <Settings size={12} />
          </button>
        </div>
      )}

      {/* Render children content */}
      {children}

      {/* Rich Site-Wide Customization Panel */}
      {isEditing && (
        <div
          className="absolute top-full left-0 z-[80] mt-3 w-84 max-w-[90vw] rounded-3xl border-2 border-amber-400 bg-[#fbfbf9] p-5 shadow-2xl text-xs text-[#1c3827] space-y-3.5 cursor-default animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
            <span className="font-extrabold text-[#234d32] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <ShieldAlert size={14} className="text-amber-600" />
              Edit: <span className="text-amber-800 font-mono font-bold">{id}</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveEditingId(null)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-amber-100/70 p-1 gap-1 border border-amber-200">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === "content" ? "bg-[#2f6b45] text-white shadow-sm" : "text-[#234d32] hover:bg-amber-200/60"
              }`}
            >
              <Type size={11} /> Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("colors")}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === "colors" ? "bg-[#2f6b45] text-white shadow-sm" : "text-[#234d32] hover:bg-amber-200/60"
              }`}
            >
              <Palette size={11} /> Colors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === "image" ? "bg-[#2f6b45] text-white shadow-sm" : "text-[#234d32] hover:bg-amber-200/60"
              }`}
            >
              <ImageIcon size={11} /> Image
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("layout")}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === "layout" ? "bg-[#2f6b45] text-white shadow-sm" : "text-[#234d32] hover:bg-amber-200/60"
              }`}
            >
              <Sliders size={11} /> Layout
            </button>
          </div>

          {/* TAB 1: Content & Text */}
          {activeTab === "content" && (
            <div className="space-y-2.5">
              <div>
                <label className="font-bold text-[#1e3b2a] block mb-1">Headline / Title</label>
                <input
                  type="text"
                  placeholder={defaultTitle || "Enter custom title..."}
                  value={custom?.title || ""}
                  onChange={(e) => updateCustomization(id, { title: e.target.value })}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1c3827] focus:ring-2 focus:ring-[#2f6b45]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1e3b2a] block mb-1">Subtext / Subtitle</label>
                <textarea
                  rows={2}
                  placeholder={defaultSubtitle || "Enter custom description..."}
                  value={custom?.subtitle || ""}
                  onChange={(e) => updateCustomization(id, { subtitle: e.target.value })}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1c3827] focus:ring-2 focus:ring-[#2f6b45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#1e3b2a] block mb-1">Badge Text</label>
                  <input
                    type="text"
                    placeholder={defaultBadgeText || "Badge"}
                    value={custom?.badgeText || ""}
                    onChange={(e) => updateCustomization(id, { badgeText: e.target.value })}
                    className="w-full rounded-xl border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1e3b2a] block mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder={defaultButtonText || "Button"}
                    value={custom?.buttonText || ""}
                    onChange={(e) => updateCustomization(id, { buttonText: e.target.value })}
                    className="w-full rounded-xl border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Color Palette */}
          {activeTab === "colors" && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-2 border border-amber-200 shadow-sm">
                  <label className="font-bold text-[#1e3b2a] block mb-1">Background</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={custom?.bgColor || defaultBgColor || "#ffffff"}
                      onChange={(e) => updateCustomization(id, { bgColor: e.target.value })}
                      className="h-7 w-9 cursor-pointer rounded-lg border border-gray-300 p-0.5"
                    />
                    <span className="text-[10px] font-mono text-gray-600 truncate">{custom?.bgColor || "Default"}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-2 border border-amber-200 shadow-sm">
                  <label className="font-bold text-[#1e3b2a] block mb-1">Text Color</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={custom?.textColor || defaultTextColor || "#1c3827"}
                      onChange={(e) => updateCustomization(id, { textColor: e.target.value })}
                      className="h-7 w-9 cursor-pointer rounded-lg border border-gray-300 p-0.5"
                    />
                    <span className="text-[10px] font-mono text-gray-600 truncate">{custom?.textColor || "Default"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-2 border border-amber-200 shadow-sm">
                  <label className="font-bold text-[#1e3b2a] block mb-1">Border Color</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={custom?.borderColor || defaultBorderColor || "#d8e0cc"}
                      onChange={(e) => updateCustomization(id, { borderColor: e.target.value })}
                      className="h-7 w-9 cursor-pointer rounded-lg border border-gray-300 p-0.5"
                    />
                    <span className="text-[10px] font-mono text-gray-600 truncate">{custom?.borderColor || "Default"}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-2 border border-amber-200 shadow-sm">
                  <label className="font-bold text-[#1e3b2a] block mb-1">Accent / Icon</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={custom?.iconColor || defaultIconColor || "#2f6b45"}
                      onChange={(e) => updateCustomization(id, { iconColor: e.target.value })}
                      className="h-7 w-9 cursor-pointer rounded-lg border border-gray-300 p-0.5"
                    />
                    <span className="text-[10px] font-mono text-gray-600 truncate">{custom?.iconColor || "Default"}</span>
                  </div>
                </div>
              </div>

              {/* Quick Palette Presets */}
              <div>
                <label className="font-bold text-[#1e3b2a] block mb-1 text-[11px]">Quick Color Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "Forest Green", bg: "#1f4a30", text: "#ffffff", border: "#2f6b45" },
                    { name: "Oat Paper", bg: "#f7f8f4", text: "#183624", border: "#d8e2cf" },
                    { name: "Emerald Light", bg: "#e9f4e2", text: "#1b4028", border: "#c2dcb3" },
                    { name: "Amber Warm", bg: "#fef3c7", text: "#78350f", border: "#fcd34d" },
                    { name: "Night Sky", bg: "#111827", text: "#f9fafb", border: "#374151" },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        updateCustomization(id, {
                          bgColor: preset.bg,
                          textColor: preset.text,
                          borderColor: preset.border,
                        })
                      }
                      className="rounded-lg px-2 py-1 text-[10px] font-bold border border-gray-300 hover:scale-105 transition-transform cursor-pointer"
                      style={{ backgroundColor: preset.bg, color: preset.text }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Image & Photo Upload */}
          {activeTab === "image" && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#1e3b2a] block mb-1">
                  {isHeroPanel ? "Hero Background Photo" : "Upload Image Asset"}
                </label>
                <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#2f6b45] bg-[#f2f7ec] p-3 font-bold text-[#2f6b45] cursor-pointer hover:bg-[#e4eed9] transition-colors">
                  <Upload size={15} />
                  <span>{custom?.customImageUrl ? "Replace Photo" : "Upload Farm / Field Photo"}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {custom?.customImageUrl ? (
                <div className="space-y-2.5 rounded-2xl bg-amber-50/80 p-3 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#234d32] text-[11px]">Photo Preview</span>
                    <button
                      type="button"
                      onClick={() => updateCustomization(id, { customImageUrl: undefined })}
                      className="text-rose-600 hover:underline text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={11} /> Remove Photo
                    </button>
                  </div>
                  <img
                    src={custom.customImageUrl}
                    alt="Custom Upload"
                    className="h-20 w-full object-cover rounded-xl border border-amber-300"
                  />

                  {/* Dark Overlay Slider for Readability */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#1e3b2a] text-[11px] flex items-center gap-1">
                        <SunMedium size={12} /> Text Overlay Darkness
                      </label>
                      <span className="font-bold text-[#2f6b45] text-[11px]">
                        {Math.round(overlayDarkness * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={overlayDarkness}
                      onChange={(e) => updateCustomization(id, { overlayDarkness: Number(e.target.value) })}
                      className="w-full accent-[#2f6b45] cursor-pointer"
                    />
                    <p className="text-[10px] text-[#52705d] mt-0.5">
                      Adjust so overlay text remains 100% crisp &amp; legible over the photo.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-[#52705d] italic">
                  No image currently applied. Uploading a photo will set it as the background for this element.
                </p>
              )}
            </div>
          )}

          {/* TAB 4: Layout & Sizing */}
          {activeTab === "layout" && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#1e3b2a] block mb-1 flex items-center gap-1">
                  <Maximize2 size={12} /> Grid Column Span
                </label>
                <div className="flex items-center gap-1 rounded-xl bg-amber-50 p-1 border border-amber-200">
                  <button
                    type="button"
                    onClick={() => updateCustomization(id, { colSpan: 1 })}
                    className={`flex-1 py-1 flex items-center justify-center rounded-lg font-bold cursor-pointer ${
                      (custom?.colSpan || 1) === 1 ? "bg-[#2f6b45] text-white" : "hover:bg-amber-100 text-[#1e3b2a]"
                    }`}
                  >
                    1 Col
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCustomization(id, { colSpan: 2 })}
                    className={`flex-1 py-1 flex items-center justify-center rounded-lg font-bold cursor-pointer ${
                      custom?.colSpan === 2 ? "bg-[#2f6b45] text-white" : "hover:bg-amber-100 text-[#1e3b2a]"
                    }`}
                  >
                    2 Cols
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCustomization(id, { colSpan: 3 })}
                    className={`flex-1 py-1 flex items-center justify-center rounded-lg font-bold cursor-pointer ${
                      custom?.colSpan === 3 ? "bg-[#2f6b45] text-white" : "hover:bg-amber-100 text-[#1e3b2a]"
                    }`}
                  >
                    Full Width
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1e3b2a] block mb-1">Text Alignment</label>
                <div className="flex items-center gap-1 rounded-xl bg-amber-50 p-1 border border-amber-200">
                  <button
                    type="button"
                    onClick={() => updateCustomization(id, { horizontalAlign: "flex-start" })}
                    className={`flex-1 py-1 flex items-center justify-center rounded-lg font-bold cursor-pointer ${
                      custom?.horizontalAlign === "flex-start" ? "bg-[#2f6b45] text-white" : "hover:bg-amber-100 text-[#1e3b2a]"
                    }`}
                  >
                    <AlignLeft size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCustomization(id, { horizontalAlign: "center" })}
                    className={`flex-1 py-1 flex items-center justify-center rounded-lg font-bold cursor-pointer ${
                      (!custom?.horizontalAlign || custom?.horizontalAlign === "center") ? "bg-[#2f6b45] text-white" : "hover:bg-amber-100 text-[#1e3b2a]"
                    }`}
                  >
                    <AlignCenter size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCustomization(id, { horizontalAlign: "flex-end" })}
                    className={`flex-1 py-1 flex items-center justify-center rounded-lg font-bold cursor-pointer ${
                      custom?.horizontalAlign === "flex-end" ? "bg-[#2f6b45] text-white" : "hover:bg-amber-100 text-[#1e3b2a]"
                    }`}
                  >
                    <AlignRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="pt-2 border-t border-amber-200 flex gap-2">
            <button
              type="button"
              onClick={() => resetCustomization(id)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} /> Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
