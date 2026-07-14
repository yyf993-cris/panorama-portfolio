export interface DesignWork {
  id: string;
  src: string;
  title: string;
  tags: string[];
}

export const designWorks: DesignWork[] = [
  {
    id: "d1",
    src: "/works/design-1.jpg",
    title: "现代浴室空间",
    tags: ["卫浴", "现代简约"],
  },
  {
    id: "d2",
    src: "/works/design-2.jpg",
    title: "简约卧室设计",
    tags: ["卧室", "现代简约"],
  },
  {
    id: "d3",
    src: "/works/design-3.jpg",
    title: "主卧空间",
    tags: ["卧室", "现代简约"],
  },
  {
    id: "d4",
    src: "/works/design-4.jpg",
    title: "开放式厨房",
    tags: ["厨房", "开放式"],
  },
  {
    id: "d5",
    src: "/works/design-5.jpg",
    title: "客餐厅一体",
    tags: ["客厅", "餐厅"],
  },
  {
    id: "d6",
    src: "/works/design-6.jpg",
    title: "起居室设计",
    tags: ["客厅", "现代简约"],
  },
  {
    id: "d7",
    src: "/works/design-7.jpg",
    title: "开放式起居空间",
    tags: ["客厅", "开放式"],
  },
  {
    id: "d8",
    src: "/works/design-8.jpg",
    title: "餐厅空间",
    tags: ["餐厅", "现代简约"],
  },
  {
    id: "d9",
    src: "/works/design-9.jpg",
    title: "多功能空间",
    tags: ["客厅", "现代简约"],
  },
];
