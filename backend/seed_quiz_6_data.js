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
    question: "១. តើ Shortcut Key មួយណាសម្រាប់ Copy (ចម្លង) អត្ថបទ?",
    options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + P"],
    answer: "Ctrl + C"
  },
  {
    question: "២. តើ Shortcut Key មួយណាសម្រាប់ Paste (ដាក់ពាក្យដែលបានចម្លង)?",
    options: ["Ctrl + V", "Ctrl + P", "Ctrl + C", "Ctrl + S"],
    answer: "Ctrl + V"
  },
  {
    question: "៣. តើ Shortcut Key មួយណាសម្រាប់ Cut (កាត់) អត្ថបទ?",
    options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + Z"],
    answer: "Ctrl + X"
  },
  {
    question: "៤. តើ Shortcut Key មួយណាសម្រាប់ Undo (ត្រឡប់ទៅការងារមុនវិញ)?",
    options: ["Ctrl + Z", "Ctrl + Y", "Ctrl + U", "Ctrl + Shift + Z"],
    answer: "Ctrl + Z"
  },
  {
    question: "៥. តើ Shortcut Key មួយណាសម្រាប់ Redo (ធ្វើសកម្មភាពដែលបាន Undo ឡើងវិញ)?",
    options: ["Ctrl + Y", "Ctrl + R", "Ctrl + Z", "Ctrl + X"],
    answer: "Ctrl + Y"
  },
  {
    question: "៦. តើ Shortcut Key មួយណាសម្រាប់ Save (រក្សាទុក) ឯកសារ?",
    options: ["Ctrl + S", "Ctrl + O", "Ctrl + N", "Ctrl + W"],
    answer: "Ctrl + S"
  },
  {
    question: "៧. តើ Shortcut Key មួយណាសម្រាប់ Select All (ជ្រើសរើសទាំងអស់)?",
    options: ["Ctrl + A", "Ctrl + S", "Ctrl + L", "Ctrl + E"],
    answer: "Ctrl + A"
  },
  {
    question: "៨. តើ Shortcut Key មួយណាសម្រាប់ Print (បោះពុម្ព) ឯកសារ?",
    options: ["Ctrl + P", "Ctrl + PrtScn", "Ctrl + B", "Ctrl + O"],
    answer: "Ctrl + P"
  },
  {
    question: "៩. តើ Shortcut Key មួយណាសម្រាប់បើកឯកសារថ្មី (New File) ជាទូទៅ?",
    options: ["Ctrl + N", "Ctrl + M", "Ctrl + O", "Ctrl + T"],
    answer: "Ctrl + N"
  },
  {
    question: "១០. តើ Shortcut Key មួយណាសម្រាប់បើកឯកសារដែលមានស្រាប់ (Open File)?",
    options: ["Ctrl + O", "Ctrl + P", "Ctrl + E", "Ctrl + F"],
    answer: "Ctrl + O"
  },
  {
    question: "១១. តើ Shortcut Key មួយណាសម្រាប់ធ្វើឱ្យអក្សរដិត (Bold) នៅក្នុងកម្មវិធី Word?",
    options: ["Ctrl + B", "Ctrl + D", "Ctrl + I", "Ctrl + U"],
    answer: "Ctrl + B"
  },
  {
    question: "១២. តើ Shortcut Key មួយណាសម្រាប់ធ្វើឱ្យអក្សរទ្រេត (Italic) នៅក្នុងកម្មវិធី Word?",
    options: ["Ctrl + I", "Ctrl + T", "Ctrl + E", "Ctrl + U"],
    answer: "Ctrl + I"
  },
  {
    question: "១៣. តើ Shortcut Key មួយណាសម្រាប់គូសបន្ទាត់ពីក្រោមអក្សរ (Underline)?",
    options: ["Ctrl + U", "Ctrl + L", "Ctrl + D", "Ctrl + B"],
    answer: "Ctrl + U"
  },
  {
    question: "១៤. តើ Shortcut Key មួយណាសម្រាប់ស្វែងរកពាក្យ (Find) នៅក្នុងឯកសារ ឬលើគេហទំព័រ?",
    options: ["Ctrl + F", "Ctrl + S", "Ctrl + R", "Ctrl + L"],
    answer: "Ctrl + F"
  },
  {
    question: "១៥. តើ Shortcut Key មួយណាសម្រាប់បិទផ្ទាំង (Close Tab) ដែលកំពុងបើកក្នុង Browser?",
    options: ["Ctrl + W", "Ctrl + X", "Ctrl + C", "Ctrl + Q"],
    answer: "Ctrl + W"
  },
  {
    question: "១៦. តើ Shortcut Key មួយណាសម្រាប់ Refresh (ដំណើរការឡើងវិញ) គេហទំព័រ?",
    options: ["F5 ឬ Ctrl + R", "F1 ឬ Ctrl + N", "F2 ឬ Ctrl + E", "F4 ឬ Ctrl + D"],
    answer: "F5 ឬ Ctrl + R"
  },
  {
    question: "១៧. តើ Shortcut Key មួយណាសម្រាប់ប្តូរឈ្មោះ (Rename) ឯកសារ ឬ Folder?",
    options: ["F2", "F1", "F3", "F5"],
    answer: "F2"
  },
  {
    question: "១៨. តើ Shortcut Key មួយណាសម្រាប់បិទកម្មវិធីដែលកំពុងដំណើរការទាំងស្រុង (Close Program)?",
    options: ["Alt + F4", "Ctrl + Alt + Delete", "Alt + Tab", "Shift + F4"],
    answer: "Alt + F4"
  },
  {
    question: "១៩. តើ Shortcut Key មួយណាសម្រាប់ឆ្លាស់គ្នាពីកម្មវិធីមួយទៅកម្មវិធីមួយទៀត (Switch Windows)?",
    options: ["Alt + Tab", "Ctrl + Tab", "Shift + Tab", "Windows + Tab"],
    answer: "Alt + Tab"
  },
  {
    question: "២០. តើ Shortcut Key មួយណាសម្រាប់ចាក់សោរអេក្រង់កុំព្យូទ័រ (Lock Screen) លើ Windows?",
    options: ["Windows + L", "Windows + K", "Windows + S", "Windows + P"],
    answer: "Windows + L"
  }
];

const randomizedQuestions = rawQuestions.map(q => {
  return {
    ...q,
    options: shuffle([...q.options])
  };
});

module.exports = randomizedQuestions;
