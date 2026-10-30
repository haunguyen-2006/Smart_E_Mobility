/* UC-017: Handle Operational Incidents
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-017",
  "name": "Handle Operational Incidents",
  "actor": "Real-time Operations Operator",
  "goal": "The operator reviews and manages an operational incident that affects Hub services or resource availability.",
  "preconditions": "• The operator is logged in and authorized to handle incidents. | • An incident, reported problem, or abnormal operational condition is available for review.",
  "trigger": "The operator selects “Handle Operational Incidents” after an issue is reported or detected.",
  "postconditions": "The incident status and action taken are recorded, and the operational outcome is displayed.",
  "stakeholders": "Real-time Operations Operator, Student, Admin, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• An incident must be reviewed against the latest available resource status. | • The system must not mark an incident resolved until the selected resolution is recorded.",
  "assumptions": "Incidents may involve unavailable resources, Hub-capacity problems, or other service disruptions; separate failure-specific use cases are not included in the current diagram.",
  "steps": [
    {
      "n": 1,
      "text": "The operator opens “Handle Operational Incidents”."
    },
    {
      "n": 2,
      "text": "The system displays available incidents and their reported details or current status."
    },
    {
      "n": 3,
      "text": "The operator selects an incident and reviews the affected Hub, resource, and available status information."
    },
    {
      "n": 4,
      "text": "The operator determines an appropriate response based on the available information."
    },
    {
      "n": 5,
      "text": "The operator records the action taken and updates the incident status."
    },
    {
      "n": 6,
      "text": "The system saves the update and displays the result."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "More investigation is required",
      "description": "If the issue cannot yet be resolved, the operator records the current findings and leaves the incident open for further action."
    },
    {
      "code": "A2",
      "title": "The incident is no longer active",
      "description": "If verification shows that the reported condition is no longer present, the operator records the finding and closes the incident according to the system’s rules."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Current resource status cannot be verified",
      "description": "The system informs the operator that the status data is unavailable and prevents the incident from being marked resolved solely on unverified information."
    },
    {
      "code": "E2",
      "title": "Incident update fails",
      "description": "The system displays an error and does not report the update as saved. The operator may retry."
    }
  ],
  "sourceTitle": "UC-017: Handle Operational Incidents",
  "category": "Dispatch & Network Monitoring",
  "decisionIndex": 2,
  "decisionText": "Can the incident status be verified?",
  "sequence": {
    "parts": [
      "Real-time Operations Operator",
      "Operator UI",
      "Incident Management Service",
      "Incident & Resource Records"
    ],
    "messages": [
      [
        0,
        1,
        "Open Handle Operational Incidents",
        "call"
      ],
      [
        1,
        2,
        "Request available incidents",
        "call"
      ],
      [
        2,
        3,
        "Retrieve incident list and current status",
        "call"
      ],
      [
        3,
        2,
        "Return incident records",
        "return"
      ],
      [
        2,
        1,
        "Display incidents",
        "return"
      ],
      [
        0,
        1,
        "Select incident and review affected resource",
        "call"
      ],
      [
        1,
        2,
        "Request incident and resource details",
        "call"
      ],
      [
        2,
        3,
        "Verify latest available resource status",
        "call"
      ],
      [
        3,
        2,
        "Return status and incident context",
        "return"
      ],
      [
        2,
        1,
        "Display details for assessment",
        "return"
      ],
      [
        0,
        1,
        "Choose response and record action/status",
        "call"
      ],
      [
        1,
        2,
        "Submit incident update",
        "call"
      ],
      [
        2,
        3,
        "Save incident status and action",
        "call"
      ],
      [
        3,
        2,
        "Return update result",
        "return"
      ],
      [
        2,
        1,
        "Display saved incident outcome",
        "return"
      ],
      [
        1,
        0,
        "Show result",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Operational incident",
    "states": [
      "Incident Open",
      "Under Investigation",
      "Response Recorded",
      "Incident Resolved"
    ],
    "events": [
      "Select incident",
      "Review resource status",
      "Save action/status",
      "Resolution confirmed"
    ],
    "branches": [
      {
        "from": 1,
        "label": "More investigation needed",
        "name": "Incident Remains Open",
        "returnTo": 0
      },
      {
        "from": 1,
        "label": "Status cannot be verified",
        "name": "Resolution Blocked",
        "returnTo": 0
      },
      {
        "from": 1,
        "label": "Update fails",
        "name": "Incident Update Failed",
        "returnTo": 1
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
