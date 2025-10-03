import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-incident-form',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './incident-form.component.html',
  styleUrl: './incident-form.component.css'
})
export class IncidentFormComponent implements OnInit {
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
    this.submitted = true;
    
    if (this.applyForm.valid) {
      console.log('Form data:', this.applyForm.value);
      this.httpClient.post('http://localhost:5000/api/incidents', this.applyForm.value)
      .subscribe({
        next: (response) => {
          console.log('Incident reported successfully:', response);
          alert('Incident reported successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error reporting incident:', error);
          alert('Failed to report incident. Please try again.');
        }
      });
    }
  }
  
  vulnerabilityUrl = 'http://localhost:5000/api/vulnerabilities';
  vulnerabilities: any[] = [];
  submitted = false;

  applyForm = new FormGroup({
    vulnerabilityId: new FormControl('', Validators.required),
    assignedTo: new FormControl('', [Validators.required, Validators.email]),
    priority: new FormControl('HIGH', Validators.required),
    description: new FormControl('', Validators.maxLength(500)),
  });
}