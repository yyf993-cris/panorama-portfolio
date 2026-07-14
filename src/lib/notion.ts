import { Client } from "@notionhq/client";
import type { PanoramaWork, NotionWorkProperties } from "./types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

/**
 * 从 Notion 数据库获取所有全景作品
 * 按日期倒序排列，精选作品优先
 */
export async function getWorks(): Promise<PanoramaWork[]> {
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
      panoramaUrl: props.PanoramaUrl?.url || "",
      tags: props.Tags?.multi_select?.map((t) => t.name) || [],
      date: props.Date?.date?.start || "",
      location: props.Location?.rich_text?.[0]?.plain_text || "",
      views: props.Views?.number || 0,
      featured: props.Featured?.checkbox || false,
    };
  });
}

/**
 * 根据 ID 获取单个作品详情
 */
export async function getWorkById(
  id: string
): Promise<PanoramaWork | null> {
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
      panoramaUrl: props.PanoramaUrl?.url || "",
      tags: props.Tags?.multi_select?.map((t) => t.name) || [],
      date: props.Date?.date?.start || "",
      location: props.Location?.rich_text?.[0]?.plain_text || "",
      views: props.Views?.number || 0,
      featured: props.Featured?.checkbox || false,
    };
  } catch {
    return null;
  }
}
