# EthicsCodex: Professional Codes of Ethics Website
CC106 Application Development and Emerging Technologies, Taguig City University.

## Run it (VS Code)
1. File > Open Folder > select `ethics-website`.
2. Install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.
   (Or double-click `index.html` to open it in a browser.)

## Folder guide
```
ethics-website/
  index.html          all page content and sections
  css/style.css       theme colors, layout, components, dark mode
  css/responsive.css  tablet/phone rules, reduced-motion
  js/main.js          icons, hero art, menu, theme, tabs, case studies
  js/auth.js          demo login (accounts and scores in localStorage)
  js/extras.js        topic cards, jump chips, gallery, lightbox
  js/quiz.js          quiz engine and question bank (BANK array)
  images/             placeholder.svg and your own pictures
  README.md           this file
```
Keep the folder structure as is so the links work.

## User guide
- Use the top menu (Menu button on phones) to jump between sections. The red bar shows scroll progress.
- Click a topic card or a "Jump to" chip to go straight to that part.
- Click a PCS tenet to open it. Click PCS / ACM / IEEE to compare codes.
- In Case Studies, type your answer, then click **Show model answer**.
- Log in or create an account, then press **Start quiz**. The timer starts only when you press Start. You get instant feedback, a final score, your time, and a review of missed questions. **Try again** reshuffles everything.
- **Dark mode** button in the menu; your choice is remembered.
- Click any gallery or case picture to open it larger.

## Developer notes
- Edit text in `index.html`. Edit colors in the `:root` variables at the top of `css/style.css`.
- Add or change quiz items in `js/quiz.js`: `{ q, o: [options], a: indexOfCorrect, why }`.
- Case study model answers are in the `MODEL` array in `js/main.js`.
- Login is a demo only. Accounts and scores are saved in the browser's localStorage, so it is **not real security**.
- Pictures: add files with these names to `images/` and they replace the defaults automatically:
  hero.jpg, codes.jpg, duties.jpg, accountability.jpg, decisions.jpg, cases.jpg,
  case1.jpg, case2.jpg, case3.jpg, gallery1.jpg to gallery4.jpg.
- Icons and illustrations are inline SVG (no image downloads, no copyright issues).
- No frameworks or database.

## Suggested task division
Content research and writing | HTML structure | CSS and responsive design | JavaScript and quiz | Documentation, testing, deployment.

## Deploy (GitHub Pages)
Create a GitHub repository, upload all files keeping the folders, then Settings > Pages > Deploy from branch `main` (root). Submit the generated link.

## Test checklist
Menu, tabs, accordions, dark mode, login, case study boxes, gallery lightbox, and the full quiz in Chrome, Edge, Firefox; check widths 320, 768, and 1280 px.
