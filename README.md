# SOC Dashboard Project

Stack: Angular + Flask + PostgreSQL

## Description

SOC Project est un projet de démonstration visant à présenter mes compétences en développement full-stack à travers la création d’une application de gestion des vulnérabilités et des incidents de sécurité.

## Installation et lancement

1. Cloner le repository
2. Lancer les containers :
```bash
   docker-compose up --build
```

## Accéder à l'application :

Frontend : http://localhost:4200
Backend API :
- Liste des vulnérabilités: http://localhost:5000/vulnerabilities
- Liste des incidents: http://localhost:5000/incidents
PostgreSQL : localhost:5432

## Développement
Pour arrêter les containers :
```bash
   docker-compose down
```
Pour voir les logs :
```bash
   docker-compose logs -f
```
