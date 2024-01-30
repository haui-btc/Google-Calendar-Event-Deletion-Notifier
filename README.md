# Google Calendar Event Deletion Notifier

## Overview
This Google Apps Script is designed to monitor a specified Google Calendar for deleted events. When an event is detected as deleted, the script automatically sends a notification email to the affected parties. This is particularly useful for businesses or individuals who schedule appointments or meetings through Google Calendar and need to manage cancellations efficiently.

## Features
- **Event Monitoring**: Automatically checks for deleted events in a specific Google Calendar.
- **Notification**: Sends email notifications when an event is detected as deleted.
- **Time Frame Setting**: By default, the script checks for events within a four-week time frame, but this can be adjusted as needed.
- **Customizable Email Content**: The script includes a function to send emails with customizable content, including event details like title, date, and time.

## How It Works
1. **Setting the Calendar ID**: Specify the Google Calendar ID in the `calendarId` variable.
2. **Event Retrieval**: The script retrieves events scheduled in the next four weeks from the specified calendar.
3. **Detection of Deletions**: By comparing current events with a previously stored list of event IDs, the script identifies which events have been deleted since the last script run.
4. **Email Notifications**: For each deleted event, it extracts the attendee’s name and email from the event description and sends a cancellation email.
5. **Data Storage**: The script stores the current event IDs and their details for future reference using Google's `PropertiesService`.

## Prerequisites
- Access to Google Apps Script: https://www.google.com/script/start/
- A Google Calendar with events scheduled.
- Events in the calendar should have descriptions formatted in a specific way for the script to correctly extract email addresses and names.

## Setup and Configuration
1. Open Google Apps Script and create a new project.
2. Copy the script into the script editor.
3. Replace `'<YOUR-EMAIL>@gmail.com'` with the email ID of your Google Calendar in the `calendarId` variable.
4. Ensure the event descriptions in your Google Calendar are formatted to include email and name (as expected by `extractEmail` and `extractName` functions).
5. Save and run the script to start monitoring event deletions.

## Additional Information
- **Customization**: The script can be modified to change the time frame for checking events or to alter the email notification's format and content.
- **Dependencies**: This script relies on Google Calendar and Gmail services provided by Google Apps Script.

## Contributions
Contributions are welcome. Please fork the repository and submit a pull request with your changes.

