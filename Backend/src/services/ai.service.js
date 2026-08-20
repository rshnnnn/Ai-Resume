const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
console.log(
  "Gemini API key loaded:",
  Boolean(process.env.GEMINI_API_KEY)
);

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "The match score indicates how well the candidate's resume and self-describe align with the job describe. A higher score suggests a better fit for the role.",
    ),

  technicalQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview."),
        intention: z
          .string()
          .describe("Intention behind asking this question."),
        answer: z
          .string()
          .describe(
            "How to answer this question, what point to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions are asked to assess the candidate's knowledge, skills, and problem-solving abilities related to the job role.",
    ),

  behavioralQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview."),
        intention: z
          .string()
          .describe("Intention behind asking this question."),
        answer: z
          .string()
          .describe(
            "How to answer this question, what point to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions are asked to understand the candidate's behavior, attitude, and personality. These questions are usually open-ended and require the candidate to provide examples from their past experiences.",
    ),

  skillGap: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking or needs improvement in.",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, indicating how critical it is for the candidate to improve in this area.",
          ),
      }),
    )
    .describe(
      "Skill gaps are areas where the candidate lacks the necessary skills or knowledge for the job.",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan."),
        focus: z.string().describe("The main focus or objective for that day."),
        tasks: z
          .array(z.string())
          .describe(
            "A list of tasks or activities to be completed on that day.",
          ),
      }),
    )
    .describe(
      "The preparation plan is a structured outline of the steps and activities the candidate should follow to improve their skills and knowledge in preparation for the interview.",
    ),

  title: z
    .string()
    .describe(
      "The title of the interview report, summarizing the overall assessment and recommendations for the candidate.",
    ),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume:${resume}
                        Self description:${selfDescription}
                        Job description:${jobDescription} `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

async function generatePdfFromHtml({ htmlContent }) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" }); // networkidle0

  const pdfBuffer = await page.pdf({
    format: "A4",
    displayHeaderFooter: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "10mm",
      right: "10mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string().describe("The resume of the candidate in PDF format."),
  });
  const prompt = `Generate a resume for a candidate in the following format:
            resume:${resume},
            selfDescription:${selfDescription},
            jobDescription:${jobDescription}
            
            the response should be in JSON format with a single key "html" containing the resume in HTML format. 
            The resume is tailored to the job description and highlights the candidate's skills, experiences, and achievements relevant to the job. The resume should be well-structured, visually appealing, and easy to read. It should include sections such as contact information, summary, skills, work experience, education, and any other relevant sections that showcase the candidate's qualifications for the job.
            The content of resume should be not sound like it is generated by ai and it is close as possible as to a real human-written resume.
            You can highlight the candidate's achievements and skills that are most relevant to the job description. The resume should be concise, clear, and free of any grammatical or spelling errors. The resume should be in a professional tone and format, suitable for submission to potential employers.
            And the content shoule be ats friendly and should be optimized for applicant tracking systems (ATS) to ensure that it can be easily parsed and understood by automated systems used by employers to screen resumes. The resume should be tailored to the specific job description provided, highlighting the candidate's most relevant skills, experiences, and achievements that align with the requirements of the job. The resume should be visually appealing, with a clean and professional layout that is easy to read and navigate. The resume should be in a format that is compatible with common word processing software and can be easily shared with potential employers. The resume should be free of any unnecessary or irrelevant information, focusing on the most important details that will help the candidate stand out to potential employers. The resume should be written in a way that effectively communicates the candidate's qualifications and suitability for the job, while also being concise and to the point. The resume should be tailored to the specific job description provided, highlighting the candidate's most relevant skills, experiences, and achievements that align with the requirements of the job. The resume should be visually appealing, with a clean and professional layout that is easy to read and navigate. The resume should be in a format that is compatible with common word processing software and can be easily shared with potential employers. The resume should be free of any unnecessary or irrelevant information, focusing on the most important details that will help the candidate stand out to potential employers. The resume should be written in a way that effectively communicates the candidate's qualifications and suitability for the job, while also being concise and to the point.
            `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml({
    htmlContent: jsonContent.html,
  });

  return pdfBuffer;
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generatePdfFromHtml,
};
