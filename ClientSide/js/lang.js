const translations = {}; // Empty translations object

// Function to fetch JSON translations from a file
async function fetchTranslations(lang) {
  try {
    const response = await fetch(`./json/${lang}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching translations for ${lang}:`, error);
    return {};
  }
}

// Function to change language
async function changeLanguage(lang) {
  // Fetch translations for the selected language
  const langTranslations = await fetchTranslations(lang);

  document.querySelectorAll('[data-lang]').forEach(element => {
    const key = element.dataset.lang;
    // Use the translated value if available, otherwise use the default value
    const translatedValue = langTranslations[key] || translations['en'][key];
    if (translatedValue !== undefined) {
      element.textContent = translatedValue;
    }
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  // Set up translations for default language (English)
  translations['en'] = {};

  let currentLanguage = 'en';

  // Change language to the user's preference if available
  const userLanguage = navigator.language.split('-')[0];
  if (translations[userLanguage]) {
    currentLanguage = userLanguage;
  }

  // Change language to the default language
  await changeLanguage(currentLanguage);

  document.querySelectorAll('#languageSwitcher a').forEach(link => {
    link.addEventListener('click', async function (event) {
      event.preventDefault();
      const selectedLanguage = this.dataset.lang;
      await changeLanguage(selectedLanguage);
    });
  });
});
