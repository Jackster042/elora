# Security Updates (2025-12-12)
This document summarizes security-related updates reviewed on December 12, 2025.

## React Server Components advisory (React blog post dated 2025-12-11)
Advisory title: "Denial of Service and Source Code Exposure in React Server Components".

### Reported vulnerabilities
The advisory describes additional vulnerabilities in React Server Components (RSC) packages:
- Denial of Service (High): CVE-2025-55184 and CVE-2025-67779
- Source Code Exposure (Medium): CVE-2025-55183

### Impact assessment for this repository
The advisory applies to projects that use React Server Components via the following packages:
- `react-server-dom-webpack`
- `react-server-dom-parcel`
- `react-server-dom-turbopack`

We verified that none of the above packages are installed (directly or transitively) in this repository’s root, `client`, or `server` workspaces. As a result, this project is not expected to be affected by these specific CVEs.

### Actions taken
- No dependency upgrades were required for this advisory because the impacted RSC packages are not present.
- If React Server Components are introduced later (e.g., by adding an RSC-capable framework/bundler), re-check installed packages and upgrade to the fixed versions referenced in the React advisory.
