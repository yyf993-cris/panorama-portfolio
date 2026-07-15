"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ workId }: { workId: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${workId}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => {});
  }, [workId]);

  if (views === null) return null;

  return (
    <div>
      <dt className="text-xs text-muted">浏览量</dt>
      <dd className="mt-0.5 text-sm text-foreground">{views.toLocaleString("zh-CN")}</dd>
    </div>
  );
}
