# 1. Group Repository for COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)

Your group's shared repository for the WDC 2023 Web App Project.

Auto commit/push/sync to Github is disabled by default in this repository.
- Enable the GitDoc extension to use this fucntionality (either in your VSCode settings, or in the Dev Container settings)

See [HERE](https://myuni.adelaide.edu.au/courses/85266/pages/2023-web-application-group-project-specification) for the project specification.

We recommend using the 'Shared Repository Model (Branch & Pull)' to collaborate on your work in this single repostory.
- You can read more about collaborating on GitHub repositories [HERE](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- When working on the same file at the same time, the 'Live Share' feature in VSCode can also help.

# 2. RentSpot - Property Rental Platform

## 2.1 Project Description

RentSpot is a web-based property rental application developed for COMP SCI 2207/7207 Web & Database Computing. The platform connects property seekers with landlords, allowing users to search for rental properties, book inspections, and manage property listings across Australia.

This project demonstrates full-stack web development using modern technologies including Vue.js (with Vue CLI), Node.js, and MySQL, with integration of third-party APIs for enhanced functionality.

**Note**: This project uses Vue CLI instead of Vite to comply with course requirements. All environment variables use the `VUE_APP_` prefix.

## 2.2 Setup Instructions

### Prerequisites
- Node.js (v16.0 or higher)
- MySQL (v8.0 or higher) - *Not required for Codespaces*
- Git
- Modern web browser

### GitHub Codespaces Setup
**Fully Automatic Setup** - No manual configuration required!

When you create a new Codespace, everything will be automatically configured:
- MySQL database installation and setup
- Database schema import with sample data
- Backend dependencies installation
- Frontend dependencies installation
- Environment files creation
- API URL configuration for Codespaces

### Important: Database Not Showing Up Immediately?

If you do not see the database content correctly mapped to the backend or displayed on the frontend:
1.Manually change the ports at the frontend and the backend from "Private" to "Public"

2. Run the setup script manually:

```bash
bash setup.sh
```

3.	After waiting, restart both the backend and frontend:

```bash
cd backend&&npm start
```
```bash
cd rentspot-frontend&&npm run serve
```

This is not a bug — just a Codespaces delay. Apologies for any confusion; I spent significant time debugging this issue alone to ensure the system now recovers correctly with the above steps.

Simply create a Codespace and wait for the setup to complete, then start the application.

### 1. Database Setup

#### For Local Development:
```bash
mysql -u root -p
CREATE DATABASE Rent_database;
USE Rent_database;
SOURCE backend/Rent_database_updated.sql;
```

#### For GitHub Codespaces:
**No setup required** - Database is automatically configured during Codespace creation.

### 2. Backend Configuration

#### For Local Development:
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Ljl12345!  # Your MySQL password
DB_NAME=Rent_database
DB_PORT=3306

JWT_SECRET=00ae84691b5cc7bb6ca21e11779bc0cefb5ed62d1b7331a71ea0628e7f2c98d54331b54f3c67084bc2ec0e78e9ef21473b9b575eb7e8336dc5faebdafb44dacf

PORT=8080

CLOUDINARY_CLOUD_NAME=dzxrmtus9
CLOUDINARY_API_KEY=138993529279886
CLOUDINARY_API_SECRET=23CK6Atf0I_PolCywakizy-PJU8

TURNSTILE_SITE_KEY=0x4AAAAAABdkinnD2a45uxc0
TURNSTILE_SECRET_KEY=0x4AAAAAABdkii48VRRJP3Cb8Ggbml6zNyQ

NEWS_API_KEY=d9b129de2e5e432e8315073b3e294fc3

API_BASE_URL=http://localhost:8080/api
NODE_ENV=development
```

Create `.env` file in the frontend directory (`rentspot-frontend/.env`):
```env
VUE_APP_API_BASE_URL=http://localhost:8080/api
VUE_APP_CLOUDINARY_CLOUD_NAME=dzxrmtus9
VUE_APP_CLOUDINARY_UPLOAD_PRESET=rentspot_unsigned
VUE_APP_TURNSTILE_SITE_KEY=0x4AAAAAABdkinnD2a45uxc0
VUE_APP_TURNSTILE_TEST_SITE_KEY=1x00000000000000000000AA
```

#### For GitHub Codespaces:
**No setup required** - All configuration files are automatically created during Codespace setup.

### 3. Start the Application

#### For Local Development:
Start the backend server:
```bash
cd backend
npm start
```
Backend runs at: `http://localhost:8080`

Start the frontend server:
```bash
cd rentspot-frontend
npm install
npm run serve
```
Frontend runs at: `http://localhost:5173`

#### For GitHub Codespaces:
After the automatic setup completes, simply run:
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd rentspot-frontend && npm run serve
```
The application will be accessible via the forwarded ports (8080 for API, 5173 for frontend).

### 4. Test Accounts

Pre-configured test accounts (password: `11111111` for all):

| Email | Role | Access |
|-------|------|--------|
| test@example.com | Landlord | Property management, booking views |
| Jarvis@example.com | Renter | Property search, booking creation |
| admin@example.com | Admin | Full system access |

## 2.3 Features and Functionality

### Core Features
- **User Authentication**: Registration, login, and profile management with JWT tokens
- **Multi-role System**: Support for renters, landlords, and administrators
- **Property Management**: Create, edit, and manage property listings with image uploads
- **Advanced Search**: Filter properties by price, location, type, and amenities
- **Multiple View Modes**: Grid view, list view, and interactive map view
- **Booking System**: Schedule property inspections with automated time slot generation
- **Favorites System**: Save and manage favorite properties
- **Responsive Design**: Mobile-optimized interface with dark mode support

### Technical Implementation
- **Frontend**: Vue.js 3 with custom routing system
- **Backend**: Node.js + Express.js RESTful API
- **Database**: MySQL with normalized schema design
- **Authentication**: JWT-based sessions with bcrypt password hashing
- **File Storage**: Cloudinary integration for image management
- **Maps Integration**: Google Maps API for location services
- **Security**: CAPTCHA protection via Cloudflare Turnstile

### User Roles and Permissions

#### Renters
- Browse and search properties
- Book property inspections
- Manage favorites and bookings
- Update profile information

#### Landlords
- Create and manage property listings
- Upload multiple property images
- View and manage inspection bookings
- Track property performance

#### Administrators
- Manage all users and properties
- View system statistics
- Change user roles
- Delete accounts and properties

## 2.4 API Documentation

### Authentication
```
POST   /api/auth/register     - User registration
POST   /api/auth/login        - User login
```

### User Management
```
GET    /api/users/profile     - Get user profile
PUT    /api/users/profile     - Update profile
POST   /api/users/avatar      - Upload profile picture
POST   /api/users/change-password - Change password
GET    /api/users/favorites   - Get favorite properties
```

### Properties
```
GET    /api/properties        - List properties with filters
GET    /api/properties/:id    - Get property details
POST   /api/properties        - Create new property
PUT    /api/properties/:id    - Update property
DELETE /api/properties/:id    - Delete property
POST   /api/properties/upload-multiple - Upload property images
```

### Bookings
```
GET    /api/bookings/slots/:propertyId - Get available time slots
GET    /api/bookings          - Get user bookings
POST   /api/bookings          - Create booking
PUT    /api/bookings/:id      - Update booking status
DELETE /api/bookings/:id      - Cancel booking
```

### Admin
```
GET    /api/admin/users       - List all users
PUT    /api/admin/users/:id/role - Change user role
GET    /api/admin/stats       - Get system statistics
DELETE /api/admin/users/:id   - Delete user
```

## 2.5 Database Structure

The database follows Third Normal Form (3NF) principles with the following main tables:

- **Users**: User accounts with role-based access
- **Properties**: Property listings with location and details
- **PropertyImages**: Multiple images per property with ordering
- **Bookings**: Inspection appointments with status tracking
- **Favorites**: User's saved properties
- **News**: Real estate news and updates

Key relationships include foreign key constraints and indexes for optimal query performance.

## 2.6 Database Diagram

![Database Schema Diagram](https://res.cloudinary.com/dzxrmtus9/image/upload/v1749745482/RSF1_bysids.png)

The diagram above illustrates the complete database schema with table relationships, primary keys, foreign keys, and data types for all fields.

## 2.7 Known Issues

### Current Bugs
1. **Map View Marker Overlap**: When properties have the same location, map markers overlap and only one property can be viewed
2. **Dark Mode Mobile Toggle**: On mobile devices, the dark mode toggle requires two taps to switch themes
3. **Edit Property Images**: Cannot view existing uploaded image URLs in the property edit modal
4. **Cloudflare Turnstile Limitation**: CAPTCHA functionality unavailable in Codespaces due to API domain restrictions

### UI/UX Issues
5. **Toast Notification Positioning**: Toast messages appear over the navbar, affecting user experience
6. **Toast Notification Styling**: Notifications display in black/white instead of red due to dark mode global styles conflicts
7. **Search Filter Persistence**: Filter selections reset when navigating between pages due to different developers working on separate interfaces



## 2.8 What We Learned

Through this project, we gained hands-on experience with:
- Full-stack web development using modern JavaScript frameworks
- Database design and normalization principles
- RESTful API development and integration
- User authentication and authorization systems
- Third-party API integration (Cloudinary, Google Maps)
- Team collaboration using Git branching strategies
- Responsive web design and mobile optimization

## 2.9 Contributors

| Name | Role | Primary Responsibilities |
|------|------|-------------------------|
| **Jialao (Jarvis)** | Full-Stack Lead | Backend API development, database design, authentication system, frontend integration, documentation, project maintenance |
| **Nhat Tan (Trey)** | Frontend Lead | UI/UX design, Vue.js components, responsive layouts, user interface development |
| **Deze Yang** | Frontend Assistant | frontend contributions on mock data in news.vue|

## 2.9 Development Notes

- The project uses a custom Vue.js router implementation instead of Vue Router
- All API endpoints follow RESTful conventions
- Database connections use connection pooling for performance
- Images are stored on Cloudinary CDN for optimal loading
- The application supports both light and dark themes
- Mobile-first responsive design approach was used throughout

## 2.10 Running Tests

To test the application functionality:

1. **User Registration**: Create accounts with different roles
2. **Property Management**: Add properties with multiple images as a landlord
3. **Search and Booking**: Search properties and book inspections as a renter
4. **Admin Functions**: Manage users and view statistics as an admin
5. **Responsive Testing**: Test on different screen sizes and devices

## 2.11 Environment-Specific Features

### Registration and Login:
- **Local Development**: Full functionality including Cloudflare Turnstile CAPTCHA protection
- **GitHub Codespaces**: CAPTCHA automatically disabled with user-friendly notice message

### News Section:
- **Local Development**: Uses mock data (NewsAPI now requires paid subscription) 
- **GitHub Codespaces**: Uses same mock data with realistic Australian property news

## 2.12 Testing Recommendations

- **Local Testing**: Test CAPTCHA functionality during registration
- **Codespaces Testing**: Focus on core features since CAPTCHA is automatically handled
- **Use Test Accounts**: Pre-configured accounts for testing different user roles
- **Responsive Testing**: Verify functionality across desktop and mobile viewports
- **API Testing**: All property, user, and booking APIs work in both environments

The application includes comprehensive error handling and user feedback through toast notifications.

### 2.13 Technical References & Documentation

This section lists the main technologies, tools, and frameworks we used to build RentSpot, along with the key docs and tutorials that helped guide our development. We tried to keep track of useful links as we coded, but we probably missed a few—especially after closing too many tabs once the feature was working and thought, "finally done" (which, to be honest, happened more than once).

Throughout the project, we learned a lot from official docs, blog posts, guides, and example projects. That said, every feature was hand-built based on our own research and understanding—not just copied from a single source.

We’re sharing this list both to give credit where it’s due, and to help ourselves if we ever need to revisit, update, or build another project in the future. But after the course ends, some of the external APIs used during development may be disabled to prevent potential data leaks or unauthorized access.

---

#### FRONTEND TECHNOLOGIES & FRAMEWORKS

1.  **Vue.js 3 with Composition API**
    * Primary Documentation: [https://vuejs.org/guide/introduction.html](https://vuejs.org/guide/introduction.html)
    * Composition API Setup: [https://vuejs.org/api/composition-api-setup.html](https://vuejs.org/api/composition-api-setup.html)
    * Composables Guide: [https://vuejs.org/guide/reusability/composables](https://vuejs.org/guide/reusability/composables)
    * Composition API FAQ: [https://vuejs.org/guide/extras/composition-api-faq.html](https://vuejs.org/guide/extras/composition-api-faq.html)
    * TypeScript with Composition API: [https://vuejs.org/guide/typescript/composition-api.html](https://vuejs.org/guide/typescript/composition-api.html)

2.  **Custom Router Implementation (No Vue Router)**
    * Main Tutorial (Basic Concept): [https://vueschool.io/articles/vuejs-tutorials/creating-your-own-router/](https://vueschool.io/articles/vuejs-tutorials/creating-your-own-router/)
    * Vue 3 Reactivity for Router State: [https://vuejs.org/guide/essentials/reactivity-fundamentals.html](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
    * MDN History API: [https://developer.mozilla.org/en-US/docs/Web/API/History_API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

3.  **Vue Toastification**
    * GitHub Repository: [https://github.com/Maronato/vue-toastification](https://github.com/Maronato/vue-toastification)
    * Official Documentation: [https://vue-toastification.maronato.dev/](https://vue-toastification.maronato.dev/)

---

#### AUTHENTICATION & SECURITY

4.  **JWT Authentication**
    * **Jason Watmore's Tutorials:**
        * Vue 3 + Node.js JWT: [https://jasonwatmore.com/vue-3-authentication-with-nodejs-jwt-api](https://jasonwatmore.com/vue-3-authentication-with-nodejs-jwt-api)
        * Vue 3 + Pinia JWT: [https://jasonwatmore.com/post/2022/05/26/vue-3-pinia-jwt-authentication-tutorial-example](https://jasonwatmore.com/post/2022/05/26/vue-3-pinia-jwt-authentication-tutorial-example)
        * Vue 3 + Pinia with Refresh Tokens: [https://jasonwatmore.com/vue-3-pinia-jwt-authentication-with-refresh-tokens-example-tutorial](https://jasonwatmore.com/vue-3-pinia-jwt-authentication-with-refresh-tokens-example-tutorial)
    * **BezKoder Tutorials:**
        * Node.js Express + Vue.js JWT: [https://www.bezkoder.com/node-express-vue-jwt-auth/](https://www.bezkoder.com/node-express-vue-jwt-auth/)
        * Vue 3 Authentication with JWT: [https://www.bezkoder.com/vue-3-authentication-jwt/](https://www.bezkoder.com/vue-3-authentication-jwt/)
        * Node.js Express JWT: [https://www.bezkoder.com/node-js-jwt-authentication-mysql/](https://www.bezkoder.com/node-js-jwt-authentication-mysql/)

5.  **Cloudflare Turnstile CAPTCHA**
    * Official Documentation: [https://developers.cloudflare.com/turnstile/](https://developers.cloudflare.com/turnstile/)
    * Turnstile Blog: [https://blog.cloudflare.com/turnstile-ga/](https://blog.cloudflare.com/turnstile-ga/)

6.  **bcrypt Password Hashing**
    * GitHub Repository: [https://github.com/kelektiv/node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
    * Digital Ocean Tutorial: [https://www.digitalocean.com/community/tutorials/nodejs-password-hashing-with-bcrypt](https://www.digitalocean.com/community/tutorials/nodejs-password-hashing-with-bcrypt)

---

#### EXTERNAL API INTEGRATIONS

7.  **Cloudinary Image Management**
    * **Official Cloudinary Documentation:**
        * Node.js Image Upload: [https://cloudinary.com/documentation/node_image_and_video_upload](https://cloudinary.com/documentation/node_image_and_video_upload)
        * Upload Images with Node.js and React: [https://cloudinary.com/blog/guest_post/upload-images-to-cloudinary-with-node-js-and-react](https://cloudinary.com/blog/guest_post/upload-images-to-cloudinary-with-node-js-and-react)
        * Parse Media Files with Multer: [https://cloudinary.com/blog/guest_post/how-to-parse-media-files-with-multer](https://cloudinary.com/blog/guest_post/how-to-parse-media-files-with-multer)
        * Node.js SDK Integration: [https://cloudinary.com/documentation/node_integration](https://cloudinary.com/documentation/node_integration)
        * Upload API Reference: [https://cloudinary.com/documentation/image_upload_api_reference](https://cloudinary.com/documentation/image_upload_api_reference)

8.  **Google Maps JavaScript API**
    * Geocoding Service: [https://developers.google.com/maps/documentation/javascript/geocoding](https://developers.google.com/maps/documentation/javascript/geocoding)
    * Reverse Geocoding Example: [https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse](https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse)
    * Geocoder Reference: [https://developers.google.com/maps/documentation/javascript/reference/geocoder](https://developers.google.com/maps/documentation/javascript/reference/geocoder)
    * Geocoding API Overview: [https://developers.google.com/maps/documentation/geocoding/overview](https://developers.google.com/maps/documentation/geocoding/overview)

9.  **Material Symbols Icons**
    * Google Fonts Material Symbols: [https://fonts.google.com/icons](https://fonts.google.com/icons)
    * Material Design Icons Guide: [https://developers.google.com/fonts/docs/material_symbols](https://developers.google.com/fonts/docs/material_symbols)

---

#### BACKEND API PATTERNS

10. **Express.js 5.x RESTful API Design**
    * **Express 5.x Specific Documentation:**
        * Express 5.x API Documentation: [https://expressjs.com/en/5x/api.html](https://expressjs.com/en/5x/api.html)
        * Express 5.x Migration Guide: [https://expressjs.com/en/guide/migrating-5.html](https://expressjs.com/en/guide/migrating-5.html)
        * Express 5.x Changes: [https://github.com/expressjs/express/blob/5.0/History.md](https://github.com/expressjs/express/blob/5.0/History.md)
    * **General REST API Tutorials (Concepts Apply to Express 5):**
        * REST API Best Practices Handbook: [https://www.freecodecamp.org/news/rest-api-design-best-practices-build-a-rest-api/](https://www.freecodecamp.org/news/rest-api-design-best-practices-build-a-rest-api/)
        * Learn REST API Principles: [https://www.freecodecamp.org/news/learn-rest-api-principles-by-building-an-express-app/](https://www.freecodecamp.org/news/learn-rest-api-principles-by-building-an-express-app/)
        * REST API Best Practices: [https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/)
    * **LogRocket Tutorials:**
        * Build REST API with MySQL: [https://blog.logrocket.com/build-rest-api-node-express-mysql/](https://blog.logrocket.com/build-rest-api-node-express-mysql/)
        * CRUD REST API with PostgreSQL: [https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/](https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/)

11. **MySQL with Node.js**
    * MySQL2 GitHub: [https://github.com/sidorares/node-mysql2](https://github.com/sidorares/node-mysql2)
    * W3Schools MySQL Tutorial: [https://www.w3schools.com/nodejs/nodejs_mysql.asp](https://www.w3schools.com/nodejs/nodejs_mysql.asp)
    * Digital Ocean MySQL Connection Pooling: [https://www.digitalocean.com/community/tutorials/how-to-use-mysql-with-node-js-and-the-mysql-javascript-client](https://www.digitalocean.com/community/tutorials/how-to-use-mysql-with-node-js-and-the-mysql-javascript-client)

12. **Multer File Upload**
    * Multer GitHub: [https://github.com/expressjs/multer](https://github.com/expressjs/multer)
    * multer-storage-cloudinary: [https://www.npmjs.com/package/multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
    * GeeksforGeeks Multiple Upload: [https://www.geeksforgee.org/how-to-upload-single-multiple-image-to-cloudinary-using-node-js/](https://www.geeksforgee.org/how-to-upload-single-multiple-image-to-cloudinary-using-node-js/)

---

#### CSS & DESIGN PATTERNS

13. **CSS Variables & Design Systems**
    * CSS-Tricks Custom Properties: [https://css-tricks.com/a-complete-guide-to-custom-properties/](https://css-tricks.com/a-complete-guide-to-custom-properties/)
    * Smashing Magazine CSS Custom Properties: [https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/](https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/)

14. **Dark Mode Implementation**
    * CSS-Tricks Dark Mode Guide: [https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/)
    * Web.dev prefers-color-scheme: [https://web.dev/prefers-color-scheme/](https://web.dev/prefers-color-scheme/)
    * MDN prefers-color-scheme: [https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

15. **Responsive Grid Layouts**
    * CSS Grid Complete Guide: [https://css-tricks.com/snippets/css/complete-guide-grid/](https://css-tricks.com/snippets/css/complete-guide-grid/)
    * Flexbox Complete Guide: [https://css-tricks.com/snippets/css/a-guide-to-flexbox/](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

16. **Form Validation**
    * MDN Form Validation: [https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
    * UX Planet Form Validation: [https://uxplanet.org/form-validation-best-practices-8e3b6d5e7ff8](https://uxplanet.org/form-validation-best-practices-8e3b6d5e7ff8)

---

#### UI/UX PATTERNS

17. **Image Gallery & Lightbox**
    * PhotoSwipe Gallery: [https://photoswipe.com/](https://photoswipe.com/)
    * Swiper.js Examples: [https://swiperjs.com/demos](https://swiperjs.com/demos)
    * CSS-Tricks Lightbox: [https://css-tricks.com/creating-a-lightbox-image-gallery/](https://css-tricks.com/creating-a-lightbox-image-gallery/)

18. **Drag & Drop File Upload**
    * MDN File API: [https://developer.mozilla.org/en-US/docs/Web/API/File](https://developer.mozilla.org/en-US/docs/Web/API/File)
    * CSS-Tricks Drag and Drop: [https://css-tricks.com/drag-and-drop-file-uploading/](https://css-tricks.com/drag-and-drop-file-uploading/)
    * Web.dev File Upload UX: [https://web.dev/file-upload-ux/](https://web.dev/file-upload-ux/)

19. **Loading States & Skeletons**
    * CSS-Tricks Skeleton Screens: [https://css-tricks.com/building-skeleton-screens-css-custom-properties/](https://css-tricks.com/building-skeleton-screens-css-custom-properties/)

20. **Card Component Design Patterns**
    * CSS-Tricks Card Component: https://css-tricks.com/snippets/css/complete-guide-grid/#aa-card-layouts
    * Material Design Cards: https://material.io/components/cards
    * Smashing Magazine Card Design: https://www.smashingmagazine.com/2016/10/designing-card-based-user-interfaces/

21. **Real Estate Card Layouts (Inspiration)**
    * Airbnb Property Cards: https://www.airbnb.com/ (Homepage property grid)
    * Domain.com.au Card Layout: https://www.domain.com.au/
    * RealEstate.com.au Listings: https://www.realestate.com.au/

22. **CSS Card Hover Effects**
    * CSS-Tricks Card Hover Effects: https://css-tricks.com/block-links-card-clickable-areas/
    * Hover.css Library: https://ianlunn.github.io/Hover/ (For hover effect ideas)
    * CodePen Card Hover Examples: https://codepen.io/tag/card-hover

23. **Responsive Card Grid Layouts**
    * CSS Grid Card Layout: https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/
    * Responsive Card Design Patterns: https://inclusive-components.design/cards/
    * Kevin Powell Card Tutorial: https://www.youtube.com/watch?v=rg7Fvvl3taU

24. **Image Overlay Techniques**
    * CSS Image Overlay: https://www.w3schools.com/howto/howto_css_image_overlay.asp
    * Image Hover Overlay Effects: https://tympanus.net/codrops/2014/10/28/overlay-effect-menu/
---

#### DEVELOPMENT TOOLS

20. **Vue CLI 5.0 Configuration**
    * Vue CLI Documentation: [https://cli.vuejs.org/config/](https://cli.vuejs.org/config/)
    * Vue CLI Environment Variables: [https://cli.vuejs.org/guide/mode-and-env.html](https://cli.vuejs.org/guide/mode-and-env.html)

21. **Axios HTTP Client**
    * Axios Documentation: [https://axios-http.com/docs/interceptors](https://axios-http.com/docs/interceptors)
    * Axios GitHub: [https://github.com/axios/axios](https://github.com/axios/axios)

---

#### ADDITIONAL DEPENDENCIES

22. **CORS (Cross-Origin Resource Sharing)**
    * cors npm package: [https://www.npmjs.com/package/cors](https://www.npmjs.com/package/cors)
    * MDN CORS Documentation: [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

23. **dotenv**
    * dotenv GitHub: [https://github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)
    * dotenv npm: [https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)

---

#### DEVCONTAINER CONFIGURATION

* VS Code Dev Containers: [https://code.visualstudio.com/docs/devcontainers/containers](https://code.visualstudio.com/docs/devcontainers/containers)
* DevContainer Specification: [https://containers.dev/](https://containers.dev/)
* GitHub Codespaces: [https://docs.github.com/en/codespaces](https://docs.github.com/en/codespaces)

---

> 

# 3. RentSpot AU - Git Branch Usage Guide

To ensure clean collaboration, **each team member must work on their own branch**.
**Never commit directly to the `main` branch.** All changes must go through pull requests (PRs).

## Assigned Development Branches

Current dev branches for each member:

- Jialao: dev/jialao
- Nhat Tan: dev/nhattan
- Deze: dev/deze

## Step 1: Create Your Branch (One-time setup)

Start from the latest `main` branch:

```bash
git checkout main
git pull origin main

git checkout -b dev/yourname
git push -u origin dev/yourname
```

Replace `yourname` with your actual name or alias.

## Step 2: Keep Your Branch Updated with `main`

Before you start working, always sync with the latest `main` to avoid conflicts:

```bash
git checkout main
git pull origin main

git checkout dev/yourname
git rebase main        # or: git merge main
```

If conflicts occur, fix them, then:

```bash
git add .
git rebase --continue
```

Then push your updated branch:

```bash
git push -f     # Use force push only after rebase
```

## Step 3: Commit and Push Your Changes

```bash
git add .
git commit -m "feat: add login page"
git push
```

## Step 4: Submit a Pull Request (PR)

After finishing your task:

1. Go to the GitHub repository
2. Click "Compare & pull request"
3. Fill in PR title and description (e.g., what changed, what was tested)
4. Submit PR → team lead will review and merge

## Step 5: How to Sync main into Your Branch When Behind

If your branch shows something like "33 commits behind main":

1. Go to the repository on GitHub
2. Switch to your branch (e.g., dev/jialao)
3. Click "Compare & pull request" (if available) to merge main into your branch

Or use terminal commands:
```bash
git checkout dev/yourname
git pull origin main
git push origin dev/yourname
```

## Notes

- Never commit or push directly to `main`
- Always work in your own branch (e.g., `dev/yournanme`)
- Sync with `main` regularly using rebase or merge
- All changes must go through a PR

If your branch shows **"nothing to compare"** when opening a PR, it means your branch was not created from the latest `main`. Please recreate your branch correctly or contact Jialao for help.

## Development Environment Setup

### Required Software
- Node.js (v16+)
- Visual Studio Code
- Git

### Project Setup

1. Install dependencies
```bash
npm install
```

2. Start the local development server
```bash
npm run serve
```
The project will automatically run at:
http://localhost:5173/

If you want to allow other devices on your local network to access it, the host is already enabled by default.

## Code Standards

### JavaScript Code Style Guide (.js files)

To ensure code consistency (and avoid errors during school computer demonstrations), please follow these JavaScript coding standards:

#### Basic Rules

- **Semicolons**
  Always add a semicolon (;) at the end of each statement to avoid potential issues caused by Automatic Semicolon Insertion (ASI).

---

Maintained: **Jialao(Jarvis)**
