import {generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf} from "../services/interview.api"
import {useContext, useEffect} from "react"
import {InterviewContext} from "../interview.context.jsx"
import {useParams} from "react-router-dom"


export const useInterview = () => {
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }
     
    const {loading, setLoading, report, setReport, reports, setReports} = context

    const generateReport = async ({selfDescription, resumeFile, jobDescription}) => {
        setLoading(true)
        let response = null
        try {
             response = await generateInterviewReport({selfDescription, resumeFile, jobDescription})
            setReport(response.interviewReport)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null 
        try{
             response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
        return response.interviewReport
    }
    const getReports = async () => {
        setLoading(true)
        let response = null 
        try{
             response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
        return response.interviewReport
    }

const getResumePdf = async ({ interviewReportId: interviewId }) => {
  setLoading(true);
  let response = null;
  try {
    response = await generateResumePdf({
      interviewReportId: interviewId,
    });
    const url = window.URL.createObjectURL(
      new Blob([response], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `resume_${interviewId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
  return response;
};

    useEffect(() => {
        if(interviewId){
            getReportById(interviewId)
        }
        else{
            getReports()
        }

    }, [interviewId])


    return {loading, report, reports, generateReport, getReportById, getReports, getResumePdf}
}