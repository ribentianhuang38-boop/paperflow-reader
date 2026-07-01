'use client';

import React, { useState, useRef, useCallback } from 'react';
import { MdArrowBack, MdAutoStories, MdLock } from 'react-icons/md';

export default function ExplorePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = useState('https://arxiv.org');
  const [inputUrl, setInputUrl] = useState('https://arxiv.org');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedArticle, setExtractedArticle] = useState<any>(null);

  const handleNavigate = useCallback((targetUrl: string) => {
    let finalUrl = targetUrl.trim();
    if (!finalUrl) return;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = `https://${finalUrl}`;
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
      }
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setIsLoading(true);
  }, []);

  const handleExtract = useCallback(async () => {
    if (!iframeRef.current) return;
    setIsExtracting(true);

    try {
      // Inject Readability.js and extract
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        alert('Cannot access page content (cross-origin). Navigate to the page first.');
        setIsExtracting(false);
        return;
      }

      const win = iframe.contentWindow as any;
      if (win && typeof win.Readability !== 'undefined') {
        const docClone = iframeDoc.cloneNode(true);
        const article = new win.Readability(docClone).parse();
        if (article) {
          setExtractedArticle(article);
        }
      } else {
        const text = iframeDoc.body?.innerText || '';
        if (text.length > 100) {
          setExtractedArticle({
            title: iframeDoc.title || 'Extracted Article',
            textContent: text,
            content: iframeDoc.body?.innerHTML || '',
          });
        }
      }
    } catch (e) {
      console.error('Extraction failed:', e);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* URL Bar */}
      <div className="flex items-center gap-2 p-2 bg-base-100 border-b border-base-300">
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={() => iframeRef.current?.contentWindow?.history.back()}
        >
          <MdArrowBack size={18} />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-base-200 rounded-lg px-3 py-1.5">
          <MdLock size={14} className="text-base-content/40" />
          <input
            type="text"
            className="flex-1 bg-transparent text-sm outline-none"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate(inputUrl)}
            placeholder="Search or enter URL"
          />
        </div>
        <button
          className="btn btn-primary btn-sm gap-1"
          onClick={handleExtract}
          disabled={isExtracting}
        >
          <MdAutoStories size={16} />
          {isExtracting ? '...' : 'Read'}
        </button>
      </div>

      {/* WebView */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 z-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {/* Extracted Article Preview */}
      {extractedArticle && (
        <div className="absolute bottom-16 left-4 right-4 bg-base-100 rounded-xl shadow-xl border border-base-300 p-4 max-h-60 overflow-auto z-20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{extractedArticle.title}</h3>
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => setExtractedArticle(null)}
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-base-content/60 line-clamp-3">
            {extractedArticle.textContent?.substring(0, 200)}...
          </p>
          <div className="mt-2 text-xs text-success">
            ✓ Article extracted successfully
          </div>
        </div>
      )}
    </div>
  );
}
