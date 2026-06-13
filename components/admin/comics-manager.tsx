"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2, Upload, CheckCircle2, X, Edit2 } from "lucide-react";
import { useComics, createComic, deleteComic, updateComic } from "@/lib/data";
import { ImageUploader } from "./image-uploader";

export function ComicsManager() {
  const { comics = [], loading: dataLoading } = useComics();
  const [isOpen, setIsOpen] = useState(false);
  const [editingComicId, setEditingComicId] = useState<string | null>(null);
  
  // Creator Form Control Inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("asli");
  const [isSaving, setIsSaving] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [pagesUploading, setPagesUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Editor Form Control Inputs
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTimeline, setEditTimeline] = useState("asli");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editPageUrls, setEditPageUrls] = useState<string[]>([]);
  const [editPagesUploading, setEditPagesUploading] = useState(false);
  const [editUploadProgress, setEditUploadProgress] = useState("");

  const pagesInputRef = useRef<HTMLInputElement>(null);
  const editPagesInputRef = useRef<HTMLInputElement>(null);

  // 📥 Imgbb Bulk Loop Pipeline for Creator
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

  // 📥 Imgbb Bulk Loop Pipeline for Editor
  const handleEditPagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setEditPagesUploading(true);
    const fileArray = Array.from(files);
    const tempUrls: string[] = [];
    setEditUploadProgress(`Processing 0/${fileArray.length} pages...`);

    try {
      let count = 0;
      for (const file of fileArray) {
        count++;
        setEditUploadProgress(`Uploading page ${count}/${fileArray.length}...`);
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
      setEditPageUrls((prev) => [...prev, ...tempUrls]);
      setEditUploadProgress("All pages uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Kuch pages uploads fail ho gaye bhai.");
    } finally {
      setEditPagesUploading(false);
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

  // ✏️ Function to setup editor values when clicking Edit
  const startEditing = (comic: any) => {
    setEditingComicId(comic.id);
    setEditTitle(comic.title || "");
    setEditDescription(comic.description || "");
    setEditTimeline(comic.timeline || "asli");
    setEditCoverUrl(comic.cover || "");
    setEditPageUrls(comic.images || []);
    setEditUploadProgress("");
  };

  // 💾 Update API Handler
  const handleUpdateComic = async () => {
    if (!editingComicId) return;
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title aur Description dena zaroori hai bhai!");
      return;
    }

    setIsSaving(true);
    try {
      await updateComic(editingComicId, {
        title: editTitle,
        description: editDescription,
        timeline: editTimeline,
        cover: editCoverUrl,
        images: editPageUrls,
        ultimate: editTimeline === "purani"
      });
      setEditingComicId(null);
      alert("Comic Updated Successfully! 🔄");
    } catch (err) {
      console.error(err);
      alert("Database update crash standard issue.");
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
          onClick={() => { setIsOpen(!isOpen); setEditingComicId(null); }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="h-4 w-4" /> {isOpen ? "Close Creator" : "New Comic"}
        </button>
      </div>

      {/* CREATOR PANEL */}
      {isOpen && (
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl space-y-5 max-w-2xl">
          <input type="text" placeholder="Comic Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
          <textarea placeholder="Summary lore..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" />
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Select Timeline</label>
            <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-300 focus:outline-none">
              <option value="asli">🟢 Asli Timeline (Real-Time Stories)</option>
              <option value="purani">🟡 Purani Timeline / Backstory (Ultimate Comic)</option>
              <option value="dusri">🔴 Dusri Universe / Fan Fiction</option>
            </select>
          </div>

          <ImageUploader label="Cover Image" folder="covers" onUploadComplete={(url) => setCoverUrl(url)} />
          {coverUrl && <img src={coverUrl} alt="Cover Preview" className="mt-2 h-32 w-24 object-cover rounded-lg border border-zinc-800" />}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Comic pages ({pageUrls.length})</label>
            <input type="file" accept="image/*" multiple ref={pagesInputRef} className="hidden" onChange={handlePagesUpload} />
            <button type="button" onClick={() => pagesInputRef.current?.click()} disabled={pagesUploading} className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-950 p-6 rounded-lg text-xs text-zinc-400">
              {pagesUploading ? <Loader2 className="h-5 w-5 animate-spin text-red-500" /> : `Upload Comic Pages Bulk`}
            </button>
            {pagesUploading && <p className="text-xs text-zinc-500">{uploadProgress}</p>}
            {pageUrls.length > 0 && <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {pageUrls.length} pages ready!</p>}

            {pageUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {pageUrls.map((src, i) => (
                  <div key={i} className="relative group rounded border border-zinc-800 overflow-hidden bg-zinc-950">
                    <img src={src} alt={`Page ${i + 1}`} className="aspect-[3/4] w-full object-cover" />
                    <button type="button" onClick={() => setPageUrls((prev) => prev.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-zinc-400 hover:text-white transition-colors"><X className="h-3 w-3" /></button>
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

      {/* VAULT LIST WITH INTEGRATED DYNAMIC EDITOR */}
      <div className="border border-zinc-800 bg-zinc-900/20 rounded-xl p-6">
        <div className="divide-y divide-zinc-800">
          {dataLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-red-600 mx-auto" />
          ) : !comics || comics.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4">No comics found.</p>
          ) : (
            comics.map((comic) => (
              <div key={comic.id} className="flex flex-col py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-white">{comic.title}</h4>
                    <p className="text-xs text-zinc-500">Pages: {comic.images?.length || 0}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {comic.timeline || "asli"}
                    </span>
                    
                    <button 
                      type="button" 
                      onClick={() => { setIsOpen(false); editingComicId === comic.id ? setEditingComicId(null) : startEditing(comic); }} 
                      className="text-zinc-400 hover:text-blue-500 transition-colors"
                      title="Edit Comic"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button type="button" onClick={async () => { if(confirm("Delete?")) await deleteComic(comic.id) }} className="text-zinc-600 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 🛠️ LIVE COMIC EDITOR DROPDOWN FORM */}
                {editingComicId === comic.id && (
                  <div className="mt-4 border border-zinc-800 bg-zinc-950 p-5 rounded-lg space-y-4 max-w-xl self-start w-full">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Edit Comic Parameters</h3>
                      <button type="button" onClick={() => setEditingComicId(null)} className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
                    </div>

                    <input type="text" placeholder="Edit Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                    <textarea placeholder="Edit Summary..." rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none resize-none" />
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase">Change Timeline</label>
                      <select value={editTimeline} onChange={(e) => setEditTimeline(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none">
                        <option value="asli">🟢 Asli Timeline</option>
                        <option value="purani">🟡 Purani Timeline (Ultimate)</option>
                        <option value="dusri">🔴 Dusri Universe</option>
                      </select>
                    </div>

                    <ImageUploader label="Change Cover Image" folder="covers" onUploadComplete={(url) => setEditCoverUrl(url)} />
                    {editCoverUrl && <img src={editCoverUrl} alt="Cover Preview" className="mt-1 h-24 w-18 object-cover rounded border border-zinc-800" />}

                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase">Comic Pages Vault ({editPageUrls.length})</label>
                      <input type="file" accept="image/*" multiple ref={editPagesInputRef} className="hidden" onChange={handleEditPagesUpload} />
                      <button type="button" onClick={() => editPagesInputRef.current?.click()} disabled={editPagesUploading} className="w-full py-2 flex items-center justify-center border border-dashed border-zinc-800 bg-zinc-900 rounded text-xs text-zinc-400">
                        {editPagesUploading ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : `Add More Pages Bulk`}
                      </button>
                      {editPagesUploading && <p className="text-[11px] text-zinc-500">{editUploadProgress}</p>}
                      
                      {editPageUrls.length > 0 && (
                        <div className="grid grid-cols-5 gap-1.5 pt-2">
                          {editPageUrls.map((src, idx) => (
                            <div key={idx} className="relative group rounded border border-zinc-800 overflow-hidden bg-zinc-900">
                              <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
                              <button type="button" onClick={() => setEditPageUrls((prev) => prev.filter((_, i) => i !== idx))} className="absolute right-0.5 top-0.5 rounded-full bg-black/80 p-0.5 text-zinc-400 hover:text-white"><X className="h-2.5 w-2.5" /></button>
                              <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/60 px-0.5 text-zinc-400 rounded">P. {idx + 1}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button onClick={handleUpdateComic} disabled={isSaving || editPagesUploading} className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
