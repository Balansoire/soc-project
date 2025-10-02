# Mon Projet Full Stack

Stack: Angular + Flask + PostgreSQL

## Installation et lancement

1. Cloner le repository
2. Lancer les containers :
```bash
   docker-compose up --build
```

## Accéder à l'application :

Frontend : http://localhost:4200
Backend API : http://localhost:5000
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