"use client"

import { useState, useRef } from "react"
import { Upload, Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react"
import { useComics, createComic, deleteComic } from "@/lib/data"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage" // ⚡ Memory leak aur freezing rokne ke liye simple uploadBytes use kiya hai
import { storage } from "@/lib/firebase"
import type { Comic } from "@/lib/types"

export function ComicsManager() {
  const { comics = [], loading: dataLoading } = useComics()
  const [isOpen, setIsOpen] = useState(false)
  
  // Form States
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeline, setTimeline] = useState("asli")
  const [isSaving, setIsSaving] = useState(false)

  // Upload Tracking States
  const [coverUrl, setCoverUrl] = useState("")
  const [pageUrls, setPageUrls] = useState<string[]>([])
  const [coverUploading, setCoverUploading] = useState(false)
  const [pagesUploading, setPagesUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  const coverInputRef = useRef<HTMLInputElement>(null)
  const pagesInputRef = useRef<HTMLInputElement>(null)

  // 🎯 1. COVER IMAGE UPLOAD
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverUploading(true)
    const storageRef = ref(storage, `covers/${Date.now()}_${file.name}`)
    
    try {
      const snapshot = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(snapshot.ref)
      setCoverUrl(url)
    } catch (err) {
      console.error("Cover Upload Error:", err)
      alert("Cover upload fail ho gaya.")
    } finally {
      setCoverUploading(false)
    }
  }

  // 🚀 2. BULK COMIC PAGES UPLOAD (For-Of Loop Safety - No More Mobile Freeze!)
  const handlePagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setPagesUploading(true)
    const fileArray = Array.from(files)
    const tempUrls: string[] = []
    
    setUploadProgress(`Processing 0/${fileArray.length} pages...`)

    try {
      // 🛡️ CRASH FIX: Promise.all hata kar simple sequential loop banaya hai.
      // Mobile browsers ek saath 21 heavy uploads ke parallel threads nahi jhel paate aur crash ho jaate hain.
      // Yeh loop ek-ek karke fast pipeline mein safely upload karega bina RAM block kiye.
      let count = 0
      for (const file of fileArray) {
        count++
        setUploadProgress(`Uploading page ${count}/${fileArray.length}...`)
        
        const storageRef = ref(storage, `pages/${Date.now()}_idx_${count}_${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        const url = await getDownloadURL(snapshot.ref)
        tempUrls.push(url)
      }

      setPageUrls((prev) => [...prev, ...tempUrls])
      setUploadProgress("All pages uploaded successfully!")
    } catch (err) {
      console.error("Bulk Pages Upload Error:", err)
      alert("Kuch pages fail ho gaye. Network check karein.")
    } finally {
      setPagesUploading(false)
    }
  }

  // 💾 3. SAVE FINAL COMIC NODE TO FIRESTORE
  const handleSaveComic = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title aur Description daalna zaroori hai bhai!")
      return
    }

    setIsSaving(true)
    try {
      await createComic({
        title,
        description,
        timeline,
        cover: coverUrl || "",
        images: pageUrls,
        ultimate: timeline === "purani"
      })

      setTitle("")
      setDescription("")
      setCoverUrl("")
      setPageUrls([])
      setUploadProgress("")
      setIsOpen(false)
      alert("Comic Successfully Vault Mein Save Ho Gayi Hai! 🎉")
    } catch (err) {
      console.error("Save Comic Error:", err)
      alert("Database error aaya.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
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

      {/* DYNAMIC CREATOR FORM MODAL OVERLAY SHEET */}
      {isOpen && (
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl space-y-5 max-w-2xl">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Create Comic</h2>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Comic Title (e.g. Zenith: the divine shadow 1)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-600" 
            />
            
            <textarea 
              placeholder="Write descriptive cosmic lore summary..." 
              rows={4} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 resize-none" 
            />

            {/* TIMELINE DROPDOWN SELECTION */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Select Comic Timeline / Universe</label>
              <select 
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-red-600"
              >
                <option value="asli">🟢 Asli Timeline (Real-Time Stories)</option>
                <option value="purani">🟡 Purani Timeline / Backstory (Ultimate Comic)</option>
                <option value="dusri">🔴 Dusri Universe / Fan Fiction</option>
              </select>
            </div>

            {/* COVER IMAGE INPUT COMPONENT */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Cover Image</label>
              <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={handleCoverUpload} />
              <button 
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-red-600/40 bg-zinc-950 p-6 rounded-lg group transition-all"
              >
                {coverUploading ? (
                  <Loader2 className="h-6 w-6 text-red-500 animate-spin mb-1" />
                ) : (
                  <Upload className="h-6 w-6 text-zinc-600 group-hover:text-red-500 mb-1" />
                )}
                <span className="text-xs text-zinc-400">{coverUploading ? "Uploading cover..." : "Upload cover"}</span>
              </button>
              {coverUrl && <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Cover attached successfully!</p>}
            </div>

            {/* BULK COMIC PAGES INPUT COMPONENT */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Comic pages ({pageUrls.length})</label>
              <input type="file" accept="image/*" multiple ref={pagesInputRef} className="hidden" onChange={handlePagesUpload} />
              <button 
                type="button"
                onClick={() => pagesInputRef.current?.click()}
                disabled={pagesUploading}
                className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-red-600/40 bg-zinc-950 p-6 rounded-lg group transition-all"
              >
                {pagesUploading ? (
                  <Loader2 className="h-6 w-6 text-red-500 animate-spin mb-1" />
                ) : (
                  <Upload className="h-6 w-6 text-zinc-600 group-hover:text-red-500 mb-1" />
                )}
                <span className="text-xs text-zinc-400">{pagesUploading ? uploadProgress : "Upload comic pages (Bulk 15-25 pages)"}</span>
              </button>
              {pageUrls.length > 0 && <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {pageUrls.length} pages queued in temporary cloud grid!</p>}
            </div>

            {/* ACTION SAVE CONTROLLER BUTTON */}
            <button 
              type="button"
              onClick={handleSaveComic}
              disabled={isSaving || coverUploading || pagesUploading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white text-xs font-bold py-3 rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving Comic Core Node...
                </>
              ) : (
                "Save and Publish Comic"
              )}
            </button>
          </div>
        </div>
      )}

      {/* DATABASE ROSTER LIST HUB */}
      <div className="border border-zinc-800 bg-zinc-900/20 rounded-xl p-6">
        <h3 className="text-sm font-bold text-zinc-300 mb-4 uppercase tracking-wider">Active Vault Inventory</h3>
        
        {dataLoading ? (
          <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-red-600" /></div>
        ) : !comics || comics.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center py-4">No comics found in this timeline branch.</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {comics.map((comic) => (
              <div key={comic.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                <div>
                  <h4 className="text-sm font-bold text-white">{comic.title}</h4>
                  <p className="text-xs text-zinc-500">Pages Count: {comic.images?.length || 0} • Likes: {comic.likes || 0}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    comic.timeline === "asli" ? "bg-green-950 text-green-400 border border-green-900" :
                    comic.timeline === "purani" ? "bg-amber-950 text-amber-400 border border-amber-900" :
                    "bg-red-950 text-red-400 border border-red-900"
                  }`}>
                    {comic.timeline || "asli"} Timeline
                  </span>
                  <button 
                    type="button"
                    onClick={async () => {
                      if(confirm("Kya aap sach me is comic ko clear karna chahte hain?")) {
                        await deleteComic(comic.id)
                      }
                    }}
                    className="text-zinc-600 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
