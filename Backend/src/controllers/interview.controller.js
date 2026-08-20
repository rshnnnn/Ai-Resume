const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");


/**
 * @description Generate new interview report on the basis of user self description, resume pdf and job description.
 */


async function generateInterviewReportController(req, res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi,
    });

    res.status(200).json({
        message: "Interview report generated successfully",
        interviewReport,
    });
}


/**
 * @description Get interview report by interviewId.
 * 
 */

async function getInterviewReportController(req, res) {

    // console.log("BODY:", req.body);
    // console.log("FILES:", req.files);


    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewId);

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found",
        });
    }

    res.status(200).json({
        message: "Interview report retrieved successfully",
        interviewReport,
    });
}

/**
 * @description Get all interview reports of the logged in user.
 */

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestion -behavioralQuestion -skillGap -preparationPlan");

    res.status(200).json({
        message: "Interview reports retrieved successfully",
        interviewReports,
    });
}

/**
 * @description Generate resume pdf from user resume, self description and job description.
 * 
 * @param {string} resume - The resume of the candidate in PDF format.
 */

async function generateResumePdfController(req,res){

    const {interviewReportId} = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }
    const {resume, selfDescription, jobDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({
        resume,
        selfDescription,
        jobDescription
    })

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`,
    })

    res.send(pdfBuffer)

}


module.exports = {
    generateInterviewReportController,
    getInterviewReportController,
    getAllInterviewReportsController,
    generateResumePdfController
}