'use client'

import { useState, useEffect } from 'react'
import { generatePDF } from './utils/pdfGenerator'

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

export default function Home() {
  const [formData, setFormData] = useState<BioData>({
    fullName: '',
    location: '',
    education: '',
    careerWithUs: '',
    professionalAffiliations: '',
    languages: '',
    willingness: {
      sameDepartment: false,
      sameCompany: false,
      sameBusinessUnit: false,
      allAreas: false,
      geographyOutsideHome: false,
      relocate: false,
      travel: false
    },
    currentResponsibilities: '',
    topSkillsEnjoy: '',
    topThreeSkillsCurrent: '',
    whatExcitesYou: '',
    challengingAspects: '',
    skillsToBuild1to3: '',
    desiredNextRole: '',
    opportunitiesNeeded: '',
    skillsToBuild3to5: '',
    longTermAspirations: '',
    opportunitiesForAspirations: ''
  })

  const [isGenerating, setIsGenerating] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('bioFormData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [])

  // Save to localStorage
  const saveToLocalStorage = (data: BioData) => {
    localStorage.setItem('bioFormData', JSON.stringify(data))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newData = {
      ...formData,
      [name]: value
    }
    setFormData(newData)
  }

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    saveToLocalStorage(formData)
  }

  const handleCheckboxChange = (category: keyof BioData['willingness'], checked: boolean) => {
    const newData = {
      ...formData,
      willingness: {
        ...formData.willingness,
        [category]: checked
      }
    }
    setFormData(newData)
    saveToLocalStorage(newData)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('bioFormData')
      setFormData({
        fullName: '',
        location: '',
        education: '',
        careerWithUs: '',
        professionalAffiliations: '',
        languages: '',
        willingness: {
          sameDepartment: false,
          sameCompany: false,
          sameBusinessUnit: false,
          allAreas: false,
          geographyOutsideHome: false,
          relocate: false,
          travel: false
        },
        currentResponsibilities: '',
        topSkillsEnjoy: '',
        topThreeSkillsCurrent: '',
        whatExcitesYou: '',
        challengingAspects: '',
        skillsToBuild1to3: '',
        desiredNextRole: '',
        opportunitiesNeeded: '',
        skillsToBuild3to5: '',
        longTermAspirations: '',
        opportunitiesForAspirations: ''
      })
    }
  }

  const handleExportPDF = async () => {
    setIsGenerating(true)
    try {
      await generatePDF(formData)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <button className="btn btn-reset" onClick={handleReset}>
          Reset All Data
        </button>
        <h1>Biography builder</h1>
        <p>Niels hoping that vibe coding this makes up for asking at short notice</p>
        <p>Data saved in your local storage and then exported to PDF</p>
      </div>

      <div className="form-section">
        <h2>Personal Information</h2>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Country</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="United States"
          />
        </div>

        <div className="form-group">
          <label htmlFor="education">Education</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Bachelor of Basket Weaving, University of Antarctica"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="careerWithUs">Career with us</label>
          <textarea
            id="careerWithUs"
            name="careerWithUs"
            value={formData.careerWithUs}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="2010 - 2018 - Chief bottlewasher, HS ONE cafe, 3rd floor, American Fork"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="professionalAffiliations">Professional Affiliations</label>
          <textarea
            id="professionalAffiliations"
            name="professionalAffiliations"
            value={formData.professionalAffiliations}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Professional organizations, memberships, certifications..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="languages">Languages</label>
          <input
            type="text"
            id="languages"
            name="languages"
            value={formData.languages}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="English (native), Spanish (fluent), French (conversational)..."
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Professional mobility</h2>
        
        <div className="checkbox-group">
          <label className="checkbox-group-label">Are you willing to move:</label>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="sameDepartment"
              checked={formData.willingness.sameDepartment}
              onChange={(e) => handleCheckboxChange('sameDepartment', e.target.checked)}
            />
            <label htmlFor="sameDepartment">within the same department</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="sameCompany"
              checked={formData.willingness.sameCompany}
              onChange={(e) => handleCheckboxChange('sameCompany', e.target.checked)}
            />
            <label htmlFor="sameCompany">within the same company</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="sameBusinessUnit"
              checked={formData.willingness.sameBusinessUnit}
              onChange={(e) => handleCheckboxChange('sameBusinessUnit', e.target.checked)}
            />
            <label htmlFor="sameBusinessUnit">within the same business unit</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="allAreas"
              checked={formData.willingness.allAreas}
              onChange={(e) => handleCheckboxChange('allAreas', e.target.checked)}
            />
            <label htmlFor="allAreas">across all areas of the company</label>
          </div>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-group-label">Are you willing to have responsibility for a geography outside of your home country?</label>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="geographyOutsideHome"
              checked={formData.willingness.geographyOutsideHome}
              onChange={(e) => handleCheckboxChange('geographyOutsideHome', e.target.checked)}
            />
            <label htmlFor="geographyOutsideHome">Yes</label>
          </div>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-group-label">Are you willing to relocate?</label>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="relocate"
              checked={formData.willingness.relocate}
              onChange={(e) => handleCheckboxChange('relocate', e.target.checked)}
            />
            <label htmlFor="relocate">Yes</label>
          </div>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-group-label">Are you willing to travel?</label>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="travel"
              checked={formData.willingness.travel}
              onChange={(e) => handleCheckboxChange('travel', e.target.checked)}
            />
            <label htmlFor="travel">Yes</label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Current Role</h2>
        
        <div className="form-group">
          <label htmlFor="currentResponsibilities">Current responsibilities with us</label>
          <textarea
            id="currentResponsibilities"
            name="currentResponsibilities"
            value={formData.currentResponsibilities}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe your current responsibilities and key activities..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="topSkillsEnjoy">What are the top 3 skills you enjoy using in your role</label>
          <textarea
            id="topSkillsEnjoy"
            name="topSkillsEnjoy"
            value={formData.topSkillsEnjoy}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Communications&#10;Working with Data&#10;Writing Code"
            rows={4}
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Reflection Questions</h2>
        
        <div className="form-group">
          <label htmlFor="topThreeSkillsCurrent">What are the top three skills you enjoy using in your current role?</label>
          <textarea
            id="topThreeSkillsCurrent"
            name="topThreeSkillsCurrent"
            value={formData.topThreeSkillsCurrent}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Please describe the three skills you most enjoy using..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="whatExcitesYou">What excites you most about what you're currently working on?</label>
          <textarea
            id="whatExcitesYou"
            name="whatExcitesYou"
            value={formData.whatExcitesYou}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Share what energizes and motivates you in your current work..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="challengingAspects">What do you find challenging about your current role?</label>
          <textarea
            id="challengingAspects"
            name="challengingAspects"
            value={formData.challengingAspects}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe the aspects of your role that you find most challenging..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="skillsToBuild1to3">What skills would you like to build in the next 1-3 years? Why?</label>
          <textarea
            id="skillsToBuild1to3"
            name="skillsToBuild1to3"
            value={formData.skillsToBuild1to3}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe the skills you want to develop and your reasons..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="desiredNextRole">What is your desired next role?</label>
          <textarea
            id="desiredNextRole"
            name="desiredNextRole"
            value={formData.desiredNextRole}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe your ideal next career step..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="opportunitiesNeeded">What opportunities/experiences do you believe you need to reach your desired next role?</label>
          <textarea
            id="opportunitiesNeeded"
            name="opportunitiesNeeded"
            value={formData.opportunitiesNeeded}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe the experiences, projects, or opportunities that would help you reach your goals..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="skillsToBuild3to5">What skills would you like to build in the next 3-5 years? Why?</label>
          <textarea
            id="skillsToBuild3to5"
            name="skillsToBuild3to5"
            value={formData.skillsToBuild3to5}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe your longer-term skill development goals..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="longTermAspirations">What are your long-term career aspirations?</label>
          <textarea
            id="longTermAspirations"
            name="longTermAspirations"
            value={formData.longTermAspirations}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Share your long-term career vision and aspirations..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="opportunitiesForAspirations">What opportunities/experiences do you believe you need to reach your long-term aspirations?</label>
          <textarea
            id="opportunitiesForAspirations"
            name="opportunitiesForAspirations"
            value={formData.opportunitiesForAspirations}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe what you need to achieve your long-term career goals..."
            rows={4}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleExportPDF}
          disabled={isGenerating || !formData.fullName}
        >
          {isGenerating ? 'Generating PDF...' : 'Export to PDF'}
        </button>
      </div>
    </div>
  )
}
