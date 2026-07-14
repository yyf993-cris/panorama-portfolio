import { Client } from "@notionhq/client";
import type { Work, NotionWorkProperties } from "./types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

/**
 * 从 Notion 数据库获取所有全景作品
 * 按日期倒序排列，精选作品优先
 */
export async function getWorks(): Promise<Work[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATABASE_ID,
    sorts: [
      { property: "Featured", direction: "descending" },
      { property: "Date", direction: "descending" },
    ],
  });

  return response.results.map((page) => {
    const props = (page as unknown as { properties: NotionWorkProperties })
      .properties;

    const coverFile = props.Cover?.files?.[0];
    const coverUrl =
      coverFile?.file?.url || coverFile?.external?.url || "/placeholder.jpg";

    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || "Untitled",
      description: props.Description?.rich_text?.[0]?.plain_text || "",
      cover: coverUrl,
      type: props.PanoramaUrl?.url ? "panorama" : "album",
      panoramaUrl: props.PanoramaUrl?.url || undefined,
      tags: props.Tags?.multi_select?.map((t) => t.name) || [],
      date: props.Date?.date?.start || "",
      location: props.Location?.rich_text?.[0]?.plain_text || "",
      views: props.Views?.number || 0,
      featured: props.Featured?.checkbox || false,
    } as Work;
  });
}

/**
 * 根据 ID 获取单个作品详情
 */
export async function getWorkById(
  id: string
): Promise<Work | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as unknown as { properties: NotionWorkProperties })
      .properties;

    const coverFile = props.Cover?.files?.[0];
    const coverUrl =
      coverFile?.file?.url || coverFile?.external?.url || "/placeholder.jpg";

    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || "Untitled",
      description: props.Description?.rich_text?.[0]?.plain_text || "",
      cover: coverUrl,
      type: props.PanoramaUrl?.url ? "panorama" : "album",
      panoramaUrl: props.PanoramaUrl?.url || undefined,
      tags: props.Tags?.multi_select?.map((t) => t.name) || [],
      date: props.Date?.date?.start || "",
      location: props.Location?.rich_text?.[0]?.plain_text || "",
      views: props.Views?.number || 0,
      featured: props.Featured?.checkbox || false,
    } as Work;
  } catch {
    return null;
  }
}
