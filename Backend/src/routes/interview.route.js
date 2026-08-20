    const express = require("express");
    const authMiddleware = require("../middlewares/auth.middleware");
    const interviewController = require("../controllers/interview.controller");
    const upload = require("../middlewares/file.middleware");

    const interviewRouter = express.Router();

    /**
     * @route Post /api/interview
     * @description Generate new interview report on the basis of user self description, resume pdf and job description.
     * @access private
     */
    interviewRouter.post(
    "/generate-report",
    authMiddleware.authUser,
    upload.single("resume"),
            // upload.any(),
    interviewController.generateInterviewReportController,
    );

    /**
     * @route Get /api/interview/:interviewId
     * @description Get interview report by interviewId.
     * @access private
     */
    interviewRouter.get(
    "/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportController,
    );

    /**
     * @route Get /api/interview
     * @description Get all interview reports of the logged in user.
     * @access private
     */
    interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController,
    );

    /**
     * @route Post /api/interview/generate-resume-pdf
     * @description Generate resume pdf from user resume, self description and job description.
     * @access private
     */

        interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

    module.exports = interviewRouter;
