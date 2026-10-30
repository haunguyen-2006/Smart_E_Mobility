/* UC-011: View My Bookings and Charging History
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-011",
  "name": "View My Bookings and Charging History",
  "actor": "Student",
  "goal": "The student reviews current and previous bookings and available charging-history records associated with the student account.",
  "preconditions": "• The student is logged in. | • The system can retrieve records associated with the student account.",
  "trigger": "The student selects “View My Bookings and Charging History”.",
  "postconditions": "The system displays the student’s available booking and charging-history records.",
  "stakeholders": "Student, Real-time Operations Operator",
  "priority": "Medium",
  "businessRules": "• Students may view only records associated with their own accounts. | • The system must distinguish active, cancelled, and completed records where those states are supported.",
  "assumptions": "The system stores or can retrieve booking records and charging-demand or charging-session records, as applicable.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects “View My Bookings and Charging History”."
    },
    {
      "n": 2,
      "text": "The system retrieves the student’s booking and available charging-history records."
    },
    {
      "n": 3,
      "text": "The system displays the records with relevant information such as date, Hub, resource, and status where available."
    },
    {
      "n": 4,
      "text": "The student selects a record to review its details."
    },
    {
      "n": 5,
      "text": "The system displays the selected record, and the student may return to the record list."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "No records are available",
      "description": "If the student has no bookings or charging-history records, the system displays an appropriate empty-state message."
    },
    {
      "code": "A2",
      "title": "Student narrows the displayed records",
      "description": "If filtering or sorting is available, the student selects a supported filter and the system displays the matching records."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Records cannot be retrieved",
      "description": "If the service cannot retrieve the records, the system informs the student that the information is temporarily unavailable and allows a retry."
    },
    {
      "code": "E2",
      "title": "Record details are unavailable",
      "description": "If a selected record is no longer available, the system informs the student and returns to the record list."
    }
  ],
  "sourceTitle": "UC-011: View My Bookings and Charging History",
  "category": "Vehicle Services",
  "decisionIndex": 1,
  "decisionText": "Are any records available?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "History Service",
      "Booking & Charging Records"
    ],
    "messages": [
      [
        0,
        1,
        "Open View My Bookings and Charging History",
        "call"
      ],
      [
        1,
        2,
        "Request records for current student",
        "call"
      ],
      [
        2,
        3,
        "Retrieve bookings and available charging history",
        "call"
      ],
      [
        3,
        2,
        "Return matched records",
        "return"
      ],
      [
        2,
        1,
        "Display records with dates, Hubs and statuses",
        "return"
      ],
      [
        1,
        0,
        "Show booking and charging history",
        "return"
      ],
      [
        0,
        1,
        "Select a record",
        "call"
      ],
      [
        1,
        2,
        "Request selected record details",
        "call"
      ],
      [
        2,
        3,
        "Retrieve record details",
        "call"
      ],
      [
        3,
        2,
        "Return details",
        "return"
      ],
      [
        2,
        1,
        "Display selected record",
        "return"
      ],
      [
        1,
        0,
        "Show details and return option",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Booking and charging-history view",
    "states": [
      "History View Closed",
      "Loading Records",
      "Records Displayed",
      "Record Details Displayed"
    ],
    "events": [
      "Open history",
      "Records retrieved",
      "Select record"
    ],
    "branches": [
      {
        "from": 1,
        "label": "No records",
        "name": "Empty History",
        "returnTo": 0
      },
      {
        "from": 1,
        "label": "Retrieval failure",
        "name": "History Unavailable",
        "returnTo": 0
      },
      {
        "from": 3,
        "label": "Return to list",
        "name": "Records Displayed Again",
        "returnTo": 2
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
