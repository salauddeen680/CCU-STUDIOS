"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2, Upload, CheckCircle2, X } from "lucide-react";
import { useComics, createComic, deleteComic } from "@/lib/data";
import { ImageUploader } from "./image-uploader";

export function ComicsManager() {
  const { comics = [], loading: dataLoading } = useComics();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form Control Inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("asli");
  const [isSaving, setIsSaving] = useState(false);

  const [coverUrl, setCoverUrl] = useState("");
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [pagesUploading, setPagesUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const pagesInputRef = useRef<HTMLInputElement>(null);

  // Updated Imgbb Loop Pipeline
  const handlePagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPagesUploading(true);
    const fileArray = Array.from(files);
    const tempUrls: string[] = [];
    
    setUploadProgress(`Processing 0/${fileArray.length} pages...`);

    try {
      let count = 0;
      for (const file of fileArray) {
        count++;
        setUploadProgress(`Uploading page ${count}/${fileArray.length}...`);
        
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("https://api.imgbb.com/1/upload?key=316329635816225ced11f24f7cb154d3", {
          method: "POST",
          body: formData,
        });

        const resData = await res.json();

        if (resData.success) {
          tempUrls.push(resData.data.url);
        } else {
          throw new Error(`Failed at page ${count}`);
        }
      }

      setPageUrls((prev) => [...prev, ...tempUrls]);
      setUploadProgress("All pages uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Kuch pages uploads fail ho gaye bhai.");
    } finally {
      setPagesUploading(false);
    }
  };

  const handleSaveComic = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title aur Description dena zaroori hai bhai!");
      return;
    }

    setIsSaving(true);
    try {
      await createComic({
        title,
        description,
        timeline,
        cover: coverUrl || "",
        images: pageUrls,
        ultimate: timeline === "purani"
      });

      setTitle("");
      setDescription("");
      setCoverUrl("");
      setPageUrls([]);
      setUploadProgress("");
      setIsOpen(false);
      alert("Comic Published Successfully! 🎉");
    } catch (err) {
      console.error(err);
      alert("Database error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Comics Manager</h1>
          <p className="text-sm text-zinc-500">{(comics || []).length} comics in the vault</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="h-4 w-4" /> {isOpen ? "Close Creator" : "New Comic"}
        </button>
      </div>

      {isOpen && (
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl space-y-5 max-w-2xl">
          <input 
            type="text" 
            placeholder="Comic Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" 
          />
          <textarea 
            placeholder="Summary lore..." 
            rows={4} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" 
          />
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Select Timeline</label>
            <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-300 focus:outline-none">
              <option value="asli">🟢 Asli Timeline (Real-Time Stories)</option>
              <option value="purani">🟡 Purani Timeline / Backstory (Ultimate Comic)</option>
              <option value="dusri">🔴 Dusri Universe / Fan Fiction</option>
            </select>
          </div>

          <ImageUploader 
            label="Cover Image" 
            folder="covers" 
            onUploadComplete={(url) => setCoverUrl(url)} 
          />
          {coverUrl && (
            <img src={coverUrl} alt="Cover Preview" className="mt-2 h-32 w-24 object-cover rounded-lg border border-zinc-800" />
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Comic pages ({pageUrls.length})</label>
            <input type="file" accept="image/*" multiple ref={pagesInputRef} className="hidden" onChange={handlePagesUpload} />
            <button type="button" onClick={() => pagesInputRef.current?.click()} disabled={pagesUploading} className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-950 p-6 rounded-lg text-xs text-zinc-400">
              {pagesUploading ? <Loader2 className="h-5 w-5 animate-spin text-red-500" /> : `Upload Comic Pages Bulk`}
            </button>
            {pagesUploading && <p className="text-xs text-zinc-500">{uploadProgress}</p>}
            {pageUrls.length > 0 && (
              <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {pageUrls.length} pages ready!</p>
            )}

            {/* 🔥 Naya Preview Grid: Yeh uploaded comic pages ko live dikhayega */}
            {pageUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {pageUrls.map((src, i) => (
                  <div key={i} className="relative group rounded border border-zinc-800 overflow-hidden bg-zinc-950">
                    <img src={src} alt={`Page ${i + 1}`} className="aspect-[3/4] w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 px-1 text-zinc-300 rounded">P. {i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSaveComic} disabled={isSaving || pagesUploading} className="w-full bg-red-600 text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save and Publish"}
          </button>
        </div>
      )}

      <div className="border border-zinc-800 bg-zinc-900/20 rounded-xl p-6">
        <div className="divide-y divide-zinc-800">
          {dataLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-red-600 mx-auto" />
          ) : !comics || comics.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4">No comics found.</p>
          ) : (
            comics.map((comic) => (
              <div key={comic.id} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">{comic.title}</h4>
                  <p className="text-xs text-zinc-500">Pages: {comic.images?.length || 0}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {comic.timeline || "asli"}
                  </span>
                  <button type="button" onClick={async () => { if(confirm("Delete?")) await deleteComic(comic.id) }} className="text-zinc-600 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
