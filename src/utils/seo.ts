import { useEffect } from "react";

export interface SEOMeta {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  structuredData,
}: SEOMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    const setMeta = (nameOrProp: string, content: string, isProp = false) => {
      const attr = isProp ? "property" : "name";
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${nameOrProp}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, nameOrProp);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
      setMeta("twitter:description", description);
    }
    if (title) {
      setMeta("og:title", title, true);
      setMeta("twitter:title", title);
    }
    if (keywords) setMeta("keywords", keywords);

    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    let sdScript: HTMLScriptElement | null = null;
    if (structuredData) {
      sdScript = document.createElement("script");
      sdScript.type = "application/ld+json";
      sdScript.setAttribute("data-dynamic-seo", "true");
      sdScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(sdScript);
    }

    return () => {
      document.title = prevTitle;
      sdScript?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, keywords, canonical]);
}
