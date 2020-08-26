# Copyright 2019 Adrian Revilla - AvanzOSC
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl.html).

{
    "name": "Education Website (Events) - Coas",
    "version": "12.0.1.0.0",
    "category": "Website",
    "license": "AGPL-3",
    "author": "AvanzOSC",
    "website": "http://www.avanzosc.es",
    "depends": [
        "portal",
        "education",
        "website",
        "website_event",
        "calendar_school",
        "coas_education_website_main"
    ],
    "data": [
        "views/education_website_events_template.xml",
        "views/event_event_view.xml",
        "views/calendar_event_view.xml",
        "security/event_event_security.xml",
        "security/ir.model.access.csv"
    ],
    "installable": True,
}
