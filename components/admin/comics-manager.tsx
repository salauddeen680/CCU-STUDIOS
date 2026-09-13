"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2, Upload, CheckCircle2, X, Edit2, Lock, BookOpen, Clock, FileText } from "lucide-react";
import { useComics, deleteComic } from "@/lib/data";
import { ImageUploader } from "./image-uploader";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// 🛡️ Auto-Slug Utility Function
const generateCleanSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// 🔥 BULLETPROOF NATURAL SORTING FOR IMAGES
const sortFilesNaturally = (files: FileList | File[]): File[] => {
  const fileArray = Array.from(files);
  return fileArray.sort((a, b) => {
    const getPageNum = (filename: string) => {
      const cleanName = filename.replace(/\.[^/.]+$/, "");
      const matchPageWord = cleanName.match(/(?:page|p)[^\d]*(\d+)/i);
      if (matchPageWord) return parseInt(matchPageWord[1], 10);

      const allNumbers = cleanName.match(/\d+/g);
      if (allNumbers) {
        for (const numStr of allNumbers) {
          const num = parseInt(numStr, 10);
          if (num < 1000) return num;
        }
        return parseInt(allNumbers[allNumbers.length - 1], 10) || 0;
      }
      return 0;
    };

    return getPageNum(a.name) - getPageNum(b.name);
  });
};

// 📄 PDF TO IMAGES CONVERTER (Browser-side dynamic PDF.js loader)
const convertPdfToImages = async (pdfFile: File, onProgress: (msg: string) => void): Promise<File[]> => {
  onProgress("Loading PDF parser engine...");
  if (!(window as any).pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(true);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const pdfjsLib = (window as any).pdfjsLib;
  const arrayBuffer = await pdfFile.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const imageFiles: File[] = [];

  for (let i = 1; i <= numPages; i++) {
    onProgress(`Extracting page ${i} of ${numPages} from PDF...`);
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 }); // High quality render
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
    const pageFile = new File([blob], `page_${i}.png`, { type: "image/png" });
    imageFiles.push(pageFile);
  }

  return imageFiles;
};

