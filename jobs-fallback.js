// AUTO-GENERATED from jobs.json by tools/make_fallback.py. EXAMPLE DATA ONLY. Edit jobs.json, then rerun.
window.KIOSK_FALLBACK_DATA = {
  "_comment": "EXAMPLE DATA ONLY. Stands in for the FileMaker Jobs file. Job numbers are made up. Customer names, patterns and all other details are invented.",
  "exampleData": true,
  "config": {
    "plantName": "SIOUX CITY FOUNDRY",
    "screenTitle": "POUR SCHEDULE",
    "line": "PLANT 2 MOLDING LINE",
    "idleReturnSeconds": 45,
    "errorReturnSeconds": 10
  },
  "schedule": [
    {
      "seq": 1,
      "job": "9900101",
      "pourWindow": "6:30 AM",
      "status": "POURED"
    },
    {
      "seq": 2,
      "job": "9900102",
      "pourWindow": "8:00 AM",
      "status": "POURING"
    },
    {
      "seq": 3,
      "job": "9900103",
      "pourWindow": "10:15 AM",
      "status": "MOLDING"
    },
    {
      "seq": 4,
      "job": "9900104",
      "pourWindow": "12:45 PM",
      "status": "MOLDING"
    },
    {
      "seq": 5,
      "job": "9900105",
      "pourWindow": "2:30 PM",
      "status": "NEED CORES"
    }
  ],
  "jobs": {
    "9900101": {
      "customer": "NORTHLAND TURBINE",
      "pattern": "NT-7138",
      "description": "Steam valve body (example)",
      "alloy": "Ductile Iron",
      "grade": "65-45-12",
      "qty": 3,
      "pourTempF": 2600,
      "copeLb": 240,
      "dragLb": 210,
      "flask": "36 x 36 x 14/12",
      "location": "B2-S1-R4-2",
      "coreRequired": true,
      "moldSteps": [
        "Pull pattern NT-7138 from B2-S1-R4-2. Check gates and risers are all there.",
        "Ram drag. Strike off, vent, roll over.",
        "Ram cope with 2 exothermic riser sleeves on the bosses.",
        "Blow out mold. Coat and torch dry both halves."
      ],
      "coreSteps": [
        {
          "id": "A",
          "type": "NOBAKE",
          "qty": 1,
          "note": "Main bore core"
        },
        {
          "id": "B",
          "type": "SHELL",
          "qty": 2,
          "note": "Port cores, set chaplets first"
        },
        {
          "id": "C",
          "type": "OIL",
          "qty": 4,
          "note": "Bolt hole cores"
        }
      ],
      "cautions": [
        "Ductile: inoculate in the ladle. Pour within 10 min of treatment.",
        "Check chaplet sizes against the layout photo before closing."
      ],
      "photos": [
        "CORE LAYOUT",
        "CHAPLET PLACEMENT",
        "CLOSED MOLD"
      ]
    },
    "9900102": {
      "customer": "MIDWEST CONVEYOR",
      "pattern": "MC-730",
      "description": "Rotary feeder housing (example)",
      "alloy": "Gray Iron",
      "grade": "Class 30",
      "qty": 9,
      "pourTempF": 2550,
      "copeLb": 190,
      "dragLb": 150,
      "flask": "BOXED 30 x 30",
      "location": "B4-S2-R3-3",
      "coreRequired": true,
      "moldSteps": [
        "Pull pattern MC-730 and the HD plate from B4-S2-R3-3.",
        "Ram drag. Vent over the thick flange.",
        "Ram cope. Cut pouring basin on the operator side.",
        "Set cores A to D in order. Blow out and close."
      ],
      "coreSteps": [
        {
          "id": "A",
          "type": "NOBAKE",
          "qty": 10,
          "note": ""
        },
        {
          "id": "B",
          "type": "NOBAKE",
          "qty": 12,
          "note": ""
        },
        {
          "id": "C",
          "type": "OIL",
          "qty": 3,
          "note": ""
        },
        {
          "id": "D",
          "type": "SHELL",
          "qty": 3,
          "note": "Use 1/2 in band lug core box"
        }
      ],
      "cautions": [
        "See process sheet photos before setting cores.",
        "Pressure test first parts before shipping."
      ],
      "photos": [
        "CORE LAYOUT",
        "CHAPLET PLACEMENT",
        "FINISHED MOLD"
      ]
    },
    "9900103": {
      "customer": "PRAIRIE PUMP WORKS",
      "pattern": "PP-4410",
      "description": "Slurry pump impeller (example)",
      "alloy": "Ni-Hard",
      "grade": "Ni-Hard 4",
      "qty": 4,
      "pourTempF": 2650,
      "copeLb": 165,
      "dragLb": 140,
      "flask": "30 x 30 x 12/10",
      "location": "B1-S3-R2-1",
      "coreRequired": true,
      "moldSteps": [
        "Pull pattern PP-4410 and the vane core prints.",
        "Ram drag with chills on the vane tips. Count chills: 6.",
        "Ram cope. Two open risers on the hub.",
        "Coat both halves heavy. Torch dry."
      ],
      "coreSteps": [
        {
          "id": "A",
          "type": "NOBAKE",
          "qty": 1,
          "note": "Vane core, handle with 2 people"
        },
        {
          "id": "B",
          "type": "NOBAKE",
          "qty": 1,
          "note": "Eye core"
        }
      ],
      "cautions": [
        "Ni-Hard: do NOT shake out early. Leave in mold 8 hours minimum.",
        "Very hard and brittle. No hammer on castings."
      ],
      "photos": [
        "CHILL LAYOUT",
        "VANE CORE SET",
        "CLOSED MOLD"
      ]
    },
    "9900104": {
      "customer": "RIVER CITY AG",
      "pattern": "RC-2207",
      "description": "Gearbox cover (example)",
      "alloy": "Gray Iron",
      "grade": "Class 40",
      "qty": 20,
      "pourTempF": 2500,
      "copeLb": 85,
      "dragLb": 70,
      "flask": "24 x 24 x 8/8",
      "location": "B3-S1-R1-4",
      "coreRequired": false,
      "moldSteps": [
        "Pull match plate RC-2207 (2 on).",
        "Ram drag and cope. No cores on this job.",
        "Vent over each boss. Blow out and close.",
        "Stack 4 molds per pour row."
      ],
      "coreSteps": [],
      "cautions": [
        "No cores. If a core print is showing, stop and call the lead."
      ],
      "photos": [
        "PATTERN PLATE",
        "GATING",
        "CLOSED MOLD"
      ]
    },
    "9900105": {
      "customer": "HAWKEYE HYDRAULICS",
      "pattern": "HH-510",
      "description": "Cylinder end cap (example)",
      "alloy": "Ductile Iron",
      "grade": "80-55-06",
      "qty": 8,
      "pourTempF": 2600,
      "copeLb": 110,
      "dragLb": 95,
      "flask": "26 x 26 x 10/8",
      "location": "B2-S4-R2-2",
      "coreRequired": true,
      "moldSteps": [
        "Pull pattern HH-510. Confirm filter print is clean.",
        "Ram drag. Set ceramic filter in the runner.",
        "Ram cope. Vent the center boss.",
        "Set core A. Blow out and close."
      ],
      "coreSteps": [
        {
          "id": "A",
          "type": "SHELL",
          "qty": 8,
          "note": "Port core, check for cracks"
        }
      ],
      "cautions": [
        "Cores due from core room at 1:30 PM. Do not close molds without them.",
        "Ductile: pour within 10 min of treatment."
      ],
      "photos": [
        "FILTER PLACEMENT",
        "CORE SET",
        "CLOSED MOLD"
      ]
    }
  }
};
