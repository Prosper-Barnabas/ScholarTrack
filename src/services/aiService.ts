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
    - Name: ${profile.fullName}
    - Level: ${profile.levelOfStudy}
    - Field: ${profile.fieldOfStudy}
    - GPA: ${profile.gpa}
    - State: ${profile.stateOfOrigin}
    - Location Preference: ${profile.interestedLocation}
    - Financial Need: ${profile.financialNeed}
    
    Scholarships:
    ${scholarships.map(s => `
      ID: ${s.id}
      Name: ${s.name}
      Levels: ${s.eligibleLevel.join(', ')}
      Location: ${s.location}
      Eligibility: ${s.eligibility.join('; ')}
    `).join('\n')}
    
    Score based on:
    - Level match (Crucial)
    - Field relevance
    - GPA requirement
    - Location preference
    - Financial need
    
    Return a JSON array of exactly 5 objects with:
    - scholarshipId (string)
    - matchPercentage (number, 0-100)
    - reason (2-3 sentences explanation. IMPORTANT: You MUST explicitly mention specific details from the student's profile—such as their GPA, field of study, level of study, or state of origin—that directly contributed to this match.)
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
