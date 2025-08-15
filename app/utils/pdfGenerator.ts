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
  
  // Set up the document
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - (2 * margin)
  let currentY = 20

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 11): number => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4) + 5
  }

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number): number => {
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(title, margin, y)
    doc.setFont(undefined, 'normal')
    return y + 8
  }

  // Title
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text(data.fullName || 'Bio & Career Information', margin, currentY)
  currentY += 15

  // Contact Information
  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  if (data.location) {
    currentY = addWrappedText(`Country: ${data.location}`, margin, currentY, contentWidth)
    currentY += 8
  }

  // Education
  if (data.education) {
    currentY = addSectionHeader('Education', currentY)
    currentY = addWrappedText(data.education, margin, currentY, contentWidth)
    currentY += 5
  }

  // Career with Us
  if (data.careerWithUs) {
    currentY = addSectionHeader('Career with Us', currentY)
    currentY = addWrappedText(data.careerWithUs, margin, currentY, contentWidth)
    currentY += 5
  }

  // Professional Affiliations
  if (data.professionalAffiliations) {
    currentY = addSectionHeader('Professional Affiliations', currentY)
    currentY = addWrappedText(data.professionalAffiliations, margin, currentY, contentWidth)
    currentY += 5
  }

  // Languages
  if (data.languages) {
    currentY = addSectionHeader('Languages', currentY)
    currentY = addWrappedText(data.languages, margin, currentY, contentWidth)
    currentY += 5
  }

  // Check if we need a new page
  if (currentY > 200) {
    doc.addPage()
    currentY = 20
  }

  // Willingness & Flexibility
  currentY = addSectionHeader('Willingness & Flexibility', currentY)
  
  const willingnessItems = []
  if (data.willingness.sameDepartment) willingnessItems.push('within the same department')
  if (data.willingness.sameCompany) willingnessItems.push('within the same company') 
  if (data.willingness.sameBusinessUnit) willingnessItems.push('within the same business unit')
  if (data.willingness.allAreas) willingnessItems.push('across all areas of the company')
  
  if (willingnessItems.length > 0) {
    currentY = addWrappedText(`Willing to move: ${willingnessItems.join(', ')}`, margin, currentY, contentWidth)
  }
  
  if (data.willingness.geographyOutsideHome) {
    currentY = addWrappedText('Willing to have responsibility outside home country: Yes', margin, currentY, contentWidth)
  }
  
  if (data.willingness.relocate) {
    currentY = addWrappedText('Willing to relocate: Yes', margin, currentY, contentWidth)
  }
  
  if (data.willingness.travel) {
    currentY = addWrappedText('Willing to travel: Yes', margin, currentY, contentWidth)
  }
  currentY += 5

  // Current Responsibilities
  if (data.currentResponsibilities) {
    currentY = addSectionHeader('Current Responsibilities', currentY)
    currentY = addWrappedText(data.currentResponsibilities, margin, currentY, contentWidth)
    currentY += 5
  }

  // Top Skills Enjoyed
  if (data.topSkillsEnjoy) {
    currentY = addSectionHeader('Top 3 Skills Enjoyed in Role', currentY)
    currentY = addWrappedText(data.topSkillsEnjoy, margin, currentY, contentWidth)
    currentY += 5
  }

  // Check if we need a new page
  if (currentY > 200) {
    doc.addPage()
    currentY = 20
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
      if (currentY > 230) {
        doc.addPage()
        currentY = 20
      }
      
      doc.setFont(undefined, 'bold')
      currentY = addWrappedText(`${q.label}:`, margin, currentY, contentWidth, 11)
      doc.setFont(undefined, 'normal')
      currentY = addWrappedText(q.content, margin, currentY, contentWidth, 10)
      currentY += 3
    }
  })

  // Add footer
  const footerY = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, footerY)

  // Save the PDF
  const fileName = data.fullName ? 
    `${data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_bio.pdf` : 
    'bio_career_info.pdf'
  
  doc.save(fileName)
}
