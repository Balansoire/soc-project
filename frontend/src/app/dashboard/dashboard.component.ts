import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly httpClient: HttpClient
  ) {
    this.vulnerabilities = [];
  }

  ngOnInit() {
    this.loadVulnerabilities();
  }

  loadVulnerabilities() {
    this.httpClient.get(this.vulnerabilityUrl).subscribe((data: any) => {
      this.vulnerabilities = data;
      this.countVulnerabilities();
    });
  }

  countVulnerabilities() {
    this.vulnerabilityCounts = {
      all: this?.vulnerabilities.length || 0,
      critical: this?.vulnerabilities.filter(v => v.severity === 'CRITICAL').length || 0,
      high: this?.vulnerabilities.filter(v => v.severity === 'HIGH').length || 0,
      medium: this?.vulnerabilities.filter(v => v.severity === 'MEDIUM').length || 0,
      low: this?.vulnerabilities.filter(v => v.severity === 'LOW').length || 0,
    };
  }

  shownVulnerabilities() {
    if (this.filter === 'ALL') {
      return this.vulnerabilities;
    } else {
      return this.vulnerabilities.filter(v => v.severity === this.filter);
    }
  }

  goToIncidentForm() {
    this.router.navigate(['/incident-form']);
  }

  vulnerabilityUrl = 'http://localhost:5000/api/vulnerabilities';

  filter: 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'ALL';

  vulnerabilities: any[] = [];

  vulnerabilityCounts = {
      all: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
  };
}