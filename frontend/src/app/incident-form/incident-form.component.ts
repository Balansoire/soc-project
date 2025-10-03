import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-incident-form',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './incident-form.component.html',
  styleUrl: './incident-form.component.css'
})
export class IncidentFormComponent {
  constructor(private readonly router: Router) {}

  applyForm = new FormGroup({
    vulnerabilityId: new FormControl('', Validators.required),
    assignedTo: new FormControl('', [Validators.required, Validators.email]),
    priority: new FormControl('HIGH', Validators.required),
    description: new FormControl('', Validators.maxLength(500)),
  });

  // Getters pour faciliter l'accès dans le template
  get vulnerabilityId() {
    return this.applyForm.get('vulnerabilityId');
  }

  get assignedTo() {
    return this.applyForm.get('assignedTo');
  }

  get priority() {
    return this.applyForm.get('priority');
  }

  get description() {
    return this.applyForm.get('description');
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.applyForm.markAllAsTouched();
    
    if (this.applyForm.valid) {
      console.log('Form data:', this.applyForm.value);
      // TODO: submit to backend
      alert('Incident reported successfully!');
      this.router.navigate(['/dashboard']);
    }
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
}