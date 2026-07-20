"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Work, AlbumImage, WorkType } from "@/lib/types";

export const dynamic = "force-dynamic";

interface FormState {
  type: WorkType;
  title: string;
  description: string;
  cover: string;
  tagsInput: string;
  date: string;
  location: string;
  featured: boolean;
  panoramaUrl: string;
  images: AlbumImage[];
  coverIndex: number;
}

const DEFAULT_FORM: FormState = {
  type: "album",
  title: "",
  description: "",
  cover: "",
  tagsInput: "",
  date: new Date().toISOString().slice(0, 10),
  location: "",
  featured: false,
  panoramaUrl: "",
  images: [],
  coverIndex: 0,
};

interface SortableImageCardProps {
  image: AlbumImage;
  isCover: boolean;
  onCoverSelect: () => void;
  onCaptionChange: (caption: string) => void;
  onDelete: () => void;
}

function SortableImageCard({
  image,
  isCover,
  onCoverSelect,
  onCaptionChange,
  onDelete,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.src });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-3 bg-white rounded-lg border shadow-sm ${
        isCover ? "border-blue-400 ring-1 ring-blue-200" : "border-gray-200"
      }`}
    >
      <button
        type="button"
        className="mt-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0 touch-none"
        aria-label="拖动排序"
        {...attributes}
        {...listeners}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <circle cx="5" cy="4" r="1.2" />
          <circle cx="5" cy="8" r="1.2" />
          <circle cx="5" cy="12" r="1.2" />
          <circle cx="11" cy="4" r="1.2" />
          <circle cx="11" cy="8" r="1.2" />
          <circle cx="11" cy="12" r="1.2" />
        </svg>
      </button>

      <img
        src={image.src}
        alt={image.caption || ""}
        className="w-20 h-16 object-cover rounded shrink-0"
      />

      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={image.caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="图片描述（可选）"
          className="w-full text-sm border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={onCoverSelect}
          className={`mt-2 text-xs px-2.5 py-1 rounded border transition-colors ${
            isCover
              ? "bg-blue-600 text-white border-blue-600"
              : "text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {isCover ? "✓ 已设为封面" : "设为封面"}
        </button>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
        aria-label="删除图片"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function WorkEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/works/${id}`)
        .then((r) => r.json())
        .then((work: Work) => {
          const imgs = work.images || [];
          const ci = imgs.findIndex((img) => img.src === work.cover);
          setForm({
            type: work.type,
            title: work.title,
            description: work.description,
            cover: work.cover,
            tagsInput: work.tags.join(", "),
            date: work.date,
            location: work.location || "",
            featured: work.featured,
            panoramaUrl: work.panoramaUrl || "",
            images: imgs,
            coverIndex: ci >= 0 ? ci : 0,
          });
          setLoading(false);
        });
    }
  }, [id, isNew]);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const added: AlbumImage[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json() as { url: string; filename: string };
      added.push({ src: data.url, caption: "" });
    }
    setForm((f) => ({ ...f, images: [...f.images, ...added] }));
    setUploading(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json() as { url: string; filename: string };
    if (data.url) {
      set("cover", data.url);
    }
    setUploading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await handleUpload(e.target.files);
    e.target.value = "";
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setForm((f) => {
      const imgs = f.images;
      const oldIdx = imgs.findIndex((img) => img.src === active.id);
      const newIdx = imgs.findIndex((img) => img.src === over.id);
      if (oldIdx === -1 || newIdx === -1) return f;

      const newImages = arrayMove(imgs, oldIdx, newIdx);
      let newCoverIndex = f.coverIndex;
      if (oldIdx === f.coverIndex) {
        newCoverIndex = newIdx;
      } else if (oldIdx < f.coverIndex && newIdx >= f.coverIndex) {
        newCoverIndex = f.coverIndex - 1;
      } else if (oldIdx > f.coverIndex && newIdx <= f.coverIndex) {
        newCoverIndex = f.coverIndex + 1;
      }
      return { ...f, images: newImages, coverIndex: newCoverIndex };
    });
  };

  const handleDeleteImage = (index: number) => {
    setForm((f) => {
      const newImages = f.images.filter((_, i) => i !== index);
      let newCoverIndex = f.coverIndex;
      if (index === f.coverIndex) newCoverIndex = 0;
      else if (index < f.coverIndex) newCoverIndex = f.coverIndex - 1;
      return { ...f, images: newImages, coverIndex: Math.max(0, newCoverIndex) };
    });
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setForm((f) => {
      const newImages = f.images.map((img, i) => (i === index ? { ...img, caption } : img));
      return { ...f, images: newImages };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const computedCover =
      form.type === "album"
        ? form.images[form.coverIndex]?.src || ""
        : form.cover;

    const payload = {
      type: form.type,
      title: form.title,
      description: form.description,
      cover: computedCover,
      tags: form.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      date: form.date,
      location: form.location,
      featured: form.featured,
      panoramaUrl: form.type === "panorama" ? form.panoramaUrl : undefined,
      images: form.type === "album" ? form.images : undefined,
    };

    const url = isNew ? "/api/admin/works" : `/api/admin/works/${id}`;
    const method = isNew ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    router.push("/admin");
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-400">加载中...</div>;
  }

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            {isNew ? "新增作品" : "编辑作品"}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-5">
          <div>
            <label className={labelClass}>作品类型</label>
            <div className="flex gap-4">
              {(["album", "panorama"] as WorkType[]).map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={() => set("type", t)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    {t === "album" ? "图片套图" : "全景漫游"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="作品标题"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>描述</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="作品描述"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>日期</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>地点</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="拍摄地点"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>标签（逗号分隔）</label>
            <input
              type="text"
              value={form.tagsInput}
              onChange={(e) => set("tagsInput", e.target.value)}
              placeholder="风光, 城市, 夜景"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="rounded text-blue-600"
            />
            <label htmlFor="featured" className="text-sm text-gray-700 cursor-pointer">
              置顶展示（首页精选）
            </label>
          </div>
        </div>

        {form.type === "panorama" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800">全景漫游</h2>
            <div>
              <label className={labelClass}>全景 URL</label>
              <input
                type="text"
                value={form.panoramaUrl}
                onChange={(e) => set("panoramaUrl", e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>封面图</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={form.cover}
                  onChange={(e) => set("cover", e.target.value)}
                  placeholder="https://... 或 /works/image.jpg"
                  className={inputClass}
                />
                <label className="shrink-0 px-3 py-2 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  {uploading ? "上传中..." : "上传"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {form.cover && (
                <img
                  src={form.cover}
                  alt="封面预览"
                  className="mt-2 h-24 w-auto rounded border border-gray-200 object-cover"
                />
              )}
            </div>
          </div>
        )}

        {form.type === "album" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">
                图片管理
                {form.images.length > 0 && (
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    {form.images.length} 张
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? "上传中..." : "+ 上传图片"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {form.images.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                暂无图片，点击「上传图片」添加
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={form.images.map((img) => img.src)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {form.images.map((image, index) => (
                      <SortableImageCard
                        key={image.src}
                        image={image}
                        isCover={index === form.coverIndex}
                        onCoverSelect={() => set("coverIndex", index)}
                        onCaptionChange={(caption) => handleCaptionChange(index, caption)}
                        onDelete={() => handleDeleteImage(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
