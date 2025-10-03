import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private readonly router: Router) {}

  goToIncidentForm() {
    this.router.navigate(['/incident-form']);
  }

  vulnerabilities = [
    {
      id: 'CVS-2024-0001',
      title: 'SQL Injection vulnerability in login form',
      severity: 'Critical',
      system: 'web-app-prod-01',
      status: 'OPEN',
      discoveredAt: "2024-01-15T10:30:00Z",
      cvssScore: 7.5,
    },
    {
      id: 'CVS-2024-0002',
      title: 'Cross-Site Scripting (XSS) in Admin Panel',
      severity: 'High',
      system: 'admin-dashboard',
      status: 'IN_PROGRESS',
      discoveredAt: "2024-01-16T11:00:00Z",
      cvssScore: 7.8,
    },
    {
      id: 'CVS-2024-0003',
      title: 'Outdated SSL/TLS Configuration',
      severity: 'Medium',
      system: 'mail-server-01',
      status: 'OPEN',
      discoveredAt: "2024-01-17T12:00:00Z",
      cvssScore: 5.3,
    },
    {
      id: 'CVS-2024-0004',
      title: 'Information Disclosure in API Response',
      severity: 'Low',
      system: 'api-gateway',
      status: 'RESOLVED',
      discoveredAt: "2024-01-18T09:00:00Z",
      cvssScore: 3.1,
    },
    {
      id: 'CVS-2024-0005',
      title: 'Directory Traversal Vulnerability',
      severity: 'High',
      system: 'file-server-02',
      status: 'OPEN',
      discoveredAt: "2024-01-19T14:00:00Z",
      cvssScore: 8.1,
    },
  ]

  vulnerabilityCounts = {
    all: this?.vulnerabilities.length || 0,
    critical: this?.vulnerabilities.filter(v => v.severity === 'Critical').length || 0,
    high: this?.vulnerabilities.filter(v => v.severity === 'High').length || 0,
    medium: this?.vulnerabilities.filter(v => v.severity === 'Medium').length || 0,
    low: this?.vulnerabilities.filter(v => v.severity === 'Low').length || 0,
  };
}
