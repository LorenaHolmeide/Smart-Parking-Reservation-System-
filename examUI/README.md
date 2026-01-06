**This project was submitted as part of the individual home exam for MH130 - Programming of User Interfaces and Architecture, Fall 2024.**
**Achieved Grade: A**

# Smart Parking Reservation System - Majorstuen (MH130)

This project is a prototype of an interactive parking reservation system developed for the Oslo municipality. The system is designed to address challenges with unpredictable parking in the Majorstuen area by providing real-time availability and seamless booking.

---

## 1. Project Overview

The project consists of a front-end prototype and a documented back-end architecture. The solution focuses on:

- **Real-time Overview:** Users can view available parking spaces on an interactive map (based on Leaflet).
- **Easy Reservation:** An intuitive flow for finding, selecting, and reserving a spot.
- **Universal Design:** Design choices are based on accessibility and usability principles for all user groups.

---

## 2. Architecture and Design Patterns

The back-end structure is modeled with UML class diagrams and follows modern software architecture principles:

- **Design Pattern:** Implementation of a "Gang of Four" design pattern (see UML documentation for details) to ensure a scalable and maintainable codebase.
- **Components:**
  - **Parking Components:** Handles parking space status and data.
  - **Reservation Components:** Logic for booking and validation.
  - **User Account Components:** User management and overview of personal reservations.

---

## 3. User Experience (UI/UX)

In line with the MH130 curriculum, the prototype focuses on bridging:

- **Gulf of Execution:** Through clear search fields and navigation elements, users easily understand how to operate the system.
- **Gulf of Evaluation:** Immediate visual feedback (via maps and confirmations) lets users know if an action was successful.
- **Universal Design:** The solution has been evaluated against principles such as equitable use, flexibility, and low physical effort.

---

## 4. Technologies

- **Front-end:** HTML5, CSS3, and JavaScript.
- **Map Integration:** Leaflet.js and OpenStreetMap/Nominatim for geocoding.
- **Documentation:** UML modeling and academic report with IEEE citation style.

---

## 5. Installation and Running

1. Clone or download the repository.
2. Open `Index.html` in a modern browser (Chrome, Firefox, or Edge).
   From terminal:

   - MAC:
     cd /path/pages/index.html
     open Index.html

   - Windows:
     cd C:\path\pages\index.html
     start Index.html

3. Ensure an internet connection so that external libraries like Leaflet load correctly.
