function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const rawQuestions = [
  {
    question: "១. តើ ១ Byte (បៃ) ស្មើនឹងប៉ុន្មាន Bit (ប៊ីត)?",
    options: ["៤ ប៊ីត", "៨ ប៊ីត", "១៦ ប៊ីត", "៣២ ប៊ីត"],
    answer: "៨ ប៊ីត"
  },
  {
    question: "២. តើ ១ Megabyte (MB) ស្មើនឹងប៉ុន្មាន Kilobyte (KB)?",
    options: ["១០០០ KB", "១០២៤ KB", "១០៤៨ KB", "៥១២ KB"],
    answer: "១០២៤ KB"
  },
  {
    question: "៣. ក្នុងចំណោមទំហំផ្ទុកខាងក្រោម តើមួយណាមានទំហំធំជាងគេបង្អស់?",
    options: ["Megabyte (MB)", "Kilobyte (KB)", "Gigabyte (GB)", "Terabyte (TB)"],
    answer: "Terabyte (TB)"
  },
  {
    question: "៤. តើពាក្យពេញរបស់ USB គឺអ្វី?",
    options: ["Universal Serial Bus", "United Serial Bus", "Universal System Bus", "Utility Serial Bus"],
    answer: "Universal Serial Bus"
  },
  {
    question: "៥. តើកាតចងចាំ RAM មានមុខងារអ្វីនៅក្នុងកុំព្យូទ័រ?",
    options: [
      "ផ្ទុកទិន្នន័យជារៀងរហូតទោះបីជាបិទកុំព្យូទ័រក៏ដោយ",
      "ផ្ទុកទិន្នន័យបណ្តោះអាសន្ន ពេលកម្មវិធីកំពុងដំណើរការ",
      "គ្រប់គ្រងចរន្តអគ្គិសនីក្នុងកុំព្យូទ័រ",
      "បញ្ចេញសំឡេង និងរូបភាព"
    ],
    answer: "ផ្ទុកទិន្នន័យបណ្តោះអាសន្ន ពេលកម្មវិធីកំពុងដំណើរការ"
  },
  {
    question: "៦. តើឧបករណ៍មួយណាដែលប្រើសម្រាប់ផ្ទុកទិន្នន័យជាអចិន្ត្រៃយ៍ ទោះបីជាបិទកុំព្យូទ័រក៏ដោយ?",
    options: ["RAM", "Hard Disk Drive (HDD) ឬ Solid State Drive (SSD)", "CPU", "Power Supply"],
    answer: "Hard Disk Drive (HDD) ឬ Solid State Drive (SSD)"
  },
  {
    question: "៧. តើពាក្យពេញរបស់ VPN គឺអ្វី?",
    options: ["Visual Private Network", "Virtual Personal Network", "Virtual Private Network", "Viral Public Network"],
    answer: "Virtual Private Network"
  },
  {
    question: "៨. តើការប្រើប្រាស់ VPN ផ្តល់អត្ថប្រយោជន៍ចម្បងអ្វីខ្លះ?",
    options: [
      "ធ្វើឱ្យកុំព្យូទ័រដើរលឿនជាងមុន",
      "បង្កើនទំហំផ្ទុកនៅក្នុងកុំព្យូទ័រ",
      "ការពារសុវត្ថិភាពទិន្នន័យ និងលាក់អាសយដ្ឋាន IP ពេលប្រើប្រាស់អ៊ីនធឺណិត",
      "លុបមេរោគចេញពីកុំព្យូទ័រដោយស្វ័យប្រវត្តិ"
    ],
    answer: "ការពារសុវត្ថិភាពទិន្នន័យ និងលាក់អាសយដ្ឋាន IP ពេលប្រើប្រាស់អ៊ីនធឺណិត"
  },
  {
    question: "៩. តើអ្វីទៅជាមុខងារចម្បងរបស់ Router?",
    options: [
      "ស្កេនរកមេរោគក្នុងកុំព្យូទ័រ",
      "ភ្ជាប់បណ្តាញកុំព្យូទ័រ (Network) ចូលគ្នា និងបញ្ជូនទិន្នន័យទៅកាន់អ៊ីនធឺណិត",
      "បោះពុម្ពឯកសារចេញពីកុំព្យូទ័រ",
      "ផ្ទុកទិន្នន័យជំនួស Hard Disk"
    ],
    answer: "ភ្ជាប់បណ្តាញកុំព្យូទ័រ (Network) ចូលគ្នា និងបញ្ជូនទិន្នន័យទៅកាន់អ៊ីនធឺណិត"
  },
  {
    question: "១០. តើ LAN (Local Area Network) ជាអ្វី?",
    options: [
      "បណ្តាញកុំព្យូទ័រដែលតភ្ជាប់គ្នាក្នុងតំបន់តូចមួយ ដូចជាក្នុងអគារតែមួយ",
      "បណ្តាញកុំព្យូទ័រដែលតភ្ជាប់គ្នាទូទាំងពិភពលោក",
      "ខ្សែសម្រាប់សាកថ្មកុំព្យូទ័រយួរដៃ",
      "កម្មវិធីសម្រាប់លេងអ៊ីនធឺណិត"
    ],
    answer: "បណ្តាញកុំព្យូទ័រដែលតភ្ជាប់គ្នាក្នុងតំបន់តូចមួយ ដូចជាក្នុងអគារតែមួយ"
  },
  {
    question: "១១. តើម៉ាស៊ីនព្រីន (Printer) ចាត់ទុកជាឧបករណ៍ប្រភេទអ្វី?",
    options: ["Input Device", "Output Device", "Storage Device", "Processing Device"],
    answer: "Output Device"
  },
  {
    question: "១២. តើ Mouse និង Keyboard ចាត់ទុកជាឧបករណ៍ប្រភេទអ្វី?",
    options: ["Input Device", "Output Device", "Storage Device", "Memory Device"],
    answer: "Input Device"
  },
  {
    question: "១៣. តើ IP Address មានតួនាទីអ្វីនៅក្នុងប្រព័ន្ធ Network?",
    options: [
      "ជាកម្មវិធីសម្រាប់វាយអត្ថបទ",
      "ជាអាសយដ្ឋានសម្រាប់សម្គាល់ឧបករណ៍នីមួយៗនៅលើបណ្តាញ",
      "ជាឧបករណ៍សម្រាប់បញ្ចេញសំឡេង",
      "ជាខ្សែកាបសម្រាប់ភ្ជាប់កុំព្យូទ័រទៅនឹងម៉ាស៊ីនព្រីន"
    ],
    answer: "ជាអាសយដ្ឋានសម្រាប់សម្គាល់ឧបករណ៍នីមួយៗនៅលើបណ្តាញ"
  },
  {
    question: "១៤. ដើម្បីភ្ជាប់ម៉ាស៊ីនព្រីនទៅនឹងកុំព្យូទ័រដោយមិនបាច់ប្រើខ្សែ តើគេអាចប្រើប្រព័ន្ធអ្វី?",
    options: ["ខ្សែ USB", "ខ្សែ HDMI", "Wi-Fi ឬ Bluetooth", "ខ្សែ VGA"],
    answer: "Wi-Fi ឬ Bluetooth"
  },
  {
    question: "១៥. តើ Cloud Storage (ដូចជា Google Drive) មានន័យដូចម្តេច?",
    options: [
      "ការផ្ទុកទិន្នន័យនៅក្នុង Flash Drive ផ្ទាល់ខ្លួន",
      "ការផ្ទុកទិន្នន័យនៅលើម៉ាស៊ីនមេ (Server) តាមរយៈប្រព័ន្ធអ៊ីនធឺណិត",
      "ការផ្ទុកទិន្នន័យនៅលើកាតរ៉េម (RAM)",
      "ការផ្ទុកទិន្នន័យក្នុងថតឯកសារ (Folder) លើ Desktop"
    ],
    answer: "ការផ្ទុកទិន្នន័យនៅលើម៉ាស៊ីនមេ (Server) តាមរយៈប្រព័ន្ធអ៊ីនធឺណិត"
  },
  {
    question: "១៦. តើ Windows, macOS និង Linux ត្រូវបានគេហៅថាអ្វី?",
    options: [
      "ប្រព័ន្ធប្រតិបត្តិការ (Operating System - OS)",
      "កម្មវិធីវាយអត្ថបទ (Word Processor)",
      "កម្មវិធីរុករកអ៊ីនធឺណិត (Web Browser)",
      "ឧបករណ៍ផ្ទុកទិន្នន័យ (Storage Device)"
    ],
    answer: "ប្រព័ន្ធប្រតិបត្តិការ (Operating System - OS)"
  },
  {
    question: "១៧. តើខ្សែអ្វីដែលគេនិយមប្រើសម្រាប់ភ្ជាប់អ៊ីនធឺណិតពី Router មកកាន់កុំព្យូទ័រលើតុផ្ទាល់?",
    options: ["ខ្សែ USB", "ខ្សែ HDMI", "ខ្សែ Power Cable", "ខ្សែ LAN / Ethernet Cable (RJ45)"],
    answer: "ខ្សែ LAN / Ethernet Cable (RJ45)"
  },
  {
    question: "១៨. តើពាក្យពេញរបស់ Wi-Fi តំណាងឱ្យអ្វី? (ជាទូទៅគេទទួលស្គាល់ថា)",
    options: ["Wireless Fidelity", "Wired Fiber", "Wide Frequency", "Windows Firewall"],
    answer: "Wireless Fidelity"
  },
  {
    question: "១៩. តើកម្មវិធីណាមួយខាងក្រោមដែលប្រើសម្រាប់ចូលមើលគេហទំព័រ (Websites) នៅលើអ៊ីនធឺណិត?",
    options: ["Microsoft Word", "Google Chrome", "Adobe Photoshop", "VLC Media Player"],
    answer: "Google Chrome"
  },
  {
    question: "២០. តើអ្វីជាតួនាទីចម្បងរបស់កម្មវិធី Antivirus?",
    options: [
      "បង្កើនល្បឿនអ៊ីនធឺណិត",
      "ជួយទាញយកវីដេអូពី YouTube",
      "ស្វែងរក ការពារ និងលុបមេរោគ (Malware) ចេញពីកុំព្យូទ័រ",
      "ជួយឱ្យកុំព្យូទ័រស៊ីភ្លើងតិចជាងមុន"
    ],
    answer: "ស្វែងរក ការពារ និងលុបមេរោគ (Malware) ចេញពីកុំព្យូទ័រ"
  }
];

const randomizedQuestions = rawQuestions.map(q => {
  return {
    ...q,
    options: shuffle([...q.options])
  };
});

module.exports = randomizedQuestions;
