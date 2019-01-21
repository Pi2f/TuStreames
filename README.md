# Tu Streames !

TuStreames est une application de streaming de vidéos YouTube et Vimeo. Cette application comprend un système d'authentification. Chaque utilisateur connecté peut créer une playlist de vidéos qu'il a précédemment streamé.

## Getting Started

### Prérequis
- ` node 8.11.1 `
- ` mongoDB `
- ` npm ` ou ` yarn `

### Intro

Pour utiliser l'application, vous aurez besoin d'héberger 4 applications :

- user-tustreames : Gestion des utilisateurs en base de données
- log-tustreames : Gestion des historiques en base de données
- playlist-tustreames : Gestion des playlists en base de données
- tustreames : Application principale comprenant la partie client et les appels vers les applications de gestion. 

Pour configurer chaque application vous devez modifier les fichiers de configuration ` config.js `
de chaque application.


### Configuration 
---
Fichier de configuration de log-tustreames & playlist-tustreames 
``` javascript

module.exports = {
    urlDB: "mongodb://<user>:<password>@<hostname>:<port>/<DBname>", // url de la base de données mongo
    port: '3000', // port d'écoute du serveur
}

```
---
Fichier de configuration de user-tustreames
``` javascript

module.exports = {
    urlDB: "mongodb://<user>:<password>@<hostname>:<port>/<DBname>", // url de la base de données mongo
    port: '3000', // port d'écoute du serveur
    mail: '<mailAdress>', // Adresse du compte email attaché à l'application example noreply@hostname.com
    pass: '<password>', // Mot de passe associé à l'email
    mailService: '<mailService>' // Service de messagerie example gmail
}

```
---
Fichier de configuration de tustreames

Récupérer au préalables les identifiants pour utiliser les API en suivant ces tutoriels :
- https://developer.vimeo.com/api/start
- https://medium.com/@naz_islam/how-to-authenticate-google-cloud-services-on-heroku-for-node-js-app-dda9f4eda798

``` javascript

module.exports = {
    port: '3000', // port d'écoute du serveur
    secret : 'tokenSecret', // token public secret 
    userApiUrl : '<urlAdress>', // adresse de l'application user-tustreames
    playlistApiUrl : '<urlAdress>', // adresse de l'application playlist-tustreames
    logApiUrl : '<urlAdress>', // adresse de l'application log-tustreames,

    // Identifiants pour utiliser l'API de Vimeo
    vimeo: {
        clientID :,
        unauthenticatedToken:,
        secret:
    },

    // Identifiants pour utiliser l'API de Google
    google: {
        GOOGLE_PRIVATE_KEY:,
        GOOGLE_CLIENT_EMAIL:,
    }
}

```

### Exécution

Pour exécuter les applications il suffit de lancer la commande ` npm start ` pour chaque application.

## Important

N'oublier pas après la création du premier utilisateur administrateur en base de données de modifier son champ `isAdmin` à `true` pour qu'il puisse accéder à son espage d'administrateur.








