## Portfolio – Md Sadman Hossain

Personal portfolio built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, with heavy use of motion and scroll-driven storytelling (GSAP, Lenis, custom providers).

### Tech stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4, custom design tokens, utility classes
- **Motion & UX**: GSAP + ScrollTrigger, Lenis smooth scrolling, custom page transitions, preloader
- **UI utilities**: `lucide-react`, `@tabler/icons-react`, `lightswind`, custom `ui` primitives
- **Backend**: Next.js API route for contact form, `nodemailer` for email delivery

### Getting started

1. **Install dependencies**

```bash
npm install
```

2. **Run the dev server**

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser.

### Available scripts

- **`npm run dev`**: Start the development server
- **`npm run build`**: Create a production build
- **`npm run start`**: Run the production build
- **`npm run lint`**: Run ESLint over the project

### Project structure

High-level layout of the important source folders:

```text
app/
  layout.tsx              # Root layout, global font + providers wiring
  globals.css             # Global styles and Tailwind layers
  page.tsx                # Home page (hero, services, featured work, etc.)
  about/page.tsx          # About route
  services/page.tsx       # Services route
  projects/page.tsx       # Projects route
  contact/page.tsx        # Contact route
  api/contact/route.ts    # Contact form API (email via nodemailer)

components/
  Hero.tsx                # Hero section with scroll-driven motion
  ServicesSection.tsx     # Services highlight section for the home page
  ProjectsSection.tsx     # Projects grid / highlight
  FeaturedWorkSection.tsx # Featured work carousel/section
  CapabilitiesSection.tsx # Capabilities/skills section
  TextSection.tsx         # Supporting text / narrative block
  Navbar.tsx              # Responsive navbar with lightswind menu
  FooterSection.tsx       # Site footer
  BackToTop.tsx           # Back-to-top button
  Preloader.tsx           # Entry preloader
  PreloaderGate.tsx       # Gate that coordinates preloader and page
  SmoothScrollProvider.tsx# Lenis wrapper for smooth scrolling
  PageTransition.tsx      # Visual page transition overlay
  PageTransitionProvider.tsx
                          # Context + hooks for navigation transitions
  NavbarContrastProvider.tsx
                          # Context for navbar contrast (dark/light)
  TransitionLink.tsx      # Link component wired to page transitions
  DraggableThemeToggle.tsx# Draggable theme toggle floating control

  pages/
    about/
      AboutPageContent.tsx   # About page content + timeline layout
    services/
      ServicesPageContent.tsx# Services page content + scroll animations
    contact/
      ContactPageContent.tsx # Contact page layout
      ContactForm.tsx        # Contact form used on the contact page

  ui/
    compare.tsx           # Before/after comparison component used in hero
    sparkles.tsx          # Reusable sparkles / particles component

  lightswind/
    hamburger-menu-overlay.tsx # Lightswind-powered mobile menu overlay
    toggle-theme.tsx           # Theme toggle from lightswind

lib/
  utils.ts               # Generic helpers (e.g. class name helpers)

public/
  icons/                 # SVG assets for hero, nav, etc.
  fonts/                 # Local font files referenced from `layout.tsx`
  logos/                 # Logos used on the About page timeline
  assets/                # Static images (hero cards, etc.)
```

### How pages are composed

- **Home (`/`)**: Built from shared sections in `components` – `Navbar`, `Hero`, `ServicesSection`, `TextSection`, `FeaturedWorkSection`, `CapabilitiesSection`, `ProjectsSection`, `FooterSection`.
- **About (`/about`)**: Thin route component in `app/about/page.tsx` that renders `Navbar`, `components/pages/about/AboutPageContent`, and `FooterSection`.
- **Services (`/services`)**: Thin route in `app/services/page.tsx` that renders `Navbar`, `components/pages/services/ServicesPageContent`, and `FooterSection`.
- **Projects (`/projects`)**: Uses `Navbar`, `ProjectsSection`, and `FooterSection` to keep layout consistent.
- **Contact (`/contact`)**: Thin route in `app/contact/page.tsx` that renders `Navbar` and `components/pages/contact/ContactPageContent`, which itself uses `ContactForm`.

### Contact form flow

- The UI is implemented in `components/pages/contact/ContactForm.tsx`.
- Submits `POST /api/contact` with JSON payload `{ name, email, message }`.
- The handler in `app/api/contact/route.ts` sends an email via `nodemailer` and returns success/failure; the UI updates `status` accordingly.

### Notes for future refactors

- Keep **page-specific composition** inside `components/pages/*` so route files stay thin.
- Keep **shared, cross-page UI** in the root of `components` (or in `components/ui` for smaller primitives).
- When adding a new route, prefer:
  - `app/<route>/page.tsx` – minimal shell (layout + providers)
  - `components/pages/<route>/<RouteName>PageContent.tsx` – all the actual content and animations.
