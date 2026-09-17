/**
 * English to Khmer Phonetic Transliteration and Pronunciation Guide
 * Provides Khmer phonetic reading (អានថា) and IPA for English vocabulary and expressions
 */

export interface PhoneticGuide {
  khmerPhonetic: string;
  ipa: string;
}

// Dictionary of high-frequency English words & expressions to Khmer phonetics and IPA
export const PHONETIC_DICTIONARY: Record<string, PhoneticGuide> = {
  // Greetings & Basics
  'hello': { khmerPhonetic: 'ហឺឡូ', ipa: '/həˈloʊ/' },
  'hi': { khmerPhonetic: 'ហាយ', ipa: '/haɪ/' },
  'good morning': { khmerPhonetic: 'ហ្គូដ ម័រនីង', ipa: '/ɡʊd ˈmɔːrnɪŋ/' },
  'good afternoon': { khmerPhonetic: 'ហ្គូដ អាហ្វធើនូន', ipa: '/ɡʊd ˌæftərˈnuːn/' },
  'good evening': { khmerPhonetic: 'ហ្គូដ អ៊ីវនីង', ipa: '/ɡʊd ˈiːvnɪŋ/' },
  'goodbye': { khmerPhonetic: 'ហ្គូដបាយ', ipa: '/ɡʊdˈbaɪ/' },
  'bye': { khmerPhonetic: 'បាយ', ipa: '/baɪ/' },
  'see you': { khmerPhonetic: 'ស៊ី យូ', ipa: '/siː juː/' },
  'see you later': { khmerPhonetic: 'ស៊ី យូ ឡេធ័រ', ipa: '/siː juː ˈleɪtər/' },
  'thank you': { khmerPhonetic: 'ថេនឃ្យូ', ipa: '/θæŋk juː/' },
  'thanks': { khmerPhonetic: 'ថេនស៍', ipa: '/θæŋks/' },
  'you are welcome': { khmerPhonetic: 'យូ អ៊ើ វេលខាំ', ipa: '/juː ɑːr ˈwɛlkəm/' },
  'welcome': { khmerPhonetic: 'វេលខាំ', ipa: '/ˈwɛlkəm/' },
  'please': { khmerPhonetic: 'ភ្លីស', ipa: '/pliːz/' },
  'sorry': { khmerPhonetic: 'សូរី', ipa: '/ˈsɒri/' },
  'excuse me': { khmerPhonetic: 'អ៊ិកស្យូស មី', ipa: '/ɪkˈskjuːz miː/' },
  'yes': { khmerPhonetic: 'យេស', ipa: '/jɛs/' },
  'no': { khmerPhonetic: 'ណូ', ipa: '/noʊ/' },
  'okay': { khmerPhonetic: 'អូខេ', ipa: '/oʊˈkeɪ/' },
  'ok': { khmerPhonetic: 'អូខេ', ipa: '/oʊˈkeɪ/' },

  // Questions & Conversational Phrases
  'how are you': { khmerPhonetic: 'ហៅ អ៊ើ យូ', ipa: '/haʊ ɑːr juː/' },
  'i am fine': { khmerPhonetic: 'អាយ អែម ហ្វាញ', ipa: '/aɪ æm faɪn/' },
  'nice to meet you': { khmerPhonetic: 'ណាយស៍ ធូ មីត យូ', ipa: '/naɪs tu miːt juː/' },
  'where are you from': { khmerPhonetic: 'វែរ អ៊ើ យូ ហ្វ្រម', ipa: '/wɛər ɑːr juː frɒm/' },
  'i am from cambodia': { khmerPhonetic: 'អាយ អែម ហ្វ្រម ខេមបូឌា', ipa: '/aɪ æm frɒm kæmˈboʊdiə/' },
  'what is your name': { khmerPhonetic: 'វ៉ាត់ អ៊ីស យ័រ ណេម', ipa: '/wɒt ɪz jɔːr neɪm/' },
  'my name is': { khmerPhonetic: 'ម៉ាយ ណេម អ៊ីស', ipa: '/maɪ neɪm ɪz/' },
  'how old are you': { khmerPhonetic: 'ហៅ អូលដ៍ អ៊ើ យូ', ipa: '/haʊ oʊld ɑːr juː/' },
  'how much': { khmerPhonetic: 'ហៅ ម៉ាត់ឆ៍', ipa: '/haʊ mʌtʃ/' },
  'how much is this': { khmerPhonetic: 'ហៅ ម៉ាត់ឆ៍ អ៊ីស ឌីស', ipa: '/haʊ mʌtʃ ɪz ðɪs/' },
  'what': { khmerPhonetic: 'វ៉ាត់', ipa: '/wɒt/' },
  'where': { khmerPhonetic: 'វែរ', ipa: '/wɛər/' },
  'when': { khmerPhonetic: 'វ៉េន', ipa: '/wɛn/' },
  'why': { khmerPhonetic: 'វ៉ាយ', ipa: '/waɪ/' },
  'how': { khmerPhonetic: 'ហៅ', ipa: '/haʊ/' },
  'who': { khmerPhonetic: 'ហ៊ូ', ipa: '/huː/' },

  // People, Roles & Family
  'friend': { khmerPhonetic: 'ហ្វ្រេនដ៍', ipa: '/frɛnd/' },
  'teacher': { khmerPhonetic: 'ធីឆ័រ', ipa: '/ˈtiːtʃər/' },
  'student': { khmerPhonetic: 'ស្ទូដិន', ipa: '/ˈstjuːdənt/' },
  'doctor': { khmerPhonetic: 'ដុកទ័រ', ipa: '/ˈdɒktər/' },
  'nurse': { khmerPhonetic: 'ណឺស', ipa: '/nɜːrs/' },
  'family': { khmerPhonetic: 'ហ្វេមីលី', ipa: '/ˈfæmɪli/' },
  'father': { khmerPhonetic: 'ហ្វាដឌ័រ', ipa: '/ˈfɑːðər/' },
  'mother': { khmerPhonetic: 'ម៉ាដឌ័រ', ipa: '/ˈmʌðər/' },
  'brother': { khmerPhonetic: 'ប្រាដឌ័រ', ipa: '/ˈbrʌðər/' },
  'sister': { khmerPhonetic: 'ស៊ីសស្ទ័រ', ipa: '/ˈsɪstər/' },
  'son': { khmerPhonetic: 'សាន់', ipa: '/sʌn/' },
  'daughter': { khmerPhonetic: 'ដូតធ័រ', ipa: '/ˈdɔːtər/' },

  // Daily Life, Actions & Objects
  'water': { khmerPhonetic: 'វ៉ត់ធ័រ', ipa: '/ˈwɔːtər/' },
  'food': { khmerPhonetic: 'ហ្វូត', ipa: '/fuːd/' },
  'eat': { khmerPhonetic: 'អ៊ីត', ipa: '/iːt/' },
  'drink': { khmerPhonetic: 'ឌ្រិងក៍', ipa: '/drɪŋk/' },
  'coffee': { khmerPhonetic: 'កាហ្វេ', ipa: '/ˈkɔːfi/' },
  'tea': { khmerPhonetic: 'ធី', ipa: '/tiː/' },
  'rice': { khmerPhonetic: 'រ៉ាយស៍', ipa: '/raɪs/' },
  'delicious': { khmerPhonetic: 'ឌីលីសសឹស', ipa: '/dɪˈlɪʃəs/' },
  'book': { khmerPhonetic: 'ប៊ុក', ipa: '/bʊk/' },
  'read': { khmerPhonetic: 'រីដ', ipa: '/riːd/' },
  'write': { khmerPhonetic: 'រ៉ាយត៍', ipa: '/raɪt/' },
  'speak': { khmerPhonetic: 'ស្ពីក', ipa: '/spiːk/' },
  'listen': { khmerPhonetic: 'លីសសឹន', ipa: '/ˈlɪsən/' },
  'study': { khmerPhonetic: 'ស្តាឌី', ipa: '/ˈstʌdi/' },
  'learn': { khmerPhonetic: 'លើន', ipa: '/lɜːrn/' },
  'school': { khmerPhonetic: 'ស្គូល', ipa: '/skuːl/' },
  'work': { khmerPhonetic: 'វើក', ipa: '/wɜːrk/' },
  'office': { khmerPhonetic: 'អូហ្វីស', ipa: '/ˈɒfɪs/' },
  'hospital': { khmerPhonetic: 'ហូស្ពីថល', ipa: '/ˈhɒspɪtəl/' },
  'time': { khmerPhonetic: 'ថាម', ipa: '/taɪm/' },
  'clock': { khmerPhonetic: 'ខ្លក់ក៍', ipa: '/klɒk/' },
  'today': { khmerPhonetic: 'ធូដេ', ipa: '/təˈdeɪ/' },
  'tomorrow': { khmerPhonetic: 'ធូម៉ូរ៉ូ', ipa: '/təˈmɒroʊ/' },
  'yesterday': { khmerPhonetic: 'យេសស្តឺដេ', ipa: '/ˈjɛstərdeɪ/' },
  'happy': { khmerPhonetic: 'ហេបភី', ipa: '/ˈhæpi/' },
  'sad': { khmerPhonetic: 'សែត', ipa: '/sæd/' },
  'tired': { khmerPhonetic: 'ថាយអឺដ', ipa: '/ˈtaɪərd/' },
  'beautiful': { khmerPhonetic: 'ប៊ីយូធីហ្វូល', ipa: '/ˈbjuːtɪfʊl/' },
  'love': { khmerPhonetic: 'ឡាហ្វ', ipa: '/lʌv/' },
  'money': { khmerPhonetic: 'ម៉ានី', ipa: '/ˈmʌni/' },
  'dollar': { khmerPhonetic: 'ដុល្លារ', ipa: '/ˈdɒlər/' },
  'bill': { khmerPhonetic: 'ប៊ីល', ipa: '/bɪl/' },
  'airport': { khmerPhonetic: 'អ៊ែរផត', ipa: '/ˈeərpɔːrt/' },
  'hotel': { khmerPhonetic: 'ហូថែល', ipa: '/hoʊˈtɛl/' },
  'passport': { khmerPhonetic: 'ផាសស្ព័ត', ipa: '/ˈpæspɔːrt/' },
  'ticket': { khmerPhonetic: 'ធីឃីត', ipa: '/ˈtɪkɪt/' },
  'flight': { khmerPhonetic: 'ហ្វ្លាយត៍', ipa: '/flaɪt/' },
};

