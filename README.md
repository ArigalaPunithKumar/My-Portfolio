# A Punith Kumar — Developer Portfolio

A responsive, colorful React portfolio with scroll-aware navigation, animated sections, project filters, profile illustration, working GitHub project links, resume download, education, certifications and contact links.

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Personalize your profile photo
The current hero uses an illustrative avatar at `public/assets/profile-avatar.svg` because no personal photo was provided in the repository. Replace that asset with your own photo (for example `public/assets/profile.jpg`) and set `identity.profileImage` in `public/portfolio-data.json` to `/assets/profile.jpg`.

## Content
Portfolio content is configured in `public/portfolio-data.json`. Review the listed CGPA, project descriptions and certifications before using this site for job applications.

## Deployment
Deploy the Vite project using Vercel, Netlify or GitHub Pages with an appropriate Vite base path. The public and private repositories are kept in sync for application source and static content.
