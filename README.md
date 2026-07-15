# Khmer Typing Master (វាយអក្សរខ្មែរ)

កម្មវិធីហាត់វាយអក្សរខ្មែរ Full Stack (React + Node/Express + JSON storage)

## មុខងារ

- មេរៀនទី១ ដល់ទី៤ (៣០ ពាក្យ/មេរៀន)
- កំណត់ពេល ៣ នាទីក្នុងមួយមេរៀន
- ១ ពាក្យត្រឹមត្រូវ = ៣ ពិន្ទុ
- ចប់មុន ២:០០ នាទី បន្ថែម ១០ ពិន្ទុ
- ចប់មុន ២:៣០ នាទី បន្ថែម ៥ ពិន្ទុ
- ទំព័រគ្រប់គ្រង (/admin) សម្រាប់បញ្ចូល/កែពាក្យក្នុងមេរៀននីមួយៗ

## រចនាសម្ព័ន្ធ

```
KhmerTyping/
  backend/     Node.js + Express API, ទិន្នន័យផ្ទុកក្នុង backend/data/lessons.json
  frontend/    React (Vite) - ទំព័រ​ហាត់វាយ និងទំព័រគ្រប់គ្រង
```

## របៀបដំណើរការក្នុងម៉ាស៊ីនផ្ទាល់ខ្លួន

ត្រូវការ Node.js (v18+)

### ១. ដំណើរការ Backend

```
cd backend
npm install
npm run dev
```

Backend នឹងដំណើរការនៅ http://localhost:4000

### ២. ដំណើរការ Frontend (terminal ថ្មី)

```
cd frontend
npm install
npm run dev
```

Frontend នឹងដំណើរការនៅ http://localhost:5173 (Vite នឹងបង្ហាញអាសយដ្ឋានពិតប្រាកដ)

បើក http://localhost:5173 ក្នុង browser ។

## ការប្រើទំព័រគ្រប់គ្រង

ចូលទៅ http://localhost:5173/admin ដើម្បីជ្រើសរើសមេរៀន (ទី១-៤) ហើយបញ្ចូល ឬកែសម្រួលពាក្យ។
អាចវាយម្តងមួយៗ ឬបិទភ្ជាប់ពាក្យច្រើនក្នុងពេលតែមួយ (មួយពាក្យក្នុងមួយបន្ទាត់ ឬបំបែកដោយសញ្ញាក្បៀស) រួចចុច "រក្សាទុក"។

## ចំណាំ

- ទិន្នន័យពាក្យ និងលទ្ធផលហាត់ ត្រូវបានរក្សាទុកជា JSON files នៅក្នុង `backend/data/` (មិនប្រើ database ក្រៅ)
- ដើម្បីប្តូរ URL របស់ backend សម្រាប់ frontend (ឧ. ពេល deploy) កំណត់ environment variable `VITE_API_URL`