export function ComicsManager() {
  const { comics = [], loading: dataLoading } = useComics();
  const [isOpen, setIsOpen] = useState(false);
  const [editingComicId, setEditingComicId] = useState<string | null>(null);
  
  // 📝 Creator Form Control Inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("asli");
  const [isSaving, setIsSaving] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [pagesUploading, setPagesUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  
  // 👑 Access & Status Controls
  const [accessType, setAccessType] = useState<"free" | "teaser_9" | "full_paid">("free");
  const [publishStatus, setPublishStatus] = useState("published"); 

  // 📝 Editor Form Control Inputs
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTimeline, setEditTimeline] = useState("asli");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editPageUrls, setEditPageUrls] = useState<string[]>([]);
  const [editPagesUploading, setEditPagesUploading] = useState(false);
  const [editUploadProgress, setEditUploadProgress] = useState("");
  
  // 👑 Editor Access & Status Controls
  const [editAccessType, setEditAccessType] = useState<"free" | "teaser_9" | "full_paid">("free");
  const [editPublishStatus, setEditPublishStatus] = useState("published");

  const pagesInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const editPagesInputRef = useRef<HTMLInputElement>(null);

  const getAccessValues = (type: "free" | "teaser_9" | "full_paid") => {
    switch (type) {
      case "teaser_9":
        return { isPaid: true, freePages: 9 };
      case "full_paid":
        return { isPaid: true, freePages: 0 };
      case "free":
      default:
        return { isPaid: false, freePages: 0 };
    }
  };

  const detectAccessType = (comic: any): "free" | "teaser_9" | "full_paid" => {
    const isPremium = comic.isPaid === true || comic.paid === true;
    if (!isPremium) return "free";
    if (comic.freePages === 9) return "teaser_9";
    return "full_paid";
  };

  // 📥 Bulk Upload Images with Safe Numerical Sorting
  const handlePagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPagesUploading(true);
    const sortedFiles = sortFilesNaturally(files);
    const tempUrls: string[] = [];
    setUploadProgress(`Processing 0/${sortedFiles.length} pages...`);

    try {
      let count = 0;
      for (const file of sortedFiles) {
        count++;
        setUploadProgress(`Uploading page ${count}/${sortedFiles.length}...`);
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
      setUploadProgress("All pages uploaded successfully in exact order!");
    } catch (err) {
      console.error(err);
      alert("Kuch pages uploads fail ho gaye bhai.");
    } finally {
      setPagesUploading(false);
    }
  };

  // 📄 Handle Direct PDF Upload & Auto-Extraction
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPagesUploading(true);
    try {
      // Convert PDF pages to structured image files automatically in correct 1,2,3 order
      const extractedFiles = await convertPdfToImages(file, (msg) => setUploadProgress(msg));
      
      const tempUrls: string[] = [];
      let count = 0;
      for (const imgFile of extractedFiles) {
        count++;
        setUploadProgress(`Uploading PDF Page ${count}/${extractedFiles.length}...`);
        const formData = new FormData();
        formData.append("image", imgFile);

        const res = await fetch("https://api.imgbb.com/1/upload?key=316329635816225ced11f24f7cb154d3", {
          method: "POST",
          body: formData,
        });
        const resData = await res.json();
        if (resData.success) {
          tempUrls.push(resData.data.url);
        } else {
          throw new Error(`Failed at PDF page ${count}`);
        }
      }

      setPageUrls((prev) => [...prev, ...tempUrls]);
      setUploadProgress("PDF successfully converted & uploaded in perfect sequence!");
    } catch (err) {
      console.error(err);
      alert("PDF processing ya upload mein error aa gaya bhai.");
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
      const { isPaid, freePages } = getAccessValues(accessType);
      const generatedSlug = generateCleanSlug(title);

      const comicRef = doc(db, "comics", generatedSlug);
      await setDoc(comicRef, {
        id: generatedSlug,
        title,
        slug: generatedSlug,
        description,
        timeline,
        cover: coverUrl || "",
        images: pageUrls,
        ultimate: timeline === "purani" || timeline === "dusri",
        isPaid: isPaid,
        paid: isPaid,
        freePages,
        publishStatus,
        createdAt: serverTimestamp(),
        likes: 0
      });

      setTitle(""); setDescription(""); setCoverUrl(""); setPageUrls([]);
      setUploadProgress(""); setAccessType("free"); setPublishStatus("published");
      setIsOpen(false);
      alert("Comic Setup Successfully with Clean URL! 🎉");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Database error.");
      setIsSaving(false);
    } 
  };

  const startEditing = (comic: any) => {
    setEditingComicId(comic.id);
    setEditTitle(comic.title || "");
    setEditDescription(comic.description || "");
    setEditTimeline(comic.timeline || "asli");
    setEditCoverUrl(comic.cover || "");
    setEditPageUrls(comic.images || []);
    setEditUploadProgress("");
    setEditAccessType(detectAccessType(comic)); 
    setEditPublishStatus(comic.publishStatus || "published"); 
  };

  const handleUpdateComic = async () => {
    if (!editingComicId) return;
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title aur Description dena zaroori hai bhai!");
      return;
    }

    setIsSaving(true);
    try {
      const { isPaid, freePages } = getAccessValues(editAccessType);
      const updatedSlug = generateCleanSlug(editTitle);

      const comicRef = doc(db, "comics", editingComicId);
      await updateDoc(comicRef, {
        title: editTitle,
        slug: updatedSlug,
        description: editDescription,
        timeline: editTimeline,
        cover: editCoverUrl,
        images: editPageUrls,
        ultimate: editTimeline === "purani" || editTimeline === "dusri",
        isPaid: isPaid,
        paid: isPaid,
        freePages,
        publishStatus: editPublishStatus,
        updatedAt: serverTimestamp(),
      });

      setEditingComicId(null);
      alert("Comic Updated Successfully! 🔄");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Database update crash standard issue.");
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

      {isOpen && (
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl space-y-5 max-w-2xl">
          <input type="text" placeholder="Comic Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
          <textarea placeholder="Summary lore..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" />
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Select Timeline</label>
            <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-300 focus:outline-none">
              <option value="asli">🟢 Asli Timeline (Real-Time Stories)</option>
              <option value="purani">🟡 Purani Timeline / Backstory (Ultimate Comic)</option>
              <option value="dusri">🔴 Dusri Universe / Ultimate Comic</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Release Status</label>
              <select value={publishStatus} onChange={(e) => setPublishStatus(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none cursor-pointer">
                <option value="published">Live Now (Published)</option>
                <option value="upcoming">Coming Soon (Upcoming)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Content Access</label>
              <select 
                value={accessType} 
                onChange={(e) => setAccessType(e.target.value as any)} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="free">📖 Free to Read</option>
                <option value="teaser_9">🔒 9 Pages Free (Paid)</option>
                <option value="full_paid">🔒 Full Paid (0 Pages Free)</option>
              </select>
            </div>
          </div>

          <ImageUploader label="Cover Image" folder="covers" onUploadComplete={(url) => setCoverUrl(url)} />
          {coverUrl && <img src={coverUrl} alt="Cover Preview" className="mt-2 h-32 w-24 object-cover rounded-lg border border-zinc-800" />}

          {/* 📂 DUAL UPLOAD OPTIONS: Images or PDF */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Comic Pages Upload ({pageUrls.length} ready)</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Gallery Images */}
              <input type="file" accept="image/*" multiple ref={pagesInputRef} className="hidden" onChange={handlePagesUpload} />
              <button type="button" onClick={() => pagesInputRef.current?.click()} disabled={pagesUploading} className="flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-950 hover:bg-zinc-900 p-3 rounded-lg text-xs font-bold text-white transition-all">
                <Upload className="h-4 w-4 text-red-500" /> Select Gallery Images
              </button>

              {/* Option 2: Direct PDF Upload */}
              <input type="file" accept="application/pdf" ref={pdfInputRef} className="hidden" onChange={handlePdfUpload} />
              <button type="button" onClick={() => pdfInputRef.current?.click()} disabled={pagesUploading} className="flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-950 hover:bg-zinc-900 p-3 rounded-lg text-xs font-bold text-white transition-all">
                <FileText className="h-4 w-4 text-blue-500" /> Upload PDF Chapter (Auto)
              </button>
            </div>

            {pagesUploading && <p className="text-xs text-yellow-500 animate-pulse font-medium">{uploadProgress}</p>}
            {pageUrls.length > 0 && <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {pageUrls.length} pages structured and ready in sequence!</p>}
          </div>

          <button onClick={handleSaveComic} disabled={isSaving || pagesUploading} className="w-full bg-red-600 text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-700">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Settings"}
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
              <div key={comic.id} className="flex flex-col py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {(comic.isPaid || comic.paid) && <Lock className="h-3 w-3 text-red-500" title="Premium Comic" />}
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {comic.title} 
                        {comic.publishStatus === "upcoming" && (
                          <span className="text-[9px] bg-blue-900/30 text-blue-400 border border-blue-900/50 px-1.5 py-0.5 rounded uppercase font-bold">Upcoming</span>
                        )}
                      </h4>
                      <p className="text-xs text-zinc-500">Pages: {comic.images?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {comic.timeline || "asli"}
                    </span>
                    <button type="button" onClick={() => { setIsOpen(false); editingComicId === comic.id ? setEditingComicId(null) : startEditing(comic); }} className="text-zinc-400 hover:text-blue-500 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={async () => { if(confirm("Delete?")) await deleteComic(comic.id); window.location.reload(); }} className="text-zinc-600 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {editingComicId === comic.id && (
                  <div className="mt-4 border border-zinc-800 bg-zinc-950 p-5 rounded-lg space-y-4 max-w-xl self-start w-full">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Edit Comic Parameters</h3>
                      <button type="button" onClick={() => setEditingComicId(null)} className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
                    </div>

                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white" />
                    <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white" />
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase">Select Timeline</label>
                      <select value={editTimeline} onChange={(e) => setEditTimeline(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300">
                        <option value="asli">🟢 Asli Timeline</option>
                        <option value="purani">🟡 Purani Timeline / Backstory</option>
                        <option value="dusri">🔴 Dusri Universe</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Release Status</label>
                        <select value={editPublishStatus} onChange={(e) => setEditPublishStatus(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300">
                          <option value="published">Live Now</option>
                          <option value="upcoming">Coming Soon</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-zinc-500 uppercase">Content Access</label>
                        <select 
                          value={editAccessType} 
                          onChange={(e) => setEditAccessType(e.target.value as any)} 
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300"
                        >
                          <option value="free">Free to Read</option>
                          <option value="teaser_9">9 Pages Free (Paid)</option>
                          <option value="full_paid">Full Paid</option>
                        </select>
                      </div>
                    </div>

                    <button onClick={handleUpdateComic} disabled={isSaving} className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700">
                      {isSaving ? "Saving..." : "Save Changes"}
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
