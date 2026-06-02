export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ background: "#000" }}>
        {children}
      </body>
    </html>
  )
}
