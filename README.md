---

# Harmonized Data Import Tool

## Overview

This tool, developed as part of a thesis at Heidelberg University and DKFZ Heidelberg, provides a streamlined solution
for importing clinical research data into the open-source image analysis platform Kaapana. It aims to harmonize tabular
data from various sources, ensuring consistency and compatibility with Kaapana's data processing capabilities.

## Features

- **Data Harmonization:** Automatically aligns disparate data formats and structures into a unified format compatible
  with [Kaapana](https://www.kaapana.ai).
- **User-Friendly Interface:** A React-based GUI that simplifies the process of data importation and management.
- **Extensible Framework:** Designed with modularity in mind, allowing for easy expansion and customization.
- **Comprehensive Error Handling:** Provides detailed feedback on importation errors, facilitating quick
  troubleshooting.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 12.x or later)
- Yarn package manager

Additionally, access to a Kaapana instance is necessary for the tool's full functionality.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourrepository/harmonized-data-import-tool.git
   ```
2. Navigate to the project directory:
   ```bash
   cd harmonized-data-import-tool
   ```
3. Install dependencies using Yarn:
   ```bash
   yarn install
   ```

## Usage

To run the application locally:

1. Start the development server:
   ```bash
   yarn start
   ```
2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The application will reload if you make edits. You will also see any lint errors in the console.

## Configuration

Configuration details specific to data sources and Kaapana can be found in the `config` directory. Adjust these
parameters to match your environment and data structure requirements.

## Contributing

We welcome contributions to improve the tool's functionality and extend its features.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

Incorporating your request, here is an updated Acknowledgments section for the README:

---

## Acknowledgments

This tool was developed as part of a Bachelor's thesis by Lucas Kulla under the supervision of Prof. Dr. Klaus
Maier-Hein and M.Sc. Philipp Schader at Heidelberg University. It is a fork of
the [React Spreadsheet Import](https://github.com/UgnisSoftware/react-spreadsheet-import) project by UgnisSoftware,
adapted and extended to meet the specific requirements of harmonizing clinical research data for the Kaapana platform.
This acknowledgment pays homage to the original project while highlighting the contributions and support from your
academic and development team.

---

This README template provides a starting point. You should customize each section to fit the specific details and
requirements of your project, such as the exact installation steps, configuration details, and contribution guidelines.
Additionally, ensure all links (e.g., to the repository, documentation, or external resources) are correct and
functional before publishing.
