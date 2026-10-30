/* UC-009: Reserve Personal Parking Spot
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-009",
  "name": "Reserve Personal Parking Spot",
  "actor": "Student",
  "goal": "The student reserves an available parking spot at a selected Mobility Hub for a privately owned electric vehicle.",
  "preconditions": "• The student is logged in. | • Hub and parking availability information is available. | • The student intends to park a personal electric vehicle at the selected Hub.",
  "trigger": "The student selects “Reserve Personal Parking Spot”.",
  "postconditions": "The parking reservation is recorded, the selected spot is marked as “Reserved”, and confirmation is displayed.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Only available parking capacity may be reserved for the requested period. | • Conflicting reservations must not be confirmed. | • Cancelled or failed reservations must not incorrectly mark a spot as “Reserved”.",
  "assumptions": "Parking status and occupancy are updated using near-real-time sensor or simulated data.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects “Reserve Personal Parking Spot”."
    },
    {
      "n": 2,
      "text": "The system displays available Mobility Hubs."
    },
    {
      "n": 3,
      "text": "The student selects a Hub and provides the intended parking period."
    },
    {
      "n": 4,
      "text": "The system displays parking spots available for that period."
    },
    {
      "n": 5,
      "text": "The student selects a suitable parking spot."
    },
    {
      "n": 6,
      "text": "The system verifies that the spot is still available and has no conflicting reservation."
    },
    {
      "n": 7,
      "text": "The system creates the reservation and marks the spot as “Reserved”."
    },
    {
      "n": 8,
      "text": "The system displays the reservation confirmation and parking details."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "No parking spot is available at the selected Hub",
      "description": "The system informs the student and suggests alternative Hubs or available periods, if supported. The student selects an alternative and the flow resumes at Step 4. If no suitable option exists, the student may cancel without a reservation."
    },
    {
      "code": "A2",
      "title": "Student selects another parking spot",
      "description": "The student returns to the available-spot list, selects another spot, and continues from Step 6."
    },
    {
      "code": "A3",
      "title": "Student cancels the reservation",
      "description": "Before confirmation, the student cancels the process. No reservation is created."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Parking availability cannot be retrieved",
      "description": "The system informs the student that current availability is temporarily unavailable and does not proceed using unverified data."
    },
    {
      "code": "E2",
      "title": "Selected spot becomes unavailable",
      "description": "The system rejects the reservation and lets the student select another available spot or Hub."
    },
    {
      "code": "E3",
      "title": "Reservation creation fails",
      "description": "The system displays an error and ensures the spot is not incorrectly marked as “Reserved”."
    }
  ],
  "sourceTitle": "UC-009: Reserve Personal Parking Spot",
  "category": "Vehicle Services",
  "decisionIndex": 5,
  "decisionText": "Is the spot available with no conflict?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Parking Reservation Service",
      "Parking Records & Capacity"
    ],
    "messages": [
      [
        0,
        1,
        "Select Reserve Personal Parking Spot",
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
        "Retrieve Hub and parking capacity",
        "call"
      ],
      [
        3,
        2,
        "Return Hub list and capacity",
        "return"
      ],
      [
        2,
        1,
        "Display available Hubs",
        "return"
      ],
      [
        0,
        1,
        "Select Hub and parking period",
        "call"
      ],
      [
        1,
        2,
        "Request spots for period",
        "call"
      ],
      [
        2,
        3,
        "Retrieve available spots",
        "call"
      ],
      [
        3,
        2,
        "Return available spot list",
        "return"
      ],
      [
        2,
        1,
        "Display available spots",
        "return"
      ],
      [
        0,
        1,
        "Select a parking spot",
        "call"
      ],
      [
        1,
        2,
        "Check availability and conflicts",
        "call"
      ],
      [
        2,
        3,
        "Recheck spot and reservation records",
        "call"
      ],
      [
        3,
        2,
        "Return validation result",
        "return"
      ],
      [
        2,
        3,
        "Create reservation and mark spot Reserved",
        "call"
      ],
      [
        3,
        2,
        "Return reservation record",
        "return"
      ],
      [
        2,
        1,
        "Return confirmation",
        "return"
      ],
      [
        1,
        0,
        "Display parking details",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Personal parking reservation",
    "states": [
      "Request Draft",
      "Hub & Period Selected",
      "Checking Availability",
      "Parking Reserved"
    ],
    "events": [
      "Choose Hub and period",
      "Select spot",
      "Capacity and conflicts clear"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Spot unavailable",
        "name": "Alternative Spot Needed",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Reservation save fails",
        "name": "Reservation Failed",
        "returnTo": 1
      },
      {
        "from": 1,
        "label": "Cancel request",
        "name": "Reservation Cancelled",
        "terminal": true
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
