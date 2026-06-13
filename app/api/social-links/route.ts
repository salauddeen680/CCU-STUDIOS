import { NextResponse } from "next/server"
import { initializeApp, getApps, getApp } from "firebase/app"
import { 
  getFirestore, collection, addDoc, getDocs, 
  deleteDoc, doc, query, orderBy 
} from "firebase/firestore"

// 🔐 Firebase Initialization (Aapke environment variables se automatic connect hoga)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

// 📥 1. GET ROUTE: Saare Video links ko database se khinch kar website par dikhane ke liye
export async function GET() {
  try {
    const linksRef = collection(db, "social_links")
    // Naye videos upar dikhein, isliye timestamp ke hisab se order kiya hai
    const q = query(linksRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    
    const links = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(links, { status: 200 })
  } catch (error: any) {
    console.error("Firebase GET Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ➕ 2. POST ROUTE: Admin panel se naya video link Firebase mein save karne ke liye
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, url, posterUrl } = body

    if (!title || !url || !posterUrl) {
      return NextResponse.json({ error: "Sari fields bharna zaroori hai bhai!" }, { status: 400 })
    }

    const linksRef = collection(db, "social_links")
    const newDoc = await addDoc(linksRef, {
      title,
      url,
      posterUrl,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, id: newDoc.id }, { status: 201 })
  } catch (error: any) {
    console.error("Firebase POST Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 🗑️ 3. DELETE ROUTE: Admin panel se video link ko Firebase se delete karne ke liye
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID dena zaroori hai bhai!" }, { status: 400 })
    }

    const docRef = doc(db, "social_links", id)
    await deleteDoc(docRef)

    return NextResponse.json({ success: true, message: "Link deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Firebase DELETE Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

