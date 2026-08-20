import axios from 'axios'

const api = axios.create({
    baseURL:"https://ai-resumebackend.onrender.com/api",
    withCredentials:true,
})

/**
 * @description Generate new interview report on the basis of user self description, resume pdf and job description.
 */
export const generateInterviewReport = async ({selfDescription, resumeFile, jobDescription}) => {
    const formData = new FormData();
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/interview/generate-report", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

/**
 * @description Get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/interview/${interviewId}`);
    return response.data;
};

/**
 * @description Get all interview reports of the logged in user.
 *  
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/interview");
    return response.data;
};


/**
 * @description Service function to generate resume pdf from user resume, self description and job description.
 * 
 * @param {string} resume - The resume of the candidate in PDF format.
 */

export const generateResumePdf = async ({interviewReportId}) => {
    const response = await api.post(`/interview/resume/pdf/${interviewReportId}`,
        null,
        { responseType: "blob" }
    );
    return response.data;
}