/* UC-003: Report a Problem
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-003",
  "name": "Report a Problem",
  "actor": "Student",
  "goal": "The student submits a report about a problem related to a Mobility Hub, shared vehicle, booking, or another supported service.",
  "preconditions": "• The student can access the reporting feature. | • The system is available to receive a problem report.",
  "trigger": "The student selects “Report a Problem”.",
  "postconditions": "The system records the report and displays a submission confirmation.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "Medium",
  "businessRules": "• A report must contain enough information for the problem to be understood. | • The system must not show a successful submission message unless the report is recorded. | • Submitting a report does not itself mean the reported issue has been resolved.",
  "assumptions": "Submitted reports are available for authorized operational review.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects “Report a Problem”."
    },
    {
      "n": 2,
      "text": "The system displays the problem-report form."
    },
    {
      "n": 3,
      "text": "The student selects a problem category, describes the issue, and identifies the related Hub, vehicle, or booking when applicable."
    },
    {
      "n": 4,
      "text": "The student submits the report."
    },
    {
      "n": 5,
      "text": "The system validates the required information and records the report."
    },
    {
      "n": 6,
      "text": "The system displays a confirmation that the report was submitted."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Student cancels the report",
      "description": "Before submitting, the student cancels the process. The system discards the unsubmitted report and returns to the previous screen."
    },
    {
      "code": "A2",
      "title": "Student adds more details",
      "description": "Before submission, the student returns to the form, adds or revises the description, and submits the report again."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Required information is missing",
      "description": "The system identifies the missing fields and asks the student to complete them before submission."
    },
    {
      "code": "E2",
      "title": "Report submission fails",
      "description": "If the system cannot record the report, it displays an error and does not show a success confirmation. The student may retry."
    }
  ],
  "sourceTitle": "UC-003: Report a Problem",
  "category": "Common & Support Services",
  "decisionIndex": 4,
  "decisionText": "Is the report complete?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Report Service",
      "Report Records"
    ],
    "messages": [
      [
        0,
        1,
        "Select Report a Problem",
        "call"
      ],
      [
        1,
        2,
        "Request report form",
        "call"
      ],
      [
        2,
        1,
        "Display report form",
        "return"
      ],
      [
        0,
        1,
        "Enter category, description and related item",
        "call"
      ],
      [
        1,
        2,
        "Submit report details",
        "call"
      ],
      [
        2,
        2,
        "Validate required report information",
        "self"
      ],
      [
        2,
        3,
        "Record valid problem report",
        "call"
      ],
      [
        3,
        2,
        "Return saved report result",
        "return"
      ],
      [
        2,
        1,
        "Return submission status",
        "return"
      ],
      [
        1,
        0,
        "Show report confirmation",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Problem report",
    "states": [
      "Report Form Open",
      "Details Entered",
      "Validating Report",
      "Report Recorded",
      "Available for Follow-up"
    ],
    "events": [
      "Open form",
      "Enter required details",
      "Information valid",
      "Save report"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Missing details",
        "name": "Needs Correction",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Record error",
        "name": "Submission Failed",
        "returnTo": 1
      },
      {
        "from": 0,
        "label": "Cancel before submit",
        "name": "Report Cancelled",
        "terminal": true
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