/**
 * Get accurate Khmer phonetic transliteration and IPA notation for any English word or phrase
 */
export function getKhmerPhonetic(englishText: string): PhoneticGuide {
  if (!englishText) {
    return { khmerPhonetic: '', ipa: '' };
  }

  const clean = englishText.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '');

  // 1. Direct dictionary match
  if (PHONETIC_DICTIONARY[clean]) {
    return PHONETIC_DICTIONARY[clean];
  }

  // 2. Check each word in phrase
  const words = clean.split(/\s+/);
  if (words.length > 1) {
    const phonetics: string[] = [];
    const ipas: string[] = [];
    let hasKnown = false;

    for (const word of words) {
      if (PHONETIC_DICTIONARY[word]) {
        phonetics.push(PHONETIC_DICTIONARY[word].khmerPhonetic);
        ipas.push(PHONETIC_DICTIONARY[word].ipa.replace(/\//g, ''));
        hasKnown = true;
      } else {
        const approx = approximateKhmerPhonetic(word);
        phonetics.push(approx);
      }
    }

    if (hasKnown) {
      return {
        khmerPhonetic: phonetics.join(' '),
        ipa: ipas.length > 0 ? `/${ipas.join(' ')}/` : '',
      };
    }
  }

  // 3. Fallback to phonetic rule-based transliterator
  return {
    khmerPhonetic: approximateKhmerPhonetic(clean),
    ipa: '',
  };
}

/**
 * Rule-based English to Khmer phonetic approximation for words not in the dictionary
 */
function approximateKhmerPhonetic(word: string): string {
  if (!word) return '';

  let res = word;

  // Common endings
  res = res.replace(/tion$/i, 'ស្យិន');
  res = res.replace(/sion$/i, 'ហ្សិន');
  res = res.replace(/ment$/i, 'មឹន');
  res = res.replace(/able$/i, 'អេប៊ល');
  res = res.replace(/ing$/i, 'អ៊ីង');
  res = res.replace(/ed$/i, 'ដ៍');
  res = res.replace(/ly$/i, 'លី');
  res = res.replace(/er$/i, 'អ៊័រ');
  res = res.replace(/or$/i, 'អ៊័រ');

  // Letter cluster replacements
  res = res.replace(/ph/gi, 'ហ្វ');
  res = res.replace(/th/gi, 'ថ');
  res = res.replace(/sh/gi, 'ស្យ');
  res = res.replace(/ch/gi, 'ឆ');
  res = res.replace(/ck/gi, 'ក');
  res = res.replace(/ee/gi, 'អ៊ី');
  res = res.replace(/ea/gi, 'អ៊ី');
  res = res.replace(/oo/gi, 'អ៊ូ');
  res = res.replace(/ai/gi, 'អេ');
  res = res.replace(/ay/gi, 'អេ');
  res = res.replace(/ow/gi, 'អៅ');
  res = res.replace(/ou/gi, 'អៅ');

  // Single consonants
  res = res.replace(/b/gi, 'ប');
  res = res.replace(/c/gi, 'ខ');
  res = res.replace(/d/gi, 'ដ');
  res = res.replace(/f/gi, 'ហ្វ');
  res = res.replace(/g/gi, 'ហ្គ');
  res = res.replace(/h/gi, 'ហ');
  res = res.replace(/j/gi, 'ច');
  res = res.replace(/k/gi, 'ខ');
  res = res.replace(/l/gi, 'ល');
  res = res.replace(/m/gi, 'ម');
  res = res.replace(/n/gi, 'ន');
  res = res.replace(/p/gi, 'ផ');
  res = res.replace(/r/gi, 'រ');
  res = res.replace(/s/gi, 'ស');
  res = res.replace(/t/gi, 'ថ');
  res = res.replace(/v/gi, 'វ');
  res = res.replace(/w/gi, 'វ');
  res = res.replace(/x/gi, 'ក្ស');
  res = res.replace(/y/gi, 'យ');
  res = res.replace(/z/gi, 'ហ្ស');

  // Vowels
  res = res.replace(/a/gi, 'អា');
  res = res.replace(/e/gi, 'អេ');
  res = res.replace(/i/gi, 'អ៊ី');
  res = res.replace(/o/gi, 'អូ');
  res = res.replace(/u/gi, 'យូ');

  // Clean any residual English letters
  res = res.replace(/[a-zA-Z]/g, '');

  return res || 'អានជាភាសាអង់គ្លេស';
}
