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
    question: "១. តើប្រព័ន្ធប្រតិបត្តិការ (OS) ដើរតួនាទីជាអ្វីនៅក្នុងកុំព្យូទ័រ?",
    options: ["អ្នកសម្របសម្រួលរវាង Hardware និង Software", "កម្មវិធីសម្រាប់លេងហ្គេម", "ឧបករណ៍សម្រាប់ផ្ទុកទិន្នន័យ", "កម្មវិធីការពារមេរោគ"],
    answer: "អ្នកសម្របសម្រួលរវាង Hardware និង Software"
  },
  {
    question: "២. តើប្រព័ន្ធប្រតិបត្តិការមួយណាដែលពេញនិយមជាងគេសម្រាប់កុំព្យូទ័រ និងអភិវឌ្ឍដោយក្រុមហ៊ុន Microsoft?",
    options: ["Windows", "macOS", "Linux", "Android"],
    answer: "Windows"
  },
  {
    question: "៣. តើប្រព័ន្ធប្រតិបត្តិការ macOS ត្រូវបានបង្កើតឡើងដោយក្រុមហ៊ុនមួយណា?",
    options: ["Apple", "IBM", "Google", "Samsung"],
    answer: "Apple"
  },
  {
    question: "៤. តើប្រព័ន្ធប្រតិបត្តិការទូរស័ព្ទដៃមួយណាដែលមានលក្ខណៈបើកចំហរ (Open Source) ជាងគេ?",
    options: ["Android", "iOS", "Windows Phone", "BlackBerry OS"],
    answer: "Android"
  },
  {
    question: "៥. តើ Linux គឺជាប្រភេទប្រព័ន្ធប្រតិបត្តិការបែបណា?",
    options: ["Open Source (បើកចំហរឱ្យប្រើដោយសេរី)", "Closed Source (បិទជិត)", "មានតម្លៃថ្លៃបំផុត", "ប្រើបានតែលើទូរស័ព្ទដៃប៉ុណ្ណោះ"],
    answer: "Open Source (បើកចំហរឱ្យប្រើដោយសេរី)"
  },
  {
    question: "៦. តើប្រព័ន្ធប្រតិបត្តិការ iOS ដំណើរការនៅលើឧបករណ៍មួយណា?",
    options: ["iPhone និង iPad", "ទូរស័ព្ទ Samsung", "កុំព្យូទ័រយួរដៃ Dell", "Smart TV"],
    answer: "iPhone និង iPad"
  },
  {
    question: "៧. តើទម្រង់ប្រព័ន្ធឯកសារ (File System) មួយណាដែល Windows ប្រើប្រាស់ជាទូទៅនាពេលបច្ចុប្បន្ន?",
    options: ["NTFS", "FAT32", "ext4", "HFS+"],
    answer: "NTFS"
  },
  {
    question: "៨. តើអ្វីទៅជាតួនាទីរបស់ Task Manager នៅក្នុង Windows?",
    options: ["ត្រួតពិនិត្យ និងគ្រប់គ្រងកម្មវិធីដែលកំពុងដំណើរការ", "បោះពុម្ពឯកសារ", "ស្តាប់ចម្រៀង", "ផ្លាស់ប្តូរផ្ទៃខាងក្រោយអេក្រង់"],
    answer: "ត្រួតពិនិត្យ និងគ្រប់គ្រងកម្មវិធីដែលកំពុងដំណើរការ"
  },
  {
    question: "៩. តើពាក្យពេញរបស់ OS គឺអ្វី?",
    options: ["Operating System", "Open Software", "Optimal System", "Operator Screen"],
    answer: "Operating System"
  },
  {
    question: "១០. តើអ្វីមួយដែលរត់មុនគេបង្អស់នៅពេលដែលកុំព្យូទ័របើកដំណើរការ?",
    options: ["ប្រព័ន្ធប្រតិបត្តិការ (OS)", "កម្មវិធី Microsoft Word", "កម្មវិធី Google Chrome", "កម្មវិធី Antivirus"],
    answer: "ប្រព័ន្ធប្រតិបត្តិការ (OS)"
  },
  {
    question: "១១. តើ GUI តំណាងឱ្យពាក្យអ្វីក្នុងប្រព័ន្ធប្រតិបត្តិការ?",
    options: ["Graphical User Interface", "General User Information", "Graphic Utility Icon", "Global User Integration"],
    answer: "Graphical User Interface"
  },
  {
    question: "១២. តើអ្វីទៅជាមុខងារសំខាន់របស់ Control Panel ឬ Settings នៅក្នុង OS?",
    options: ["ផ្លាស់ប្តូរការកំណត់ផ្សេងៗរបស់កុំព្យូទ័រ", "លុបឯកសារចោល", "សរសេរកូដកម្មវិធី", "លេងវីដេអូ"],
    answer: "ផ្លាស់ប្តូរការកំណត់ផ្សេងៗរបស់កុំព្យូទ័រ"
  },
  {
    question: "១៣. តើប្រព័ន្ធប្រតិបត្តិការមួយណាដែលភាគច្រើនត្រូវបានប្រើប្រាស់នៅលើម៉ាស៊ីន Server ធំៗ?",
    options: ["Linux", "Windows 98", "Android", "ChromeOS"],
    answer: "Linux"
  },
  {
    question: "១៤. តើ Command Prompt ឬ Terminal ប្រើសម្រាប់ធ្វើអ្វី?",
    options: ["បញ្ជាកុំព្យូទ័រតាមរយៈការវាយកូដឬអក្សរ (Command Line)", "មើលរូបភាព", "បង្កើតតារាង Excel", "ថតសំឡេង"],
    answer: "បញ្ជាកុំព្យូទ័រតាមរយៈការវាយកូដឬអក្សរ (Command Line)"
  },
  {
    question: "១៥. តើប្រព័ន្ធប្រតិបត្តិការ ChromeOS ត្រូវបានបង្កើតឡើងដោយក្រុមហ៊ុនណា?",
    options: ["Google", "Apple", "Microsoft", "Amazon"],
    answer: "Google"
  },
  {
    question: "១៦. តើអ្វីទៅជាមុខងាររបស់ Driver នៅក្នុងប្រព័ន្ធប្រតិបត្តិការ?",
    options: ["ជួយឱ្យ OS អាចទាក់ទងនិងបញ្ជា Hardware បាន", "ជាកម្មវិធីសម្រាប់បើកអ៊ីនធឺណិត", "ជាវីរុសបំផ្លាញកុំព្យូទ័រ", "ជាឧបករណ៍សម្រាប់ផ្ទុកថ្ម"],
    answer: "ជួយឱ្យ OS អាចទាក់ទងនិងបញ្ជា Hardware បាន"
  },
  {
    question: "១៧. តើប្រព័ន្ធប្រតិបត្តិការ Android ពឹងផ្អែកលើខឺណែល (Kernel) របស់ប្រព័ន្ធប្រតិបត្តិការមួយណា?",
    options: ["Linux", "Windows", "macOS", "MS-DOS"],
    answer: "Linux"
  },
  {
    question: "១៨. តើអ្វីទៅជាសកម្មភាព Booting របស់កុំព្យូទ័រ?",
    options: ["ដំណើរការចាប់ផ្តើមបើកកុំព្យូទ័រ", "ការបិទកុំព្យូទ័រ", "ការលុបកម្មវិធី", "ការបញ្ជូនឯកសារតាមអ៊ីមែល"],
    answer: "ដំណើរការចាប់ផ្តើមបើកកុំព្យូទ័រ"
  },
  {
    question: "១៩. តើមុខងារ Multi-tasking នៅក្នុង OS មានន័យដូចម្តេច?",
    options: ["សមត្ថភាពក្នុងការដំណើរការកម្មវិធីច្រើនក្នុងពេលតែមួយ", "ការប្រើប្រាស់កណ្តុរច្រើនក្នុងពេលតែមួយ", "ការបិទបើកកុំព្យូទ័រលឿន", "ការផ្ទុកទិន្នន័យបានច្រើន"],
    answer: "សមត្ថភាពក្នុងការដំណើរការកម្មវិធីច្រើនក្នុងពេលតែមួយ"
  },
  {
    question: "២០. តើកម្មវិធីមួយណាដែលភ្ជាប់មកជាមួយ Windows ស្រាប់សម្រាប់ការពារមេរោគ (Antivirus)?",
    options: ["Windows Defender", "Norton Antivirus", "Kaspersky", "McAfee"],
    answer: "Windows Defender"
  }
];

const randomizedQuestions = rawQuestions.map(q => {
  return {
    ...q,
    options: shuffle([...q.options])
  };
});

module.exports = randomizedQuestions;
