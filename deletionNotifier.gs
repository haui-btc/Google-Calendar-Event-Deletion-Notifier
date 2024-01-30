var calendarId = '<YOUR-EMAIL>@gmail.com'; // Replace with your Calendar ID

function checkForDeletedEvents() {
  var now = new Date();
  var fourWeeksLater = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000); // 4 weeks into the future

  // Get events from the next 4 weeks
  var events = CalendarApp.getCalendarById(calendarId).getEvents(now, fourWeeksLater);
  Logger.log("Anzahl Termine: " + events.length);

  var currentEventIds = [];
  for (var i = 0; i < events.length; i++) {
    currentEventIds.push(events[i].getId());
  }

  // Compare with stored event IDs
  var storedEventIds = PropertiesService.getScriptProperties().getProperty('eventIds');
  if (storedEventIds) {
    storedEventIds = storedEventIds.split(',');

    for (var j = 0; j < storedEventIds.length; j++) {
      if (currentEventIds.indexOf(storedEventIds[j]) == -1) {
        // This event has been deleted
        var eventDetails = JSON.parse(PropertiesService.getScriptProperties().getProperty(storedEventIds[j]));
        Logger.log("Ereignis gelöscht: " + eventDetails.title);
        var customerName = extractName(eventDetails.description);
        var customerEmail = extractEmail(eventDetails.description);
        var dateTime = new Date(eventDetails.startTime);
        var dateStr = Utilities.formatDate(dateTime, Session.getScriptTimeZone(), "dd.MM.yyyy");
        var timeStr = Utilities.formatDate(dateTime, Session.getScriptTimeZone(), "HH:mm");
        sendCancellationEmail(eventDetails.title, customerEmail, customerName, dateStr, timeStr);
      }
    }
  } else {
    Logger.log("Keine gelöschten Termine vorhanden");
  }

  // Store the current event IDs and details for the next run
  PropertiesService.getScriptProperties().setProperty('eventIds', currentEventIds.join(','));
  for (var k = 0; k < events.length; k++) {
    PropertiesService.getScriptProperties().setProperty(events[k].getId(), JSON.stringify({
      title: events[k].getTitle(),
      description: events[k].getDescription(), // Store the entire description
      startTime: events[k].getStartTime().toISOString()
    }));
  }
}

function extractEmail(description) {
  var regex = /Email: ([^\s]+@[^\s]+)/;
  var match = description.match(regex);
  return match ? match[1] : null;
}

function extractName(description) {
  var regex = /Name: ([^ ]+)/;
  var match = description.match(regex);
  return match ? match[1] : "Kunde";
}

function sendCancellationEmail(title, email, name, dateStr, timeStr) {
  if (!email) {
    Logger.log("Keine E-Mail-Adresse gefunden.");
    return;
  }

  // Entferne Zeilenumbrüche und Wagenrückläufe
  title = title.replace(/\r?\n|\r/g, "").trim();
  dateStr = dateStr.replace(/\r?\n|\r/g, "").trim();
  timeStr = timeStr.replace(/\r?\n|\r/g, "").trim();

  var subject = "Deine Buchung wurde storniert";
  var body = "Hallo " + name + "\n\nDeine Buchung für die '" + title + "' am " + dateStr + " um " + timeStr + " wurde soeben storniert.\n\nLiebe Grüsse und bis bald,\n<YOUR-NAME>\n\n(Bitte antworte nicht auf diese E-mail)";

  // Send email using GmailApp
  GmailApp.sendEmail(email, subject, body, {
    from: calendarId,
    name: "<YOUR-NAME>"
  });

  Logger.log("E-Mail gesendet an: " + email);
}
