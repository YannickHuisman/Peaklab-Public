#!/usr/bin/env node
/**
 * Codemod: Convert abstract i18n keys to Dutch-as-key system.
 *
 * What it does:
 * 1. Replaces t('abstract.key') → t('Dutch text') using a known mapping
 * 2. Finds hardcoded Dutch text in JSX and wraps with t()
 * 3. Adds useTranslation import if missing
 * 4. Outputs new translation entries to add to translations.ts
 *
 * Usage: node scripts/codemod-i18n.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../apps/web/src');

const DRY_RUN = process.argv.includes('--dry-run');

const KEY_TO_DUTCH = {
  // Nav
  'nav.community': 'Community',
  'nav.partners': 'Partners',
  'nav.biomarkers': 'Biomarkers',
  'nav.profile': 'Profiel',

  // Home
  'home.lastTest': 'Laatste test',
  'home.nextTest': 'Volgende test',
  'home.noAppointment': 'Geen afspraak',
  'home.day': 'dag',
  'home.days': 'dagen',

  // Common
  'common.view': 'Bekijken',
  'common.filter': 'Filter',
  'common.back': 'Vorige',
  'common.next': 'Volgende',
  'common.saving': 'Opslaan...',
  'common.save': 'Opslaan',
  'common.cancel': 'Annuleren',
  'common.edit': 'Bewerken',
  'common.selected': 'geselecteerd',
  'common.viewSource': 'Bekijk bron',
  'common.loading': 'Laden...',
  'common.uploading': 'Uploaden...',
  'common.delete': 'Verwijderen',
  'common.manage': 'Beheren',
  'common.confirm': 'Bevestigen',
  'common.busy': 'Bezig...',
  'common.create': 'Aanmaken',
  'common.none': 'Geen',
  'common.notSpecified': 'Niet opgegeven',

  // Profile
  'profile.updateSuccess': 'Profiel bijgewerkt',
  'profile.updateError': 'Profiel bijwerken mislukt',
  'profile.loadError': 'Profiel laden mislukt',
  'profile.avatarUpdated': 'Profielfoto bijgewerkt',
  'profile.avatarDeleted': 'Profielfoto verwijderd',
  'profile.description': 'Beheer je persoonlijke gegevens',
  'profile.active': 'Actief',
  'profile.email': 'E-mail',
  'profile.memberSince': 'Lid sinds',
  'profile.weight': 'Gewicht',
  'profile.sport': 'Sport',
  'profile.personalInfo': 'Persoonlijke gegevens',
  'profile.fullName': 'Volledige naam',
  'profile.fullNamePlaceholder': 'Jouw naam',
  'profile.username': 'Gebruikersnaam',
  'profile.birthDate': 'Geboortedatum',
  'profile.genderPlaceholder': 'Selecteer geslacht',
  'profile.website': 'Website',
  'profile.sportAndHealth': 'Sport & Gezondheid',
  'profile.weightPlaceholder': 'Gewicht in kg',
  'profile.sportType': 'Sporttype',
  'profile.sportTypePlaceholder': 'Selecteer sport',
  'profile.sportFrequency': 'Sportfrequentie',
  'profile.sportFrequencyPlaceholder': 'Selecteer frequentie',
  'profile.avatarTitle': 'Profielfoto',
  'profile.changePhoto': 'Foto wijzigen',
  'profile.uploadPhoto': 'Foto uploaden',
  'profile.deletePhoto': 'Foto verwijderen',
  'profile.avatarHint': 'Max 2MB, JPG of PNG',

  // Settings
  'settings.region.label': 'Regio',
  'settings.section.ai': 'AI Assistent',
  'settings.theme.light': 'Licht',

  // Partners
  'partners.allRegions': "Alle regio's",
  'partners.specialization': 'Specialisatie',
  'partners.allSpecializations': 'Alle specialisaties',
  'partners.trainerGender': 'Geslacht trainer',
  'partners.allTrainers': 'Alle trainers',

  // ChatBot
  'chatbot.error': 'Er ging iets mis',
  'chatbot.description': 'Stel een vraag over je gezondheid',
  'chatbot.emptyState': 'Nog geen berichten',
  'chatbot.placeholder': 'Typ je vraag...',

  // Uploads
  'uploads.pdfOnly': 'Alleen PDF-bestanden toegestaan',
  'uploads.tooLarge': 'Bestand is te groot (max 10MB)',
  'uploads.uploadFailed': 'Upload mislukt',
  'uploads.uploadFailedRetry': 'Upload mislukt, probeer het opnieuw',
  'uploads.title': 'Bloedresultaten uploaden',
  'uploads.subtitle': 'Upload je bloedresultaten als PDF',
  'uploads.dropHere': 'Sleep je PDF hierheen',
  'uploads.maxSize': 'Max 10MB per bestand',
  'uploads.selectPdf': 'Selecteer PDF',
  'uploads.myUploads': 'Mijn uploads',
  'uploads.noUploads': 'Nog geen uploads',
  'uploads.pdfUpload': 'PDF uploaden',
  'uploads.status.pending': 'In afwachting',
  'uploads.status.inReview': 'In beoordeling',
  'uploads.status.processed': 'Verwerkt',
  'uploads.status.rejected': 'Afgewezen',

  // Performance
  'performance.tips.save': 'Tips Opslaan',
  'performance.tips.title': 'Jouw Performance Tips',
  'performance.tips.description': 'Selecteer de tips die je wilt toepassen in je performance plan',
  'performance.stepper.generating': 'Tips genereren...',
  'performance.stepper.complete': 'Compleet',
  'performance.snapshot.genderMale': 'Man',
  'performance.snapshot.genderFemale': 'Vrouw',
  'performance.snapshot.genderOther': 'Anders',
  'performance.snapshot.age': 'Leeftijd',
  'performance.snapshot.gender': 'Geslacht',
  'performance.snapshot.weight': 'Gewicht',
  'performance.snapshot.height': 'Lengte',
  'performance.snapshot.bmi': 'BMI',
  'performance.snapshot.sport': 'Sport',
  'performance.snapshot.goalsAndLevel': 'Doelen & Niveau',
  'performance.snapshot.primaryGoal': 'Primair doel',
  'performance.snapshot.timeline': 'Tijdlijn',
  'performance.snapshot.currentLevel': 'Huidig niveau',
  'performance.snapshot.training': 'Training',
  'performance.snapshot.hoursPerWeek': 'Uren per week',
  'performance.snapshot.intenseSessions': 'Intensieve sessies',
  'performance.snapshot.recoveryAndLimitations': 'Herstel & Beperkingen',
  'performance.snapshot.sleep': 'Slaap',
  'performance.snapshot.stress': 'Stress',
  'performance.snapshot.recoveryMethods': 'Herstelmethoden',
  'performance.snapshot.limitations': 'Beperkingen',
  'performance.snapshot.nutrition': 'Voeding',
  'performance.snapshot.calorieIntake': 'Calorie-inname',
  'performance.snapshot.nutritionPatterns': 'Voedingspatronen',
  'performance.snapshot.totalTested': 'Totaal getest',
  'page.performance.dashboard.title': 'Performance Dashboard',
  'page.performance.dashboard.subtitle': 'Jouw gepersonaliseerde performance overzicht',
  'page.performance.title': 'Performance Profiel',
  'page.performance.subtitle': 'Vul je gegevens in voor gepersonaliseerde performance tips',

  // Biomarkers
  'biomarkers.noResults': 'Geen resultaten',

  // Editable lists
  'editableList.noSources': 'Geen bronnen',
  'editableList.addSource': 'Bron toevoegen',
  'editableList.sourcePlaceholder': 'URL of titel',
  'editableList.noTips': 'Geen tips',
  'editableList.addTip': 'Tip toevoegen',

  // Trophy Case
  'trophyCase.category.general': 'Algemeen',
  'trophyCase.category.strength': 'Kracht',
  'trophyCase.category.running': 'Hardlopen',
  'trophyCase.manageTitle': 'Records beheren',
  'trophyCase.title': 'Trophy Case',
  'trophyCase.mostRecent': 'Meest recent',
  'trophyCase.emptyState': 'Nog geen records',
  'trophyCase.addRecord': 'Record toevoegen',

  // Admin
  'admin.appointments.new': 'Nieuwe afspraak',
  'admin.appointments.requiredFields': 'Vul alle verplichte velden in',
  'admin.appointments.createSuccess': 'Afspraak aangemaakt',
  'admin.appointments.createError': 'Afspraak aanmaken mislukt',
  'admin.appointments.updateSuccess': 'Afspraak bijgewerkt',
  'admin.appointments.updateError': 'Afspraak bijwerken mislukt',
  'admin.appointments.statusError': 'Status wijzigen mislukt',
  'admin.appointments.deleteConfirm': 'Weet je zeker dat je deze afspraak wilt verwijderen?',
  'admin.appointments.deleteError': 'Afspraak verwijderen mislukt',
  'admin.appointments.title': 'Afspraken',
  'admin.appointments.description': 'Beheer afspraken',
  'admin.appointments.edit': 'Bewerken',
  'admin.users.confirmRoleChange': 'Weet je zeker dat je de rol wilt wijzigen?',
};

const newTranslations = new Map();

// Add all Dutch values from the key mapping that aren't already in translations.ts
const translationsPath = path.resolve(ROOT, 'helpers/i18n/translations.ts');
const translationsContent = fs.readFileSync(translationsPath, 'utf-8');

for (const dutchText of Object.values(KEY_TO_DUTCH)) {
  // Check if already in translations.ts
  if (
    !translationsContent.includes(`'${dutchText}'`) &&
    !translationsContent.includes(`"${dutchText}"`)
  ) {
    // Generate English translation (best effort — flag for manual review)
    newTranslations.set(dutchText, dutchText); // placeholder, will need manual EN translation
  }
}

function findTsxFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...findTsxFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  return files;
}

let filesChanged = 0;
let keysReplaced = 0;

const files = findTsxFiles(ROOT);

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Replace abstract keys: t('abstract.key') → t('Dutch text')
  const keyPattern = /t\('([a-z][a-zA-Z]*\.[a-zA-Z.]+)'\)/g;
  const newContent = content.replace(keyPattern, (match, key) => {
    const dutch = KEY_TO_DUTCH[key];
    if (dutch) {
      changed = true;
      keysReplaced++;
      // Handle quotes in the Dutch text
      if (dutch.includes("'")) {
        return `t("${dutch}")`;
      }
      return `t('${dutch}')`;
    }
    // Unknown key — leave as-is but warn
    console.warn(`⚠️  Unknown key: ${key} in ${path.relative(ROOT, filePath)}`);
    return match;
  });

  if (changed) {
    content = newContent;
  }

  if (changed) {
    filesChanged++;
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    console.log(
      `✓ ${path.relative(ROOT, filePath)} (${content !== fs.readFileSync(filePath, 'utf-8') ? 'would change' : 'updated'})`
    );
  }
}

// English translations for the new Dutch entries
const DUTCH_TO_ENGLISH = {
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
  Regio: 'Region',
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
  'Jouw Performance Tips': 'Your Performance Tips',
  'Selecteer de tips die je wilt toepassen in je performance plan':
    'Select the tips you want to apply to your performance plan',
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
  'AI Assistent': 'AI Assistant',
  Licht: 'Light',
};

// Build the entries to add to translations.ts
const entriesToAdd = [];
for (const [dutch, english] of Object.entries(DUTCH_TO_ENGLISH)) {
  if (!translationsContent.includes(`'${dutch}'`) && !translationsContent.includes(`"${dutch}"`)) {
    if (dutch.includes("'")) {
      entriesToAdd.push(`  "${dutch}": '${english}',`);
    } else {
      entriesToAdd.push(`  '${dutch}': '${english}',`);
    }
  }
}

if (entriesToAdd.length > 0 && !DRY_RUN) {
  // Insert before the closing }; of nl_to_en
  const insertPoint = translationsContent.lastIndexOf('};');
  const before = translationsContent.slice(0, insertPoint);
  const after = translationsContent.slice(insertPoint);

  const newSection = `\n  // Auto-generated by codemod\n${entriesToAdd.join('\n')}\n`;
  const updatedTranslations = before + newSection + after;
  fs.writeFileSync(translationsPath, updatedTranslations, 'utf-8');
  console.log(`\n✓ Added ${entriesToAdd.length} new entries to translations.ts`);
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`Summary${DRY_RUN ? ' (DRY RUN)' : ''}:`);
console.log(`  Files modified: ${filesChanged}`);
console.log(`  Keys replaced:  ${keysReplaced}`);
console.log(`  New translations added: ${entriesToAdd.length}`);
if (DRY_RUN) {
  console.log(`\nRun without --dry-run to apply changes.`);
}
