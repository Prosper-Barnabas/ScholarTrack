import { GoogleGenAI, Type } from "@google/genai";
import type { StudentProfile, Scholarship, MatchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export async function getScholarshipMatches(
  profile: StudentProfile,
  scholarships: Scholarship[]
): Promise<MatchResult[]> {
  const prompt = `
    Analyze this student profile against the provided list of scholarships and return the top 5 best matches.
    
    Student Profile:
    - Name: ${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.surname}
    - Location: ${profile.countryOfResidence}, ${profile.stateOfResidence}
    - Origin: ${profile.stateOfOrigin}, ${profile.lgaOfOrigin} (${profile.communityHometown})
    - Academic Status: ${profile.undergraduateDetails.currentLevel} student at ${profile.undergraduateDetails.institutionName}
    - Course: ${profile.undergraduateDetails.courseOfStudy}
    - CGPA: ${profile.undergraduateDetails.currentCgpa} on a ${profile.undergraduateDetails.cgpaScale} scale
    - O'Level Maths/English: ${profile.olevelDetails.mathematics}/${profile.olevelDetails.english}
    - Other Details: On scholarship? ${profile.onScholarshipBursary ? 'Yes' : 'No'}, Disability? ${profile.hasPhysicalDisability ? 'Yes' : 'No'}, Siblings: ${profile.numberOfSiblings}
    
    Scholarships:
    ${scholarships.map(s => `
      ID: ${s.id}
      Name: ${s.name}
      Sponsor: ${s.sponsor}
      Eligible Levels: ${s.eligibleLevel.join(', ')}
      Location: ${s.location}
      Eligibility Criteria: ${s.eligibility.join('; ')}
    `).join('\n')}
    
    Score based on:
    - Level and Course match
    - GPA/Academic performance
    - State of origin / Location eligibility
    - Specific criteria (disability, need, etc.)
    
    Return a JSON array of exactly 5 objects with:
    - scholarshipId (string)
    - matchPercentage (number, 0-100)
    - reason (2-3 sentences explanation. IMPORTANT: You MUST cite specific details from the profile like their state of origin, GPA, or course of study to justify the match.)
    - priority (High Fit, Moderate Fit, or Stretch)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              scholarshipId: { type: Type.STRING },
              matchPercentage: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              priority: {
                type: Type.STRING,
                enum: ["High Fit", "Moderate Fit", "Stretch"]
              }
            },
            required: ["scholarshipId", "matchPercentage", "reason", "priority"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Matching Error:", error);
    return [];
  }
}

export async function getScholarshipSummary(scholarship: Scholarship): Promise<string> {
  const prompt = `
    Provide a simplified summary of this scholarship's eligibility and requirements for a student.
    Start with "In simple terms, you qualify if..."
    
    Scholarship: ${scholarship.name}
    Full Description: ${scholarship.fullDescription}
    Eligibility: ${scholarship.eligibility.join(', ')}
    Documents: ${scholarship.documents.join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "Summary unavailable.";
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "Summary unavailable.";
  }
}
