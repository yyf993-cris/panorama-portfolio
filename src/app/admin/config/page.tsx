"use client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

interface Social {
  platform: string;
  url: string;
  icon: string;
}

interface ConfigState {
  site: { title: string; description: string; url: string };
  profile: { name: string; avatar: string; bio: string; socials: Social[] };
  heroLogo?: string;
  wechatQr?: string;
}

const DEFAULT_CONFIG: ConfigState = {
  site: { title: "", description: "", url: "" },
  profile: { name: "", avatar: "", bio: "", socials: [] },
  heroLogo: "",
  wechatQr: "",
};

const ICON_OPTIONS = [
  { value: "wechat", label: "微信" },
  { value: "phone", label: "电话" },
];

export default function AdminConfigPage() {
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((data: ConfigState) => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const setSite = (key: keyof ConfigState["site"], value: string) => {
    setConfig((c) => ({ ...c, site: { ...c.site, [key]: value } }));
  };

  const setProfile = (key: keyof Omit<ConfigState["profile"], "socials">, value: string) => {
    setConfig((c) => ({ ...c, profile: { ...c.profile, [key]: value } }));
  };

  const setSocial = (index: number, key: keyof Social, value: string) => {
    setConfig((c) => {
      const socials = c.profile.socials.map((s, i) =>
        i === index ? { ...s, [key]: value } : s
      );
      return { ...c, profile: { ...c.profile, socials } };
    });
  };

  const addSocial = () => {
    setConfig((c) => ({
      ...c,
      profile: {
        ...c.profile,
        socials: [...c.profile.socials, { platform: "", url: "", icon: "mail" }],
      },
    }));
  };

  const removeSocial = (index: number) => {
    setConfig((c) => ({
      ...c,
      profile: {
        ...c.profile,
        socials: c.profile.socials.filter((_, i) => i !== index),
      },
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setConfig((c) => ({ ...c, heroLogo: data.url }));
    }
    setUploading(false);
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setConfig((c) => ({ ...c, wechatQr: data.url }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
        <h1 className="text-xl font-semibold text-gray-900">站点设置</h1>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600">已保存 ✓</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            个人资料
          </h2>

          <div>
            <label className={labelClass}>姓名</label>
            <input
              type="text"
              value={config.profile.name}
              onChange={(e) => setProfile("name", e.target.value)}
              placeholder="你的名字"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>个人简介</label>
            <textarea
              value={config.profile.bio}
              onChange={(e) => setProfile("bio", e.target.value)}
              placeholder="一句话介绍自己..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>头像 URL</label>
            <input
              type="text"
              value={config.profile.avatar}
              onChange={(e) => setProfile("avatar", e.target.value)}
              placeholder="/avatar.jpg 或 https://..."
              className={inputClass}
            />
            {config.profile.avatar && (
              <img
                src={config.profile.avatar}
                alt="头像预览"
                className="mt-2 w-16 h-16 rounded-full object-cover border border-gray-200"
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-sm font-semibold text-gray-800">社交链接</h2>
            <button
              type="button"
              onClick={addSocial}
              className="text-xs px-2.5 py-1 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
            >
              + 添加
            </button>
          </div>

          {config.profile.socials.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">暂无社交链接</p>
          ) : (
            <div className="space-y-3">
              {config.profile.socials.map((social, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={social.icon}
                    onChange={(e) => setSocial(index, "icon", e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white text-gray-700 shrink-0"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={social.platform}
                    onChange={(e) => setSocial(index, "platform", e.target.value)}
                    placeholder="平台名称"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white min-w-0"
                  />
                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => setSocial(index, "url", e.target.value)}
                    placeholder="链接 URL"
                    className="flex-[2] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocial(index)}
                    className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    aria-label="删除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            首页 Logo
          </h2>
          <p className="text-xs text-gray-500">
            支持 JPG / PNG / WebP / GIF（含动图），建议尺寸不超过 640×512
          </p>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={config.heroLogo || ""}
              onChange={(e) => setConfig((c) => ({ ...c, heroLogo: e.target.value }))}
              placeholder="/works/logo.png 或留空隐藏"
              className={inputClass}
            />
            <label className="shrink-0 px-3 py-2 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
              {uploading ? "上传中..." : "上传"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {config.heroLogo && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={config.heroLogo}
                alt="Logo 预览"
                className="max-h-20 w-auto object-contain border border-gray-200 rounded-lg p-1"
              />
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, heroLogo: "" }))}
                className="text-xs text-red-500 hover:text-red-700"
              >
                清除
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            微信二维码
          </h2>
          <p className="text-xs text-gray-500">
            上传微信个人二维码，用户点击微信图标时弹窗展示
          </p>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={config.wechatQr || ""}
              onChange={(e) => setConfig((c) => ({ ...c, wechatQr: e.target.value }))}
              placeholder="/works/wechat-qr.png 或留空"
              className={inputClass}
            />
            <label className="shrink-0 px-3 py-2 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
              {uploading ? "上传中..." : "上传"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleQrUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {config.wechatQr && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={config.wechatQr}
                alt="二维码预览"
                className="max-h-28 w-auto object-contain border border-gray-200 rounded-lg p-1"
              />
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, wechatQr: "" }))}
                className="text-xs text-red-500 hover:text-red-700"
              >
                清除
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            站点信息
          </h2>

          <div>
            <label className={labelClass}>站点标题</label>
            <input
              type="text"
              value={config.site.title}
              onChange={(e) => setSite("title", e.target.value)}
              placeholder="我的作品集"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>站点描述</label>
            <textarea
              value={config.site.description}
              onChange={(e) => setSite("description", e.target.value)}
              placeholder="网站描述，用于 SEO"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
