import { jsPDF } from 'jspdf'

export const downloadInvoicePdf = (fileBaseName: string, title: string, lines: string[]): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const marginX = 14
  const topY = 18
  const bottomY = 285
  const lineHeight = 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(title, marginX, topY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)

  let currentY = topY + 10

  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 180)

    wrapped.forEach((part: string) => {
      if (currentY > bottomY) {
        doc.addPage()
        currentY = 18
      }

      doc.text(part, marginX, currentY)
      currentY += lineHeight
    })
  })

  doc.save(`${fileBaseName}.pdf`)
}
