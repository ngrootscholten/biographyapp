import jsPDF from 'jspdf'

interface BioData {
  fullName: string
  location: string
  education: string
  careerWithUs: string
  professionalAffiliations: string
  languages: string
  willingness: {
    sameDepartment: boolean
    sameCompany: boolean
    sameBusinessUnit: boolean
    allAreas: boolean
    geographyOutsideHome: boolean
    relocate: boolean
    travel: boolean
  }
  currentResponsibilities: string
  topSkillsEnjoy: string
  topThreeSkillsCurrent: string
  whatExcitesYou: string
  challengingAspects: string
  skillsToBuild1to3: string
  desiredNextRole: string
  opportunitiesNeeded: string
  skillsToBuild3to5: string
  longTermAspirations: string
  opportunitiesForAspirations: string
}

export const generatePDF = async (data: BioData): Promise<void> => {
  const doc = new jsPDF()
  
  // Set up the document with professional styling
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 25
  const contentWidth = pageWidth - (2 * margin)
  let currentY = 30

  // Color scheme
  const primaryColor = { r: 59, g: 130, b: 246 } // Blue #3b82f6
  const secondaryColor = { r: 71, g: 85, b: 105 } // Gray #475569
  const lightGray = { r: 148, g: 163, b: 184 } // Light gray #94a3b8

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 11, color = 'black'): number => {
    doc.setFontSize(fontSize)
    if (color === 'primary') {
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    } else if (color === 'secondary') {
      doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b)
    } else if (color === 'light') {
      doc.setTextColor(lightGray.r, lightGray.g, lightGray.b)
    } else {
      doc.setTextColor(0, 0, 0)
    }
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * (fontSize * 0.5)) + 3
  }

  // Helper function to add section header with professional styling
  const addSectionHeader = (title: string, y: number): number => {
    // Add subtle background bar
    doc.setFillColor(248, 250, 252) // Very light gray background
    doc.rect(margin - 5, y - 8, contentWidth + 10, 18, 'F')
    
    // Add left accent line
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.rect(margin - 5, y - 8, 3, 18, 'F')
    
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b)
    doc.text(title.toUpperCase(), margin, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    return y + 18
  }

  // Helper function to add divider line
  const addDivider = (y: number): number => {
    doc.setDrawColor(lightGray.r, lightGray.g, lightGray.b)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
    return y + 8
  }

  // Header with professional styling
  // Add header background
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.rect(0, 0, pageWidth, 45, 'F')
  
  // Title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(data.fullName || 'PROFESSIONAL BIOGRAPHY', margin, 25)
  
  // Subtitle
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(240, 249, 255)
  doc.text('Career Development Profile', margin, 35)
  
  currentY = 60

  // Contact Information with professional presentation
  if (data.location) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b)
    doc.text('Country:', margin, currentY)
    doc.setFont('helvetica', 'normal')
    currentY = addWrappedText(`${data.location}`, margin + 35, currentY, contentWidth - 35, 11, 'secondary')
    currentY += 5
  }

  currentY += 5

  // Education
  if (data.education) {
    currentY = addSectionHeader('Education', currentY)
    currentY = addWrappedText(data.education, margin, currentY, contentWidth, 11)
    currentY += 8
  }

  // Career with Us
  if (data.careerWithUs) {
    currentY = addSectionHeader('Career with Us', currentY)
    currentY = addWrappedText(data.careerWithUs, margin, currentY, contentWidth, 11)
    currentY += 8
  }

  // Professional Affiliations
  if (data.professionalAffiliations) {
    currentY = addSectionHeader('Professional Affiliations', currentY)
    currentY = addWrappedText(data.professionalAffiliations, margin, currentY, contentWidth, 11)
    currentY += 8
  }

  // Languages
  if (data.languages) {
    currentY = addSectionHeader('Languages', currentY)
    currentY = addWrappedText(data.languages, margin, currentY, contentWidth, 11)
    currentY += 8
  }

  // Check if we need a new page
  if (currentY > 220) {
    doc.addPage()
    currentY = 30
  }

  // Professional mobility
  currentY = addSectionHeader('Professional Mobility', currentY)
  
  const willingnessItems = []
  if (data.willingness.sameDepartment) willingnessItems.push('• Within the same department')
  if (data.willingness.sameCompany) willingnessItems.push('• Within the same company') 
  if (data.willingness.sameBusinessUnit) willingnessItems.push('• Within the same business unit')
  if (data.willingness.allAreas) willingnessItems.push('• Across all areas of the company')
  
  if (willingnessItems.length > 0) {
    doc.setFont('helvetica', 'bold')
    currentY = addWrappedText('Willing to move:', margin, currentY, contentWidth, 11, 'secondary')
    doc.setFont('helvetica', 'normal')
    willingnessItems.forEach(item => {
      currentY = addWrappedText(item, margin + 10, currentY, contentWidth - 10, 10)
    })
    currentY += 3
  }
  
  // Other mobility preferences
  const otherPreferences = []
  if (data.willingness.geographyOutsideHome) {
    otherPreferences.push('• Responsibility outside home country')
  }
  if (data.willingness.relocate) {
    otherPreferences.push('• Willing to relocate')
  }
  if (data.willingness.travel) {
    otherPreferences.push('• Willing to travel')
  }
  
  if (otherPreferences.length > 0) {
    doc.setFont('helvetica', 'bold')
    currentY = addWrappedText('Additional preferences:', margin, currentY, contentWidth, 11, 'secondary')
    doc.setFont('helvetica', 'normal')
    otherPreferences.forEach(item => {
      currentY = addWrappedText(item, margin + 10, currentY, contentWidth - 10, 10)
    })
  }
  currentY += 8

  // Current Responsibilities
  if (data.currentResponsibilities) {
    currentY = addSectionHeader('Current Responsibilities', currentY)
    currentY = addWrappedText(data.currentResponsibilities, margin, currentY, contentWidth, 11)
    currentY += 8
  }

  // Top Skills Enjoyed
  if (data.topSkillsEnjoy) {
    currentY = addSectionHeader('Top 3 Skills Enjoyed in Role', currentY)
    currentY = addWrappedText(data.topSkillsEnjoy, margin, currentY, contentWidth, 11)
    currentY += 8
  }

  // Check if we need a new page
  if (currentY > 220) {
    doc.addPage()
    currentY = 30
  }

  // Reflection Questions
  currentY = addSectionHeader('Career Reflection Questions', currentY)

  const questions = [
    { label: 'Top three skills enjoyed in current role', content: data.topThreeSkillsCurrent },
    { label: 'What excites you most about current work', content: data.whatExcitesYou },
    { label: 'Challenging aspects of current role', content: data.challengingAspects },
    { label: 'Skills to build (1-3 years)', content: data.skillsToBuild1to3 },
    { label: 'Desired next role', content: data.desiredNextRole },
    { label: 'Opportunities needed for next role', content: data.opportunitiesNeeded },
    { label: 'Skills to build (3-5 years)', content: data.skillsToBuild3to5 },
    { label: 'Long-term career aspirations', content: data.longTermAspirations },
    { label: 'Opportunities needed for long-term goals', content: data.opportunitiesForAspirations }
  ]

  questions.forEach(q => {
    if (q.content) {
      // Check if we need a new page
      if (currentY > 240) {
        doc.addPage()
        currentY = 30
      }
      
      // Question with professional styling
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      currentY = addWrappedText(`${q.label}:`, margin, currentY, contentWidth, 11, 'primary')
      
      // Answer with proper spacing
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      currentY = addWrappedText(q.content, margin + 5, currentY, contentWidth - 5, 10)
      
      // Add subtle divider
      currentY = addDivider(currentY)
    }
  })

  // Add professional footer to all pages
  const pageCount = doc.getNumberOfPages()
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const footerY = doc.internal.pageSize.getHeight() - 15
    
    // Footer line
    doc.setDrawColor(lightGray.r, lightGray.g, lightGray.b)
    doc.setLineWidth(0.5)
    doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8)
    
    // Footer text
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(lightGray.r, lightGray.g, lightGray.b)
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, footerY)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 30, footerY)
    
    // Company/confidential notice (optional)
    doc.text('Professional Biography - Confidential', pageWidth / 2, footerY, { align: 'center' })
  }

  // Save the PDF with professional naming
  const fileName = data.fullName ? 
    `${data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Professional_Biography.pdf` : 
    'Professional_Biography.pdf'
  
  doc.save(fileName)
}
