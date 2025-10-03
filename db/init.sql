CREATE TABLE IF NOT EXISTS vulnerabilities (
  id TEXT PRIMARY KEY,
  title TEXT,
  severity TEXT,
  system TEXT,
  description TEXT,
  status TEXT,
  discoveredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cvssScore REAL
);

CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  vulnerabilityId TEXT,
  assignedTo TEXT,
  priority TEXT,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vulnerabilities (id, title, severity, system, description, status, cvssScore) VALUES
('CVE-2025-001', 'SQL Injection vulnerability in login form', 'CRITICAL', 'web-app-pro-01', 'Paramètres non échappés dans la requête du login', 'OPEN', 9.5),
('CVE-2025-002', 'Cross-Site Scripting (XSS) in Admin Panel', 'HIGH', 'admin-dashboard', 'An XSS vulnerability in the admin panel allows attackers to inject malicious scripts.', 'IN_PROGRESS', 7.8),
('CVE-2025-003', 'Outdated SSL/TLS Configuration', 'MEDIUM', 'mail-server-01', 'The mail server is using outdated SSL/TLS protocols that are vulnerable to attacks.', 'OPEN', 5.3),
('CVE-2025-004', 'Information Disclosure in API Response', 'LOW', 'api-gateway', 'Sensitive information is exposed in the API response headers.', 'RESOLVED', 3.0),
('CVE-2025-005', 'Directory Traversal Vulnerability', 'HIGH', 'file-server-02', 'A directory traversal vulnerability in the file server allows attackers to access restricted files.', 'OPEN', 8.3);
