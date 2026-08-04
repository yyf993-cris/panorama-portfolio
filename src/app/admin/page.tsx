"use client";
import { useEffect, useState, useCallback } from "react";
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
import type { Work } from "@/lib/types";

export const dynamic = "force-dynamic";

function SortableRow({
  work,
  onDelete,
}: {
  work: Work;
  onDelete: (id: string, title: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: work.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
    >
      <td className="px-2 py-3 w-8">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors touch-none"
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
      </td>
      <td className="px-4 py-3">
        {work.cover ? (
          <img
            src={work.cover}
            alt={work.title}
            className="w-14 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-14 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">
            无封面
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{work.title}</div>
        {work.featured && (
          <span className="inline-block mt-0.5 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
            置顶
          </span>
        )}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            work.type === "panorama"
              ? "bg-violet-100 text-violet-700"
              : "bg-sky-100 text-sky-700"
          }`}
        >
          {work.type === "panorama" ? "全景" : "套图"}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {work.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">
              {tag}
            </span>
          ))}
          {work.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{work.tags.length - 3}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{work.date}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/works/${work.id}`}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
          >
            编辑
          </Link>
          <button
            onClick={() => onDelete(work.id, work.title)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
          >
            删除
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor));

  const loadWorks = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/works");
    const data = await res.json() as Work[];
    setWorks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`确认删除「${title}」？此操作不可恢复。`)) return;
    await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
    loadWorks();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = works.findIndex((w) => w.id === active.id);
    const newIdx = works.findIndex((w) => w.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(works, oldIdx, newIdx);
    setWorks(reordered);

    await fetch("/api/admin/works", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((w) => w.id) }),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">作品管理</h1>
        <Link
          href="/admin/works/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          新增作品
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">加载中...</div>
      ) : works.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>暂无作品</p>
          <p className="mt-1 text-sm">点击「新增作品」开始创建</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-8"></th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-16">封面</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">标题</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">类型</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">标签</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">日期</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">操作</th>
              </tr>
            </thead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={works.map((w) => w.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {works.map((work) => (
                    <SortableRow key={work.id} work={work} onDelete={handleDelete} />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      )}
    </div>
  );
}
