"use client";

import { useEffect, useState } from "react";

export default function TotalViewsCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/views")
      .then((res) => res.json())
      .then((data) => setTotal(data.total))
      .catch(() => {});
  }, []);

  return (
    <div className="text-center">
      <div className="text-xl font-bold text-foreground tabular-nums">
        {total !== null ? total.toLocaleString("zh-CN") : "—"}
      </div>
      <div className="mt-0.5 text-xs text-muted">浏览</div>
    </div>
  );
}
