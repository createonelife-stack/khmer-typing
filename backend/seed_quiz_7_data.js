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
    question: "១. តើប្រព័ន្ធប្រតិបត្តិការ Android ត្រូវបានបង្កើតឡើងដោយក្រុមហ៊ុនមួយណា?",
    options: ["Google", "Apple", "Microsoft", "Samsung"],
    answer: "Google"
  },
  {
    question: "២. តើប្រព័ន្ធប្រតិបត្តិការ (OS) មួយណាដែលពេញនិយមជាងគេសម្រាប់កុំព្យូទ័រលើតុ (Desktop)?",
    options: ["Windows", "macOS", "Linux", "ChromeOS"],
    answer: "Windows"
  },
  {
    question: "៣. តើពាក្យពេញរបស់ Wi-Fi គឺអ្វី?",
    options: ["Wireless Fidelity", "Wireless Fiber", "Wired Fidelity", "Wide Fidelity"],
    answer: "Wireless Fidelity"
  },
  {
    question: "៤. តើឧបករណ៍មួយណាដែលប្រើសម្រាប់បង្ហាញរូបភាព និងវីដេអូចេញពីកុំព្យូទ័រ?",
    options: ["Monitor (អេក្រង់)", "Keyboard", "Mouse", "Printer"],
    answer: "Monitor (អេក្រង់)"
  },
  {
    question: "៥. តើ RAM តំណាងឱ្យពាក្យអ្វី?",
    options: ["Random Access Memory", "Read Access Memory", "Run Access Memory", "Real Access Memory"],
    answer: "Random Access Memory"
  },
  {
    question: "៦. តើ CPU ប្រៀបបានទៅនឹងអ្វីរបស់កុំព្យូទ័រ?",
    options: ["ខួរក្បាល", "បេះដូង", "ភ្នែក", "ដៃ"],
    answer: "ខួរក្បាល"
  },
  {
    question: "៧. តើកម្មវិធី Microsoft Word ប្រើសម្រាប់ធ្វើអ្វីជាចម្បង?",
    options: ["វាយអត្ថបទ", "គណនាលេខ", "កាត់តវីដេអូ", "លេងហ្គេម"],
    answer: "វាយអត្ថបទ"
  },
  {
    question: "៨. តើអ្វីទៅជា Web Browser?",
    options: ["កម្មវិធីសម្រាប់ចូលមើលគេហទំព័រ (Internet)", "កម្មវិធីសម្រាប់ស្តាប់ចម្រៀង", "ឧបករណ៍ផ្ទុកទិន្នន័យ", "ផ្នែករឹងរបស់កុំព្យូទ័រ (Hardware)"],
    answer: "កម្មវិធីសម្រាប់ចូលមើលគេហទំព័រ (Internet)"
  },
  {
    question: "៩. តើ Google Chrome, Safari, និង Firefox គឺជាអ្វី?",
    options: ["Web Browsers", "Operating Systems (OS)", "Antivirus Programs", "Search Engines"],
    answer: "Web Browsers"
  },
  {
    question: "១០. តើពាក្យពេញរបស់ URL គឺអ្វី?",
    options: ["Uniform Resource Locator", "Universal Resource Link", "Unified Resource Line", "United Resource Locator"],
    answer: "Uniform Resource Locator"
  },
  {
    question: "១១. តើ USB តំណាងឱ្យពាក្យអ្វី?",
    options: ["Universal Serial Bus", "United Serial Bus", "Universal System Bus", "Unified Serial Bus"],
    answer: "Universal Serial Bus"
  },
  {
    question: "១២. តើផ្នែករឹង (Hardware) មួយណាដែលប្រើសម្រាប់បញ្ជូនអក្សរចូលទៅក្នុងកុំព្យូទ័រ?",
    options: ["Keyboard (ក្តារចុច)", "Monitor (អេក្រង់)", "Speaker (ឧបករណ៍បំពងសំឡេង)", "Printer (ម៉ាស៊ីនបោះពុម្ព)"],
    answer: "Keyboard (ក្តារចុច)"
  },
  {
    question: "១៣. តើ 1 Gigabyte (GB) ស្មើនឹងប៉ុន្មាន Megabytes (MB) តាមស្តង់ដារបច្ចេកទេស?",
    options: ["1024 MB", "1000 MB", "1048 MB", "512 MB"],
    answer: "1024 MB"
  },
  {
    question: "១៤. តើឧបករណ៍មួយណាដែលប្រើសម្រាប់ផ្ទុកទិន្នន័យបានយូរអង្វែងនៅក្នុងកុំព្យូទ័រទោះបីបិទភ្លើងក៏ដោយ?",
    options: ["Hard Drive / SSD", "RAM", "CPU", "Motherboard"],
    answer: "Hard Drive / SSD"
  },
  {
    question: "១៥. តើទូរសព្ទ iPhone ប្រើប្រព័ន្ធប្រតិបត្តិការ (OS) មួយណា?",
    options: ["iOS", "Android", "Windows", "HarmonyOS"],
    answer: "iOS"
  },
  {
    question: "១៦. តើកម្មវិធី Microsoft Excel ប្រើជាចម្បងសម្រាប់អ្វី?",
    options: ["គណនាលេខ និងបង្កើតតារាង", "វាយអត្ថបទ", "បង្កើតបទបង្ហាញ (Presentation)", "កាត់តរូបភាព"],
    answer: "គណនាលេខ និងបង្កើតតារាង"
  },
  {
    question: "១៧. តើអ្វីទៅជាការ Update (ធ្វើបច្ចុប្បន្នភាព) កម្មវិធី?",
    options: ["ការបញ្ចូលមុខងារថ្មីៗ និងកែលម្អកម្មវិធីឱ្យកាន់តែប្រសើរ", "ការលុបកម្មវិធីចោលពីកុំព្យូទ័រ", "ការបិទកុំព្យូទ័រ", "ការផ្លាស់ប្តូរលេខសម្ងាត់ (Password)"],
    answer: "ការបញ្ចូលមុខងារថ្មីៗ និងកែលម្អកម្មវិធីឱ្យកាន់តែប្រសើរ"
  },
  {
    question: "១៨. តើក្រុមហ៊ុនមួយណាដែលផលិតប្រព័ន្ធប្រតិបត្តិការ macOS សម្រាប់កុំព្យូទ័រ?",
    options: ["Apple", "Microsoft", "Google", "IBM"],
    answer: "Apple"
  },
  {
    question: "១៩. តើកណ្ដុរ (Mouse) ត្រូវបានចាត់ទុកជាឧបករណ៍ប្រភេទអ្វី?",
    options: ["Input Device (ឧបករណ៍បញ្ចូលទិន្នន័យ)", "Output Device (ឧបករណ៍បញ្ចេញទិន្នន័យ)", "Storage Device (ឧបករណ៍ផ្ទុកទិន្នន័យ)", "Processing Device (ឧបករណ៍ដំណើរការ)"],
    answer: "Input Device (ឧបករណ៍បញ្ចូលទិន្នន័យ)"
  },
  {
    question: "២០. តើពាក្យពេញរបស់ PDF គឺអ្វី?",
    options: ["Portable Document Format", "Printed Document Format", "Personal Document File", "Public Data Format"],
    answer: "Portable Document Format"
  }
];

const randomizedQuestions = rawQuestions.map(q => {
  return {
    ...q,
    options: shuffle([...q.options])
  };
});

module.exports = randomizedQuestions;
