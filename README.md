#  chromecast-example-node
Un exemple d'utilisation d'une Google Home Mini en tant qu'enceinte connecté via le protocole Google Cast.


##  Dépendances
* **SvoxPico** : `apt install libttspico-utils` *(nécessite d'activer les dépôts **non-free**)*
* **NodeJS v8+** : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

## Installation

1. Cloner le dépôt : `git clone https://github.com/ByTheHugo/chromecast-example-node`
2. Rentrer dans le répertoire : `cd chromecast-example-node`
3. Installer les dépendances : `npm install`
4. Configurer l'application en éditant les constantes *(voir ci-dessous)*
5. Lancer le programme : `node index.js`

## Constantes à éditer
* **APP_PORT** : port sur lequel les fichiers audio générés seront accessibles.
* **HOST_IP** : adresse IP de la machine sur laquelle tourne le programme.
* **CHROMECAST_IP** : adresse IP de l'appareil compatible Google Cast.
* **PICO2WAVE_BIN** : chemin absolu du binaire *Pico2Wave* utilisé pour le *Text-to-Speech*.
* **PUBLIC_PATH** : chemin absolu du dossier permettant de stocker les fichiers audio temporaires.
* **TEXT_TO_SAY** : texte à faire prononcer à votre appareil compatible Google Cast.
