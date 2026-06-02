import { ReaderClient } from "@/components/reader-client"

export default function ReadPage({ params }: { params: { id: string } }) {
  return <ReaderClient id={params.id} />
}
