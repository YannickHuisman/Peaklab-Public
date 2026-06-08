/**
 * Dynamic translation system.
 * Dutch text is the key — no abstract keys needed.
 * Usage: t('Instellingen') → 'Settings' when language is 'en'
 */

const nl_to_en: Record<string, string> = {
  // Nav
  Dashboard: 'Dashboard',
  Performance: 'Performance',
  Biomarkers: 'Biomarkers',
  Partners: 'Partners',
  Community: 'Community',
  Profiel: 'Profile',
  Instellingen: 'Settings',
  Uitloggen: 'Log out',

  // Page headers
  'Jouw gezondheidsoverzicht': 'Your health overview',
  'Performance Profiel': 'Performance Profile',
  'Vul je gegevens in voor gepersonaliseerde performance tips':
    'Fill in your details for personalised performance tips',
  'Performance Dashboard': 'Performance Dashboard',
  'Jouw gepersonaliseerde performance overzicht': 'Your personalised performance overview',
  'Bekijk en analyseer je bloedwaarden': 'View and analyse your blood values',
  'Ontdek onze samenwerkingspartners': 'Discover our partners',
  'Binnenkort beschikbaar': 'Coming soon',
  'Mijn Profiel': 'My Profile',
  'Beheer je persoonlijke gegevens': 'Manage your personal details',
  'Beheer jouw taal, privacy en accountinstellingen':
    'Manage your language, privacy and account settings',

  // Settings sections
  'Taal & Regio': 'Language & Region',
  Privacy: 'Privacy',
  Meldingen: 'Notifications',
  'AI Assistent': 'AI Assistant',
  'Account & Beveiliging': 'Account & Security',

  // Settings - Language
  Taal: 'Language',
  'Kies de taal voor de interface.': 'Choose the interface language.',
  Regio: 'Region',
  'Eenheden & Opmaak': 'Units & Format',
  'Pas meetstelsels en datumopmaak aan.': 'Adjust measurement systems and date format.',
  Maatstelsel: 'Measurement system',
  'Metrisch (kg, cm)': 'Metric (kg, cm)',
  'Imperiaal (lbs, inch)': 'Imperial (lbs, inch)',
  Datumopmaak: 'Date format',
  Weergave: 'Appearance',
  'Kies het uiterlijk van de interface.': 'Choose the look of the interface.',
  Thema: 'Theme',
  Licht: 'Light',
  Donker: 'Dark',
  Systeemvoorkeur: 'System preference',

  // Settings - Privacy
  Gegevensgebruik: 'Data usage',
  'Beheer hoe jouw gegevens worden gebruikt binnen het platform.':
    'Manage how your data is used within the platform.',
  'Analytische cookies': 'Analytics cookies',
  'Sta toe dat wij anonieme gebruiksdata verzamelen om het platform te verbeteren.':
    'Allow us to collect anonymous usage data to improve the platform.',
  'Gepersonaliseerde aanbevelingen': 'Personalised recommendations',
  'Gebruik jouw gezondheidsdata voor persoonlijke inzichten en aanbevelingen.':
    'Use your health data for personal insights and recommendations.',
  'Gegevens delen met partners': 'Share data with partners',
  'Sta geanonimiseerde gegevens toe te delen met PeakLab-partners voor onderzoek.':
    'Allow anonymised data to be shared with PeakLab partners for research.',
  Zichtbaarheid: 'Visibility',
  'Bepaal wie jouw activiteit kan zien.': 'Choose who can see your activity.',
  Activiteitszichtbaarheid: 'Activity visibility',
  'Privé (alleen jij)': 'Private (only you)',
  Vrienden: 'Friends',
  Openbaar: 'Public',

  // Settings - Notifications
  'E-mailmeldingen': 'Email notifications',
  'Kies welke e-mails je wilt ontvangen.': 'Choose which emails you want to receive.',
  'Wekelijks rapport': 'Weekly report',
  'Overzicht van jouw voortgang elke week.': 'Summary of your progress every week.',
  'Nieuwe testresultaten': 'New test results',
  'Ontvang een melding zodra nieuwe bloedresultaten beschikbaar zijn.':
    'Get notified when new blood results are available.',
  Afspraakherinneringen: 'Appointment reminders',
  'Ontvang herinneringen voor geplande afspraken.': 'Receive reminders for scheduled appointments.',
  Pushmeldingen: 'Push notifications',
  'Beheer meldingen op je apparaat.': 'Manage notifications on your device.',
  'Nieuwe resultaten': 'New results',
  'Direct een pushmelding bij nieuwe bloedresultaten.':
    'Instant push notification for new blood results.',
  'Community-updates': 'Community updates',
  'Reacties en vermeldingen in de community.': 'Replies and mentions in the community.',
  'Marketing & aanbiedingen': 'Marketing & offers',
  'Nieuws, promoties en productaanbevelingen van PeakLab.':
    'News, promotions and product recommendations from PeakLab.',

  // Settings - AI
  'AI-context': 'AI context',
  'Bepaal welke gegevens de AI-assistent mag gebruiken voor persoonlijke antwoorden.':
    'Choose which data the AI assistant can use for personalised answers.',
  'Deel je leeftijd, geslacht, sport en doelen met de AI.':
    'Share your age, gender, sport and goals with the AI.',
  'Deel je bloedwaarden en referentiewaarden met de AI.':
    'Share your blood values and reference ranges with the AI.',
  'Performance plan': 'Performance plan',
  'Deel je geselecteerde performance tips met de AI.':
    'Share your selected performance tips with the AI.',

  // Settings - Account
  Wachtwoord: 'Password',
  'Wijzig je wachtwoord of stel tweefactorauthenticatie in.':
    'Change your password or set up two-factor authentication.',
  'Wachtwoord wijzigen': 'Change password',
  'Verbonden accounts': 'Connected accounts',
  'Koppel externe platforms voor extra gezondheidsdata.':
    'Link external platforms for additional health data.',
  Koppelen: 'Connect',
  Ontkoppelen: 'Disconnect',
  'Gegevens exporteren': 'Export data',
  'Download een kopie van al jouw PeakLab-data.': 'Download a copy of all your PeakLab data.',
  'Gegevens exporteren (CSV)': 'Export data (CSV)',
  Gevarenzone: 'Danger zone',
  'Het verwijderen van je account is onomkeerbaar. Alle data wordt permanent gewist.':
    'Deleting your account is irreversible. All data will be permanently removed.',
  'Account verwijderen': 'Delete account',

  // Common
  'Opslaan...': 'Saving...',
  'Laden...': 'Loading...',
  geselecteerd: 'selected',
  'Bekijk bron': 'View source',

  // Performance tips
  'Jouw Performance Tips': 'Your Performance Tips',
  'Selecteer de tips die je wilt toepassen in je performance plan':
    'Select the tips you want to apply to your performance plan',
  'Tips Opslaan': 'Save Tips',

  // Regions
  Nederland: 'Netherlands',
  België: 'Belgium',
  Duitsland: 'Germany',
  'Verenigd Koninkrijk': 'United Kingdom',
  'Verenigde Staten': 'United States',

  // Auto-generated by codemod
  'Laatste test': 'Last test',
  'Volgende test': 'Next test',
  'Geen afspraak': 'No appointment',
  dag: 'day',
  dagen: 'days',
  Bekijken: 'View',
  Filter: 'Filter',
  Vorige: 'Previous',
  Volgende: 'Next',
  Annuleren: 'Cancel',
  Bewerken: 'Edit',
  'Uploaden...': 'Uploading...',
  Verwijderen: 'Delete',
  Beheren: 'Manage',
  Bevestigen: 'Confirm',
  'Bezig...': 'Busy...',
  Aanmaken: 'Create',
  Geen: 'None',
  'Niet opgegeven': 'Not specified',
  'Profiel bijgewerkt': 'Profile updated',
  'Profiel bijwerken mislukt': 'Profile update failed',
  'Profiel laden mislukt': 'Profile loading failed',
  'Profielfoto bijgewerkt': 'Profile photo updated',
  'Profielfoto verwijderd': 'Profile photo deleted',
  Actief: 'Active',
  'E-mail': 'Email',
  'Lid sinds': 'Member since',
  Gewicht: 'Weight',
  Sport: 'Sport',
  'Persoonlijke gegevens': 'Personal details',
  'Volledige naam': 'Full name',
  'Jouw naam': 'Your name',
  Gebruikersnaam: 'Username',
  Geboortedatum: 'Date of birth',
  'Selecteer geslacht': 'Select gender',
  Website: 'Website',
  'Sport & Gezondheid': 'Sport & Health',
  'Gewicht in kg': 'Weight in kg',
  Sporttype: 'Sport type',
  'Selecteer sport': 'Select sport',
  Sportfrequentie: 'Sport frequency',
  'Selecteer frequentie': 'Select frequency',
  Profielfoto: 'Profile photo',
  'Foto wijzigen': 'Change photo',
  'Foto uploaden': 'Upload photo',
  'Foto verwijderen': 'Delete photo',
  'Max 2MB, JPG of PNG': 'Max 2MB, JPG or PNG',
  "Alle regio's": 'All regions',
  Specialisatie: 'Specialization',
  'Alle specialisaties': 'All specializations',
  'Geslacht trainer': 'Trainer gender',
  'Alle trainers': 'All trainers',
  'Er ging iets mis': 'Something went wrong',
  'Stel een vraag over je gezondheid': 'Ask a question about your health',
  'Nog geen berichten': 'No messages yet',
  'Typ je vraag...': 'Type your question...',
  'Alleen PDF-bestanden toegestaan': 'Only PDF files allowed',
  'Bestand is te groot (max 10MB)': 'File is too large (max 10MB)',
  'Upload mislukt': 'Upload failed',
  'Upload mislukt, probeer het opnieuw': 'Upload failed, please try again',
  'Bloedresultaten uploaden': 'Upload blood results',
  'Upload je bloedresultaten als PDF': 'Upload your blood results as PDF',
  'Sleep je PDF hierheen': 'Drop your PDF here',
  'Max 10MB per bestand': 'Max 10MB per file',
  'Selecteer PDF': 'Select PDF',
  'Mijn uploads': 'My uploads',
  'Nog geen uploads': 'No uploads yet',
  'PDF uploaden': 'Upload PDF',
  'Geen resultaten': 'No results',
  'Nieuwe afspraak': 'New appointment',
  'In afwachting': 'Pending',
  'In beoordeling': 'In review',
  Verwerkt: 'Processed',
  Afgewezen: 'Rejected',
  'Tips genereren...': 'Generating tips...',
  Compleet: 'Complete',
  Man: 'Male',
  Vrouw: 'Female',
  Anders: 'Other',
  Leeftijd: 'Age',
  Geslacht: 'Gender',
  Lengte: 'Height',
  BMI: 'BMI',
  'Doelen & Niveau': 'Goals & Level',
  'Primair doel': 'Primary goal',
  Tijdlijn: 'Timeline',
  'Huidig niveau': 'Current level',
  Training: 'Training',
  'Uren per week': 'Hours per week',
  'Intensieve sessies': 'Intense sessions',
  'Herstel & Beperkingen': 'Recovery & Limitations',
  Slaap: 'Sleep',
  Stress: 'Stress',
  Herstelmethoden: 'Recovery methods',
  Beperkingen: 'Limitations',
  Voeding: 'Nutrition',
  'Calorie-inname': 'Calorie intake',
  Voedingspatronen: 'Nutrition patterns',
  'Totaal getest': 'Total tested',
  'Geen bronnen': 'No sources',
  'Bron toevoegen': 'Add source',
  'URL of titel': 'URL or title',
  'Geen tips': 'No tips',
  'Tip toevoegen': 'Add tip',
  Algemeen: 'General',
  Kracht: 'Strength',
  Hardlopen: 'Running',
  'Records beheren': 'Manage records',
  'Trophy Case': 'Trophy Case',
  'Meest recent': 'Most recent',
  'Nog geen records': 'No records yet',
  'Record toevoegen': 'Add record',
  'Vul alle verplichte velden in': 'Please fill in all required fields',
  'Afspraak aangemaakt': 'Appointment created',
  'Afspraak aanmaken mislukt': 'Failed to create appointment',
  'Afspraak bijgewerkt': 'Appointment updated',
  'Afspraak bijwerken mislukt': 'Failed to update appointment',
  'Status wijzigen mislukt': 'Failed to change status',
  'Weet je zeker dat je deze afspraak wilt verwijderen?':
    'Are you sure you want to delete this appointment?',
  'Afspraak verwijderen mislukt': 'Failed to delete appointment',
  Afspraken: 'Appointments',
  'Beheer afspraken': 'Manage appointments',
  'Weet je zeker dat je de rol wilt wijzigen?': 'Are you sure you want to change the role?',

  // Lab management
  Inactief: 'Inactive',
  'Lab beheer': 'Lab management',
  'Beheer labs en hun biomarker referentiewaarden':
    'Manage labs and their biomarker reference values',
  'Lab toevoegen': 'Add lab',
  'Opnieuw proberen': 'Try again',
  'Lab bewerken': 'Edit lab',
  'Nieuw lab': 'New lab',
  Naam: 'Name',
  'Naam *': 'Name *',
  Beschrijving: 'Description',
  'bv. Synlab, Star-shl': 'e.g. Synlab, Star-shl',
  'Kan geen verbinding maken met de server': 'Cannot connect to the server',
  'Opslaan mislukt': 'Save failed',
  'Weet je zeker dat je dit lab wilt verwijderen?': 'Are you sure you want to delete this lab?',
  'Verwijderen mislukt. Dit lab heeft mogelijk nog referenties.':
    'Delete failed. This lab may still have references.',
  'Verwijderen mislukt': 'Delete failed',
  'Geen referentiewaarden geconfigureerd voor dit lab.':
    'No reference values configured for this lab.',
  'Referentie toevoegen': 'Add reference',
  'Selecteer biomarker': 'Select biomarker',
  'Biomarker *': 'Biomarker *',
  'Eenheid *': 'Unit *',
  'bv. mmol/L, g/dL': 'e.g. mmol/L, g/dL',
  'Min moet kleiner zijn dan max': 'Min must be less than max',
  'Max moet groter zijn dan min': 'Max must be greater than min',

  // Upload management
  'Status bijwerken mislukt': 'Failed to update status',
  'Kan bestand niet openen': 'Cannot open file',
  Gebruiker: 'User',
  'Gebruiker:': 'User:',
  Bestand: 'File',
  'Bestand:': 'File:',
  Datum: 'Date',
  'Geüpload:': 'Uploaded:',
  'Status:': 'Status:',
  'PDF openen': 'Open PDF',
  'Admin notities': 'Admin notes',
  'Voeg notities toe...': 'Add notes...',
  'Status bijwerken': 'Update status',
  'Upload beheer': 'Upload management',
  'Bekijk en verwerk bloedresultaat uploads van gebruikers':
    'View and process blood result uploads from users',
  Alle: 'All',
  Onbekend: 'Unknown',

  // User management
  Overzicht: 'Overview',
  Panelbeheer: 'Panel management',
  Bloedtests: 'Blood tests',
  'Beheerder Rechten': 'Administrator Rights',
  'Maak Admin': 'Make Admin',
  'Verwijder Admin Rechten': 'Remove Admin Rights',
  Panelkoppeling: 'Panel assignment',
  'Huidig panel:': 'Current panel:',
  'Panelcode:': 'Panel code:',
  'Geen panel gekoppeld': 'No panel assigned',
  'Bloedtests samenvatting': 'Blood tests summary',
  'Totale tests': 'Total tests',
  'Biomarker resultaten': 'Biomarker results',
  'Voltooide tests': 'Completed tests',
  'Er is een fout opgetreden bij het wijzigen van de rol.':
    'An error occurred while changing the role.',

  // Community
  'We bouwen aan een platform waar sporters, biopmarkers en prestaties samenkomen.':
    'We are building a platform where athletes, biomarkers and performance come together.',
  'Verwacht in Q3 2026': 'Expected in Q3 2026',

  // Biomarkers
  'biomarkers beschikbaar': 'biomarkers available',
  Alles: 'All',
  'Deep Research': 'Deep Research',

  // Deep Research
  'Jouw uitgebreide biomarker analyse': 'Your comprehensive biomarker analysis',
  'Ontgrendel diepgaande inzichten uit je bloedwaarden':
    'Unlock deep insights from your blood values',
  'Deep Research AI Report': 'Deep Research AI Report',
  'Ontvang een uitgebreide analyse van al je biomarkers. We groeperen je data per domein, berekenen belangrijke verhoudingen en genereren een persoonlijk verhaal over wat jouw bloedwaarden betekenen voor je performance.':
    'Receive a comprehensive analysis of all your biomarkers. We group your data by domain, calculate key ratios and generate a personal narrative about what your blood values mean for your performance.',
  Domeinanalyse: 'Domain analysis',
  "Ratio's & verbanden": 'Ratios & connections',
  Actieplan: 'Action plan',
  'Genereer Deep Research': 'Generate Deep Research',
  'Beschikbaar vanaf': 'Available from',
  'Analyse wordt gegenereerd': 'Analysis is being generated',
  'We analyseren je biomarkers, berekenen verhoudingen en genereren een persoonlijk rapport. Dit kan tot 60 seconden duren.':
    'We are analysing your biomarkers, calculating ratios and generating a personal report. This may take up to 60 seconds.',
  'Deep Research Report': 'Deep Research Report',
  Samenvatting: 'Summary',
  "Ratio's & Verbanden": 'Ratios & Connections',
  'Performance Impact': 'Performance Impact',
  'Sterke punten': 'Strengths',
  Verbeterpunten: 'Areas for improvement',
  Aanbevelingen: 'Recommendations',
  'Nieuw rapport genereren': 'Generate new report',
  'Volgend rapport beschikbaar vanaf': 'Next report available from',
  optimaal: 'optimal',

  // Partners
  vanaf: 'from',
  'Trainers, experts en merken': 'Trainers, experts and brands',
  'Er ging iets mis bij het laden van de partners.': 'Something went wrong loading the partners.',
  'Geen partners gevonden met de huidige filters.': 'No partners found with the current filters.',

  // Navbar
  'Admin Panel': 'Admin Panel',

  // Performance steps
  'Beperkingen & Klachten': 'Limitations & Complaints',
  'Selecteer wat er van toepassing is op dit moment': 'Select what applies at the moment',
  'Herstel & Welzijn': 'Recovery & Wellbeing',
  'Hoe ziet jouw herstel eruit?': 'What does your recovery look like?',
  'Slaap per nacht': 'Sleep per night',
  'Gemiddeld aantal uren slaap per nacht': 'Average hours of sleep per night',
  Stressniveau: 'Stress level',
  'Hoe stressvol is jouw leven gemiddeld?': 'How stressful is your life on average?',
  Laag: 'Low',
  Matig: 'Moderate',
  Hoog: 'High',
  Extreem: 'Extreme',
  'Welke herstelmethoden pas jij toe?': 'Which recovery methods do you use?',
  'Vertel ons over jouw voedingsgewoonten': 'Tell us about your nutritional habits',
  'Dagelijkse calorie-inname': 'Daily calorie intake',
  'Schatting van je gemiddelde dagelijkse calorie-inname':
    'Estimate of your average daily calorie intake',
  Voedingspatroon: 'Nutrition pattern',
  'Selecteer maximaal 2 patronen die het beste bij jou passen':
    'Select up to 2 patterns that best suit you',
  'patronen geselecteerd': 'patterns selected',
  Trainingsbelasting: 'Training load',
  'Hoe ziet jouw trainingsschema eruit?': 'What does your training schedule look like?',
  'Trainingsuren per week': 'Training hours per week',
  'Totaal aantal uren sport per week': 'Total hours of sport per week',
  'Intensieve sessies per week': 'Intense sessions per week',
  'Aantal sessies met hoge intensiteit per week': 'Number of high-intensity sessions per week',
  'Let op: meer dan 3 intensieve sessies per week kan overtraining veroorzaken':
    'Warning: more than 3 intense sessions per week can cause overtraining',
  'Beschrijf je huidige niveau per doel': 'Describe your current level per goal',
  'Beschrijf je huidige niveau voor dit doel': 'Describe your current level for this goal',
  'Secundair doel': 'Secondary goal',
  'Beschrijf je huidige niveau voor dit nevendoel':
    'Describe your current level for this secondary goal',
};

export type SupportedLanguage = 'nl' | 'en';

export function translate(text: string, language: SupportedLanguage): string {
  if (language === 'nl') return text;

  return nl_to_en[text] ?? text;
}
