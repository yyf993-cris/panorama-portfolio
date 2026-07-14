import type { PanoramaWork } from "./types";

/**
 * 作品数据 - 新增作品只需在此数组中添加一项
 *
 * panoramaUrl 支持：
 *   - 炫云链接（iframe 嵌入，保留全部交互）
 *   - 720云链接（iframe 嵌入）
 *   - equirectangular 全景图 URL（Pannellum 本地渲染）
 */
export const works: PanoramaWork[] = [
  {
    id: "1",
    title: "石榴派花园 5-1-702",
    description: "现代简约风格室内全景，温馨舒适的居住空间。",
    cover: "/works/pano-cover-1.png",
    panoramaUrl:
      "https://vr.shinewonder.com/pano/page/publik/pklimit?inf=MMFBFEBAAMGGBFEFL",
    tags: ["室内", "住宅"],
    date: "2024-12-01",
    location: "石榴派花园",
    views: 128,
    featured: true,
  },
];
