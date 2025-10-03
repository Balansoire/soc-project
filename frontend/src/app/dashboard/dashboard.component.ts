import { Component, OnInit } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgClass],
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
    });
  }

  goToIncidentForm() {
    this.router.navigate(['/incident-form']);
  }

  vulnerabilityUrl = 'http://localhost:5000/api/vulnerabilities';

  vulnerabilities: any[] = [];

  vulnerabilityCounts = {
    all: this?.vulnerabilities.length || 0,
    critical: this?.vulnerabilities.filter(v => v.severity === 'Critical').length || 0,
    high: this?.vulnerabilities.filter(v => v.severity === 'High').length || 0,
    medium: this?.vulnerabilities.filter(v => v.severity === 'Medium').length || 0,
    low: this?.vulnerabilities.filter(v => v.severity === 'Low').length || 0,
  };
}
