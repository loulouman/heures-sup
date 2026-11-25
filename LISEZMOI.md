# Heures sup – mise en route

Petite appli web installable sur téléphone (Android et iPhone) qui écrit directement dans la feuille de temps Excel sur le OneDrive pro de chaque personne :
- **Date** : par défaut aujourd'hui. L'appli ouvre l'onglet du mois (janvier…décembre) et cherche la ligne de cette date dans la colonne A.
- **Heures supplémentaires** : +1 / +2 / +3 / +4, écrit en colonne **F**.
- **Observation** : texte écrit en colonne **G**.

Au premier lancement, chacun se connecte avec son compte Microsoft ADMR et choisit son propre fichier (recherche « Feuille mensuelle » ou navigation dans son OneDrive). Le choix est retenu sur le téléphone ; « changer » permet d'en prendre un autre (par exemple le fichier 2027).

## 1. Héberger l'appli (une fois)

L'appli doit être servie en HTTPS. Le plus simple : **GitHub Pages** (gratuit).
1. Créer un dépôt, par exemple `heures-sup`, et y déposer tous les fichiers de ce dossier.
2. Settings → Pages → Branch `main` / dossier racine → Save.
3. L'adresse sera du type `https://TON-COMPTE.github.io/heures-sup/` (garder le `/` final).

(Azure Static Web Apps ou n'importe quel serveur HTTPS conviennent aussi.)

## 2. Déclarer l'appli dans Entra ID (une fois)

Sur https://entra.microsoft.com avec un compte admin du locataire ADMR 65 :
1. Applications → Inscriptions d'applications → **Nouvelle inscription**.
   - Nom : `Heures sup`
   - Types de comptes : *Comptes dans cet annuaire organisationnel uniquement*
   - URI de redirection : plateforme **Application monopage (SPA)**, valeur = l'adresse exacte de l'étape 1 (ex. `https://TON-COMPTE.github.io/heures-sup/`).
2. Noter l'**ID d'application (client)** et l'**ID de l'annuaire (locataire)**.
3. Autorisations d'API → Microsoft Graph → délégué : `Files.ReadWrite` et `User.Read`. Si les utilisateurs n'ont pas le droit de consentir eux-mêmes, cliquer **Accorder un consentement d'administrateur**.

## 3. Renseigner les identifiants

Dans `index.html`, en haut du script :
```js
const CONFIG = {
  clientId: "ID d'application (client)",
  tenantId: "ID de l'annuaire (locataire)"
};
```
Recommiter sur GitHub.

## 4. Installer sur le téléphone

- **Android (Chrome / Edge)** : ouvrir l'adresse → menu ⋮ → *Installer l'application* (ou *Ajouter à l'écran d'accueil*).
- **iPhone (Safari)** : ouvrir l'adresse → bouton Partager → *Sur l'écran d'accueil*.

## Bon à savoir

- L'écriture passe par Microsoft Graph : pas besoin que le fichier soit synchronisé sur le téléphone, et ça fonctionne même si le fichier est ouvert dans Excel en parallèle (co-édition). Si Excel le verrouille ponctuellement, l'appli affiche « fichier verrouillé » : il suffit de réessayer.
- Si une valeur existe déjà en F pour ce jour (ex. −4 de récup), elle est affichée sous la date et sera **remplacée** à l'enregistrement.
- L'observation déjà présente en G est pré-remplie, pour ne pas l'écraser par erreur.
- Le solde d'heures affiché est celui de la ligne « SOLDE FIN » de l'onglet du mois.
- Le fichier doit garder sa structure : un onglet par mois nommé en toutes lettres, les dates en colonne A.
