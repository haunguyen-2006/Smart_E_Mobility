/* UC-010: Register Personal Charging Demand
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-010",
  "name": "Register Personal Charging Demand",
  "actor": "Student",
  "goal": "The student registers the charging needs of a privately owned electric vehicle at a selected Mobility Hub.",
  "preconditions": "• The student is logged in. | • The required personal-vehicle information is available. | • Charging availability information can be retrieved.",
  "trigger": "The student selects “Register Personal Charging Demand”.",
  "postconditions": "The charging demand is recorded for scheduling, and the system displays confirmation and any available schedule information.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• The system must validate required charging-request information. | • Charging allocation must account for available charging capacity and the request information supported by the system. | • Requests with low battery levels or upcoming usage needs may receive higher priority under the smart-charging policy.",
  "assumptions": "The system can receive current battery information and uses real or simulated charging-point data. The exact priority thresholds are determined by the group’s charging policy.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects “Register Personal Charging Demand”."
    },
    {
      "n": 2,
      "text": "The system displays available Mobility Hubs."
    },
    {
      "n": 3,
      "text": "The student selects a Hub and provides the required vehicle, battery-level, and charging-request information."
    },
    {
      "n": 4,
      "text": "The system displays available charging resources and any supported time-slot information."
    },
    {
      "n": 5,
      "text": "The student submits the charging demand."
    },
    {
      "n": 6,
      "text": "The system validates the request and records it for smart charging scheduling."
    },
    {
      "n": 7,
      "text": "The system displays the demand confirmation and any schedule estimate or assignment currently available."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Charging capacity is fully booked",
      "description": "If no suitable charging capacity is available for the requested period, the system informs the student and suggests another available period or Hub when possible. The student may revise the request or cancel."
    },
    {
      "code": "A2",
      "title": "Request may qualify for priority",
      "description": "If the supplied battery or usage information meets the configured priority policy, the system records the applicable priority for consideration by smart charging scheduling."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Charging-point status cannot be retrieved",
      "description": "The system informs the student that current charging availability is temporarily unavailable and does not confirm an unverified time slot."
    },
    {
      "code": "E2",
      "title": "Request information is invalid",
      "description": "The system identifies the missing or invalid information and asks the student to correct the request."
    },
    {
      "code": "E3",
      "title": "Demand registration fails",
      "description": "The system displays an error and does not show the demand as successfully registered."
    }
  ],
  "sourceTitle": "UC-010: Register Personal Charging Demand",
  "category": "Vehicle Services",
  "decisionIndex": 5,
  "decisionText": "Is the charging request valid and feasible?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Charging Request Service",
      "Charging Queue & Capacity"
    ],
    "messages": [
      [
        0,
        1,
        "Select Register Personal Charging Demand",
        "call"
      ],
      [
        1,
        2,
        "Request available Hubs",
        "call"
      ],
      [
        2,
        3,
        "Retrieve charging capacity and slots",
        "call"
      ],
      [
        3,
        2,
        "Return charging-resource information",
        "return"
      ],
      [
        2,
        1,
        "Display Hubs, resources and slots",
        "return"
      ],
      [
        0,
        1,
        "Choose Hub and enter vehicle/battery/request data",
        "call"
      ],
      [
        1,
        2,
        "Submit charging demand",
        "call"
      ],
      [
        2,
        2,
        "Validate request and determine applicable priority",
        "self"
      ],
      [
        2,
        3,
        "Record request for smart scheduling",
        "call"
      ],
      [
        3,
        2,
        "Confirm registered demand",
        "return"
      ],
      [
        2,
        1,
        "Return demand and schedule estimate",
        "return"
      ],
      [
        1,
        0,
        "Display confirmation",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Personal charging demand",
    "states": [
      "Demand Draft",
      "Request Details Entered",
      "Validating Demand",
      "Demand Registered",
      "Queued for Scheduling"
    ],
    "events": [
      "Enter vehicle and demand",
      "Submit request",
      "Request valid",
      "Register for scheduling"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Capacity full",
        "name": "Alternative Slot / Hub Needed",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Invalid request",
        "name": "Correction Required",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Registration error",
        "name": "Registration Failed",
        "returnTo": 1
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
